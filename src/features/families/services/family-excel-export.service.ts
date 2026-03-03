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

/** Combined headers for the new single-sheet structure. */
const FAMILY_IMPORT_HEADERS = [
  "family_national_id", // رقم هوية رب الأسرة (يربط الجميع معاً)
  "relationship_id", // 1=رب أسرة، 2=زوجة، 3=ابن...
  "family_name", // اسم العائلة (مطلوب لرب الأسرة فقط)
  "name", // اسم الفرد
  "national_id", // رقم هوية الفرد
  "dob", // تاريخ الميلاد YYYY-MM-DD
  "gender", // male / female
  "phone", // الهاتف
  "backup_phone", // هاتف احتياطي
  "total_members", // عدد الأفراد
  "marital_status_id", // الحالة الاجتماعية
  "tent_number", // رقم الخيمة
  "location", // الموقع
  "notes", // ملاحظات
  "medical_condition", // الحالة الصحية
  "medical_condition_id", // معرّف الحالة
];

/**
 * Downloads a single-sheet template where rows are grouped by family_national_id.
 */
export function downloadFamiliesTemplate() {
  const wb = XLSX.utils.book_new();

  const forceText = (
    ws: XLSX.WorkSheet,
    row: number,
    col: number,
    val: string,
  ) => {
    const ref = XLSX.utils.encode_cell({ r: row, c: col });
    ws[ref] = { t: "s", v: val, w: val };
  };

  const styleHeaders = (ws: XLSX.WorkSheet, count: number) => {
    for (let c = 0; c < count; c++) {
      const ref = XLSX.utils.encode_cell({ r: 0, c });
      if (!ws[ref]) continue;
      ws[ref].s = {
        fill: { patternType: "solid", fgColor: { rgb: "4A5E2C" } },
        font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  };

  const data = [
    FAMILY_IMPORT_HEADERS,
    // Family 1 - Head
    [
      "123456789",
      1,
      "عائلة آل السيد",
      "أحمد السيد",
      "123456789",
      "1980-05-12",
      "male",
      "+201234567890",
      "",
      3,
      2,
      "T-12",
      "القطاع أ",
      "",
      "",
      "",
    ],
    // Family 1 - Member 1 (link by ID)
    [
      "123456789",
      2,
      "",
      "سارة السيد",
      "876543219",
      "1985-02-10",
      "female",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "ربو",
      "",
    ],
    // Family 1 - Member 2
    [
      "123456789",
      3,
      "",
      "خالد السيد",
      "111222333",
      "2010-06-20",
      "male",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  // Force ID columns to text
  for (let i = 1; i < data.length; i++) {
    forceText(ws, i, 0, String(data[i][0])); // family_id
    forceText(ws, i, 4, String(data[i][4])); // individual_id
  }

  ws["!cols"] = FAMILY_IMPORT_HEADERS.map(() => ({ wch: 20 }));
  styleHeaders(ws, FAMILY_IMPORT_HEADERS.length);
  XLSX.utils.book_append_sheet(wb, ws, "Families_Import");

  XLSX.writeFile(wb, "families_import_template.xlsx");
}

/**
 * Enhanced parser for the single-sheet flat structure.
 */
export async function parseFamiliesExcel(
  file: File,
): Promise<ParsedFamilyUploadRow[]> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];

  const rawRows: any[] = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false,
  });

  const normaliseId = (v: any): string =>
    String(v ?? "")
      .trim()
      .replace(/\.0+$/, "");

  const familyGroups = new Map<string, any>();

  for (const row of rawRows) {
    const familyId = normaliseId(row["family_national_id"]);
    if (!familyId) continue;

    if (!familyGroups.has(familyId)) {
      familyGroups.set(familyId, {
        family_name: "",
        national_id: familyId,
        dob: "",
        phone: "",
        backup_phone: null,
        total_members: 1,
        marital_status_id: 1,
        tent_number: "",
        location: "",
        notes: "",
        members: [],
      });
    }

    const group = familyGroups.get(familyId);
    const relId = Number(row["relationship_id"]) || 1;

    // If this is the head (rel=1), populate the family metadata
    if (relId === 1) {
      group.family_name = String(row["family_name"] || row["name"] || "");
      group.dob = String(row["dob"] ?? "");
      group.phone = String(row["phone"] ?? "");
      group.backup_phone = row["backup_phone"] || null;
      group.total_members = Number(row["total_members"]) || 1;
      group.marital_status_id = Number(row["marital_status_id"]) || 1;
      group.tent_number = String(row["tent_number"] ?? "");
      group.location = String(row["location"] ?? "");
      group.notes = String(row["notes"] ?? "");
    }

    // Add this person as a member
    group.members.push({
      name: String(row["name"] ?? ""),
      gender:
        String(row["gender"]).toLowerCase() === "female" ? "female" : "male",
      dob: String(row["dob"] ?? ""),
      national_id: normaliseId(row["national_id"]),
      relationship_id: relId,
      medical_condition: row["medical_condition"] || null,
      medical_condition_id: row["medical_condition_id"]
        ? Number(row["medical_condition_id"])
        : null,
    });
  }

  // Final check: filter out groups that ended up with no name (invalid)
  // and ensure head is at index 0 for each group
  return Array.from(familyGroups.values())
    .filter((f) => f.family_name)
    .map((f) => {
      // Sort members so relationship_id 1 is first (just in case)
      f.members.sort((a: any, b: any) => a.relationship_id - b.relationship_id);
      return f;
    });
}
