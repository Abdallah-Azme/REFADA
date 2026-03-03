import * as XLSX from "xlsx";
import { Family, FamilyMember } from "../types/family.schema";

// Wife relationship string as returned by the backend
const WIFE_RELATIONSHIP = "زوجة";

/**
 * Format families WITHOUT children (head + wife only).
 * Matches: "نسخة الفورمة المعتمدة للمخيمات.xlsx"
 *
 * Columns: الاسم الرباعي | رقم الهوية | اسم الزوجة رباعي | رقم هوية الزوجة
 *          | رقم الجوال | رقم الجوال 2 | عدد الافراد | الحالة الاجتماعية | ملاحظات
 *
 * Members come directly from the families list response (no extra API calls needed).
 */
export function formatFamiliesWithoutChildren(
  families: Family[],
): Record<string, string | number>[] {
  return families.map((family) => {
    const wife = (family.members ?? []).find(
      (m) => m.relationship?.trim() === WIFE_RELATIONSHIP,
    );

    return {
      "الاسم الرباعي": family.familyName || "",
      "رقم الهوية": family.nationalId || "",
      "اسم الزوجة رباعي": wife?.name || "",
      "رقم هوية الزوجة": wife?.nationalId || "",
      "رقم الجوال": family.phone || "",
      "رقم الجوال 2": family.backupPhone || "",
      "عدد الافراد": family.totalMembers || 0,
      "الحالة الاجتماعية": family.maritalStatus || "",
      ملاحظات: family.notes || "",
    };
  });
}

/**
 * Format families WITH all members (every member gets its own row).
 * Matches: "فورمة الاطفال رفاد.xlsx"
 *
 * Columns: الرقم | اسم ولي الأمر الرباعي | رقم الهوية الأب | رقم الجوال
 *          | اسم الفرد | رقم هوية الفرد | الجنس | تاريخ ميلاد الفرد
 *
 * Members come directly from the families list response (no extra API calls needed).
 */
export function formatFamiliesWithAllMembers(
  families: Family[],
): Record<string, string | number>[] {
  const rows: Record<string, string | number>[] = [];
  let rowNumber = 1;

  families.forEach((family) => {
    const members = family.members ?? [];

    // Non-head members (everyone whose nationalId != the family head's nationalId)
    const otherMembers = members.filter(
      (m) => m.nationalId !== family.nationalId,
    );

    if (otherMembers.length === 0) {
      // Family has no additional members — still add one row for the head
      rows.push({
        الرقم: rowNumber++,
        "اسم ولي الأمر الرباعي": family.familyName || "",
        "رقم الهوية الأب": family.nationalId || "",
        "رقم الجوال": family.phone || "",
        "اسم الفرد": "",
        "رقم هوية الفرد": "",
        الجنس: "",
        "تاريخ ميلاد الفرد": "",
      });
    } else {
      otherMembers.forEach((member: FamilyMember) => {
        const gender =
          member.gender === "male"
            ? "ذكر"
            : member.gender === "female"
              ? "أنثى"
              : "";

        rows.push({
          الرقم: rowNumber++,
          "اسم ولي الأمر الرباعي": family.familyName || "",
          "رقم الهوية الأب": family.nationalId || "",
          "رقم الجوال": family.phone || "",
          "اسم الفرد": member.name || "",
          "رقم هوية الفرد": member.nationalId || "",
          الجنس: gender,
          "تاريخ ميلاد الفرد": member.dob || "",
        });
      });
    }
  });

  return rows;
}

/**
 * Build and download a styled Excel workbook (RTL, olive header row).
 */
export function downloadStyledExcel(
  rows: Record<string, string | number>[],
  filename: string,
  sheetName: string,
) {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const wsData = [
    headers,
    ...rows.map((row) => headers.map((h) => row[h] ?? "")),
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  ws["!cols"] = headers.map(() => ({ wch: 22 }));
  (ws as any)["!sheetView"] = { rightToLeft: true };

  // Olive-green header styling matching the original templates
  headers.forEach((_, colIdx) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIdx });
    if (!ws[cellRef]) return;
    ws[cellRef].s = {
      fill: { patternType: "solid", fgColor: { rgb: "4A5E2C" } },
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
      alignment: { horizontal: "center", vertical: "center", readingOrder: 2 },
      border: {
        bottom: { style: "thin", color: { rgb: "FFFFFF" } },
        right: { style: "thin", color: { rgb: "FFFFFF" } },
      },
    };
  });

  ws["!freeze"] = { xSplit: 0, ySplit: 1 };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// ────────────────────────────────────────────────────────────────────────────
// Template generation
// The template matches the /families/upload JSON body structure so users
// know exactly which columns / values to fill in.
// ────────────────────────────────────────────────────────────────────────────

/** Column headers for the families sheet (one row per FAMILY HEAD). */
const FAMILY_TEMPLATE_HEADERS = [
  "family_name", // الاسم الرباعي
  "national_id", // رقم الهوية
  "dob", // تاريخ الميلاد (YYYY-MM-DD)
  "phone", // رقم الهاتف
  "backup_phone", // رقم هاتف احتياطي
  "total_members", // عدد الأفراد
  "marital_status_id", // معرّف الحالة الاجتماعية (رقم)
  "tent_number", // رقم الخيمة
  "location", // الموقع
  "notes", // ملاحظات
];

/** Column headers for the members sheet (one row per MEMBER). */
const MEMBER_TEMPLATE_HEADERS = [
  "family_national_id", // رقم هوية رب الأسرة (يربط العائلة بالأعضاء)
  "name", // اسم الفرد
  "gender", // الجنس (male / female)
  "dob", // تاريخ الميلاد (YYYY-MM-DD)
  "national_id", // رقم هوية الفرد
  "relationship_id", // معرّف صلة القرابة (رقم)
  "medical_condition", // الحالة الصحية (نص اختياري)
  "medical_condition_id", // معرّف الحالة الصحية (رقم، اختياري)
];

/**
 * Download a filled example template so admins know exactly what to fill.
 * Two sheets are created:
 *   1. "العائلات"  – one row per family head
 *   2. "الأفراد"   – one row per family member (linked by family_national_id)
 */
export function downloadFamiliesTemplate() {
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Families ────────────────────────────────────────────────────
  const familyRows = [
    FAMILY_TEMPLATE_HEADERS,
    // Example row 1
    [
      "آل السيد",
      "123456789",
      "1980-05-12",
      "+201234567890",
      "+201098765432",
      3,
      2,
      "T-12",
      "القطاع أ، مخيم 1",
      "لا توجد ملاحظات",
    ],
    // Example row 2
    [
      "محمد",
      "223344556",
      "1975-11-20",
      "+201112223334",
      "",
      2,
      1,
      "T-15",
      "القطاع ب، مخيم 1",
      "",
    ],
  ];

  const wsFamilies = XLSX.utils.aoa_to_sheet(familyRows);
  wsFamilies["!cols"] = FAMILY_TEMPLATE_HEADERS.map(() => ({ wch: 22 }));
  (wsFamilies as any)["!sheetView"] = { rightToLeft: true };

  // Style the header row (olive-green)
  FAMILY_TEMPLATE_HEADERS.forEach((_, colIdx) => {
    const ref = XLSX.utils.encode_cell({ r: 0, c: colIdx });
    if (!wsFamilies[ref]) return;
    wsFamilies[ref].s = {
      fill: { patternType: "solid", fgColor: { rgb: "4A5E2C" } },
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
      alignment: { horizontal: "center", vertical: "center", readingOrder: 2 },
    };
  });

  XLSX.utils.book_append_sheet(wb, wsFamilies, "العائلات");

  // ── Sheet 2: Members ────────────────────────────────────────────────────
  const memberRows = [
    MEMBER_TEMPLATE_HEADERS,
    // Members for family 123456789
    [
      "123456789",
      "أحمد السيد",
      "male",
      "2005-08-10",
      "987654321",
      1,
      "لا يوجد",
      "",
    ],
    [
      "123456789",
      "سارة السيد",
      "female",
      "2010-02-15",
      "876543219",
      2,
      "ربو",
      "",
    ],
    // Members for family 223344556
    ["223344556", "محمد علي", "male", "2000-03-22", "334455667", 1, "", ""],
    [
      "223344556",
      "فاطمة علي",
      "female",
      "2003-07-19",
      "445566778",
      2,
      "سكري",
      "",
    ],
  ];

  const wsMembers = XLSX.utils.aoa_to_sheet(memberRows);
  wsMembers["!cols"] = MEMBER_TEMPLATE_HEADERS.map(() => ({ wch: 22 }));
  (wsMembers as any)["!sheetView"] = { rightToLeft: true };

  MEMBER_TEMPLATE_HEADERS.forEach((_, colIdx) => {
    const ref = XLSX.utils.encode_cell({ r: 0, c: colIdx });
    if (!wsMembers[ref]) return;
    wsMembers[ref].s = {
      fill: { patternType: "solid", fgColor: { rgb: "4A5E2C" } },
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
      alignment: { horizontal: "center", vertical: "center", readingOrder: 2 },
    };
  });

  XLSX.utils.book_append_sheet(wb, wsMembers, "الأفراد");

  XLSX.writeFile(wb, "families_import_template.xlsx");
}

// ────────────────────────────────────────────────────────────────────────────
// Excel parser
// Reads the two-sheet workbook and returns the UploadFamiliesPayload families
// array (without camp_id – the caller must supply that).
// ────────────────────────────────────────────────────────────────────────────

export interface ParsedFamilyUploadRow {
  family_name: string;
  national_id: string;
  dob: string;
  phone: string;
  backup_phone: string | null;
  total_members: number;
  marital_status_id: number;
  tent_number: string;
  location: string;
  notes: string;
  members: {
    name: string;
    gender: "male" | "female";
    dob: string;
    national_id: string;
    relationship_id: number;
    medical_condition: string | null;
    medical_condition_id: number | null;
  }[];
}

/**
 * Parse a File object (Excel workbook) and return an array of families
 * ready to pass to `uploadFamiliesExcelApi`.
 *
 * Expects the same two-sheet layout as the template produced by
 * `downloadFamiliesTemplate()`.
 */
export async function parseFamiliesExcel(
  file: File,
): Promise<ParsedFamilyUploadRow[]> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });

  // ── Sheet 1: Families ────────────────────────────────────────────────────
  // Use position-based lookup (SheetNames[0]) as the primary — never rely on
  // an Arabic string match which can silently fail due to encoding differences.
  const familiesSheet = wb.Sheets[wb.SheetNames[0]] ?? wb.Sheets["العائلات"];

  // raw: false → XLSX formats every cell as a string.
  // This is critical so that purely numeric national_ids ("123456789" stored
  // as a number cell) come back as the string "123456789" rather than the
  // number 123456789, keeping Map keys consistent.
  const familiesRaw: any[] = familiesSheet
    ? XLSX.utils.sheet_to_json(familiesSheet, { defval: "", raw: false })
    : [];

  // ── Sheet 2: Members ─────────────────────────────────────────────────────
  const membersSheet =
    wb.SheetNames.length > 1
      ? (wb.Sheets[wb.SheetNames[1]] ?? wb.Sheets["الأفراد"])
      : undefined;

  const membersRaw: any[] = membersSheet
    ? XLSX.utils.sheet_to_json(membersSheet, { defval: "", raw: false })
    : [];

  // Normalise a cell value that may have been stored as a number with trailing
  // ".0" (e.g. "123456789.0") → "123456789"
  const normaliseId = (v: any): string =>
    String(v ?? "")
      .trim()
      .replace(/\.0+$/, "");

  // Group members by their family_national_id for O(1) lookup
  const membersByFamily = new Map<string, ParsedFamilyUploadRow["members"]>();
  for (const m of membersRaw) {
    const key = normaliseId(m["family_national_id"]);
    if (!key) continue;
    if (!membersByFamily.has(key)) membersByFamily.set(key, []);
    membersByFamily.get(key)!.push({
      name: String(m["name"] ?? ""),
      gender:
        String(m["gender"]).toLowerCase() === "female" ? "female" : "male",
      dob: String(m["dob"] ?? ""),
      national_id: normaliseId(m["national_id"]),
      relationship_id: Number(m["relationship_id"]) || 1,
      medical_condition: m["medical_condition"] || null,
      medical_condition_id: m["medical_condition_id"]
        ? Number(m["medical_condition_id"])
        : null,
    });
  }

  return familiesRaw
    .filter((row) => row["family_name"] || row["national_id"])
    .map((row) => {
      const nid = normaliseId(row["national_id"]);

      // ── Head of family (always members[0], relationship_id = 1) ──────────
      // This mirrors exactly what createFamilyApi does: it adds the family
      // head as members[0] using the family's own fields.
      const headMember = {
        name: String(row["family_name"] ?? ""),
        gender:
          String(row["gender"] ?? "male").toLowerCase() === "female"
            ? ("female" as const)
            : ("male" as const),
        dob: String(row["dob"] ?? ""),
        national_id: nid,
        relationship_id: 1,
        medical_condition: row["medical_condition"] || null,
        medical_condition_id: row["medical_condition_id"]
          ? Number(row["medical_condition_id"])
          : null,
      };

      // ── Extra members from the members sheet ─────────────────────────────
      const extraMembers = membersByFamily.get(nid) ?? [];

      return {
        family_name: String(row["family_name"] ?? ""),
        national_id: nid,
        dob: String(row["dob"] ?? ""),
        phone: String(row["phone"] ?? ""),
        backup_phone: row["backup_phone"] ? String(row["backup_phone"]) : null,
        total_members: Number(row["total_members"]) || 1,
        marital_status_id: Number(row["marital_status_id"]) || 1,
        tent_number: String(row["tent_number"] ?? ""),
        location: String(row["location"] ?? ""),
        notes: String(row["notes"] ?? ""),
        // Head goes first, then extra members — same order as createFamilyApi
        members: [headMember, ...extraMembers],
      };
    });
}
