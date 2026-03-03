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
  "relationship_id", // صلة القرابة (نص: أب، أم، ابن، زوجة...)
  "family_name", // اسم العائلة (مطلوب لرب الأسرة فقط)
  "name", // اسم الفرد
  "national_id", // رقم هوية الفرد
  "dob", // تاريخ الميلاد YYYY-MM-DD
  "gender", // male / female
  "phone", // الهاتف
  "backup_phone", // هاتف احتياطي
  "total_members", // عدد الأفراد
  "marital_status_id", // الحالة الاجتماعية (نص: أعزب، متزوج...)
  "tent_number", // رقم الخيمة
  "location", // الموقع
  "notes", // ملاحظات
  "medical_condition", // الحالة الصحية (نص)
];

export interface ImportLookups {
  maritalStatuses: { id: number; name: string }[];
  relationships: { id: number; name: string }[];
  medicalConditions: { id: number; name: string }[];
}

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
      "رب الأسرة", // relationship
      "عائلة آل السيد",
      "أحمد السيد",
      "123456789",
      "1980-05-12",
      "male",
      "+201234567890",
      "",
      3,
      "متزوج", // marital_status
      "T-12",
      "القطاع أ",
      "",
      "",
    ],
    // Family 1 - Member 1 (link by ID)
    [
      "123456789",
      "زوجة",
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
    ],
    // Family 1 - Member 2
    [
      "123456789",
      "ابن",
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
 * Maps text names for relationships, marital statuses, and medical conditions to IDs.
 */
export async function parseFamiliesExcel(
  file: File,
  lookups?: ImportLookups,
): Promise<any[]> {
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

  const findIdByName = (
    list: { id: number; name: string }[] | undefined,
    name: string,
    defaultId: number = 1,
  ): number => {
    if (!list || !name) return defaultId;
    const cleanName = name.trim().toLowerCase();
    const match = list.find(
      (item) => item.name.trim().toLowerCase() === cleanName,
    );
    return match ? match.id : defaultId;
  };

  const findMedicalCondition = (
    list: { id: number; name: string }[] | undefined,
    name: string,
  ): { id: number | null; text: string | null } => {
    if (!name) return { id: null, text: null };
    const cleanName = name.trim().toLowerCase();
    const match = list?.find(
      (item) => item.name.trim().toLowerCase() === cleanName,
    );
    if (match) return { id: match.id, text: null };
    return { id: null, text: name.trim() };
  };

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
    const relText = String(row["relationship_id"] || "").trim();
    // Try to find the relationship ID by name, default to 1 (Head) if not found or relText is 1
    const relId = isNaN(Number(relText))
      ? findIdByName(lookups?.relationships, relText, 1)
      : Number(relText) || 1;

    // If this is the head (rel=1), populate the family metadata
    if (relId === 1) {
      const maritalText = String(row["marital_status_id"] || "").trim();
      const maritalId = isNaN(Number(maritalText))
        ? findIdByName(lookups?.maritalStatuses, maritalText, 1)
        : Number(maritalText) || 1;

      group.family_name = String(row["family_name"] || row["name"] || "");
      group.dob = String(row["dob"] ?? "");
      group.phone = String(row["phone"] ?? "");
      group.backup_phone = row["backup_phone"] || null;
      group.total_members = Number(row["total_members"]) || 1;
      group.marital_status_id = maritalId;
      group.tent_number = String(row["tent_number"] ?? "");
      group.location = String(row["location"] ?? "");
      group.notes = String(row["notes"] ?? "");
    }

    const medInfo = findMedicalCondition(
      lookups?.medicalConditions,
      String(row["medical_condition"] || ""),
    );

    // Add this person as a member
    group.members.push({
      name: String(row["name"] ?? ""),
      gender:
        String(row["gender"]).toLowerCase() === "female" ? "female" : "male",
      dob: String(row["dob"] ?? ""),
      national_id: normaliseId(row["national_id"]),
      relationship_id: relId,
      medical_condition: medInfo.text,
      medical_condition_id: medInfo.id,
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
/**
 * Generates an Excel file containing only the families that failed validation,
 * including an extra column specifying what went wrong in Arabic.
 */
export function downloadFailedFamilies(
  originalFamilies: any[],
  errors: Record<string, any>,
  lookups?: ImportLookups,
) {
  const wb = XLSX.utils.book_new();

  const getNameById = (list: any[] | undefined, id: any) => {
    if (!list || !id) return id;
    const match = list.find((item) => Number(item.id) === Number(id));
    return match ? match.name : id;
  };

  const formatError = (errorObj: any): string => {
    if (!errorObj) return "";
    let messages: string[] = [];
    if (errorObj.family) {
      Object.values(errorObj.family).forEach((msgs: any) => {
        if (Array.isArray(msgs)) messages.push(...msgs);
      });
    }
    if (errorObj.members) {
      Object.values(errorObj.members).forEach((memberErr: any) => {
        Object.values(memberErr).forEach((msgs: any) => {
          if (Array.isArray(msgs)) messages.push(...msgs);
        });
      });
    }
    return messages.join(" | ");
  };

  const headers = [...FAMILY_IMPORT_HEADERS, "سبب الخطأ (Error Reason)"];
  const rows: any[] = [];

  Object.keys(errors).forEach((indexStr) => {
    const idx = parseInt(indexStr, 10);
    const family = originalFamilies[idx];
    if (!family) return;

    const errorMsg = formatError(errors[indexStr]);

    family.members.forEach((m: any, mIdx: number) => {
      rows.push([
        family.national_id,
        getNameById(lookups?.relationships, m.relationship_id),
        mIdx === 0 ? family.family_name : "",
        m.name,
        m.national_id,
        m.dob,
        m.gender,
        mIdx === 0 ? family.phone : "",
        mIdx === 0 ? family.backup_phone : "",
        mIdx === 0 ? family.total_members : "",
        getNameById(lookups?.maritalStatuses, family.marital_status_id),
        mIdx === 0 ? family.tent_number : "",
        mIdx === 0 ? family.location : "",
        mIdx === 0 ? family.notes : "",
        m.medical_condition ||
          getNameById(lookups?.medicalConditions, m.medical_condition_id) ||
          "",
        errorMsg,
      ]);
    });
  });

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws["!cols"] = headers.map(() => ({ wch: 30 }));
  XLSX.utils.book_append_sheet(wb, ws, "Families_To_Fix");
  XLSX.writeFile(wb, "failed_families_fix_this.xlsx");
}
