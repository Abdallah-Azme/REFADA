import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
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

/**
 * Arabic column headers for the import template.
 * The ▼ symbol hints to users that those columns have dropdowns.
 */
const FAMILY_IMPORT_HEADERS_AR = [
  "رقم هوية رب الأسرة", // family_national_id
  "صلة القرابة", // relationship_id
  "اسم العائلة", // family_name
  "اسم الفرد", // name
  "رقم هوية الفرد", // national_id
  "تاريخ الميلاد", // dob  (YYYY-MM-DD)
  "الجنس", // gender  (male / female)
  "رقم الجوال", // phone
  "رقم جوال احتياطي", // backup_phone
  "عدد الأفراد", // total_members
  "الحالة الاجتماعية ▼", // marital_status_id  – dropdown
  "رقم الخيمة", // tent_number
  "الموقع", // location
  "ملاحظات", // notes
  "الحالة الصحية ▼", // medical_condition  – dropdown
];

/** English internal keys kept for parser compatibility */
const FAMILY_IMPORT_HEADERS = [
  "family_national_id",
  "relationship_id",
  "family_name",
  "name",
  "national_id",
  "dob",
  "gender",
  "phone",
  "backup_phone",
  "total_members",
  "marital_status_id",
  "tent_number",
  "location",
  "notes",
  "medical_condition",
];

// Column indices (0-based) that need dropdown validation
const MARITAL_STATUS_COL = 10; // marital_status_id
const MEDICAL_CONDITION_COL = 14; // medical_condition

export interface ImportLookups {
  maritalStatuses: { id: number; name: string }[];
  relationships: { id: number; name: string }[];
  medicalConditions: { id: number; name: string }[];
}

/** Header fill colour (olive green) */
const HEADER_COLOR = "4A5E2C";
/** Max rows to apply data-validation to (beyond sample rows) */
const VALIDATION_ROWS = 500;

/**
 * Downloads a single-sheet import template with:
 *   - Arabic column headers
 *   - Dropdown data-validation for marital status and medical condition
 *   - RTL sheet view
 *
 * Uses ExcelJS so real Excel dropdowns work (SheetJS free edition doesn't
 * support dataValidation).
 */
export async function downloadFamiliesTemplate(
  lookups?: ImportLookups,
): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Reffad System";
  wb.created = new Date();

  const maritalNames =
    lookups?.maritalStatuses?.map((s) => s.name) ?? [
      "أعزب",
      "متزوج",
      "مطلق",
      "أرمل",
    ];

  const medicalNames =
    lookups?.medicalConditions?.map((c) => c.name) ?? [
      "لا يوجد",
      "ربو",
      "سكري",
      "ضغط",
      "قلب",
      "أمراض أخرى",
    ];

  const maritalRange = `_options!$A$1:$A$${maritalNames.length}`;
  const medicalRange = `_options!$B$1:$B$${medicalNames.length}`;

  // ── 1. Main import sheet (MUST be first so SheetNames[0] points here) ────
  const ws = wb.addWorksheet("نموذج_الاستيراد", {
    views: [{ rightToLeft: true }],
  });

  // Column widths
  ws.columns = FAMILY_IMPORT_HEADERS_AR.map((header, idx) => ({
    header,
    key: FAMILY_IMPORT_HEADERS[idx],
    width: 24,
  }));

  // Style the header row
  const headerRow = ws.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${HEADER_COLOR}` },
    };
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      readingOrder: "rtl",
    };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
      right: { style: "thin", color: { argb: "FFFFFFFF" } },
    };
  });
  headerRow.height = 28;

  // ── 3. Sample rows ────────────────────────────────────────────────────────
  const sampleRows = [
    // Family head
    [
      "123456789",
      "رب الأسرة",
      "عائلة آل السيد",
      "أحمد السيد",
      "123456789",
      "1980-05-12",
      "male",
      "+201234567890",
      "",
      3,
      maritalNames[1] ?? "متزوج",
      "T-12",
      "القطاع أ",
      "",
      "",
    ],
    // Wife
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
      medicalNames[1] ?? "ربو",
    ],
    // Son
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

  sampleRows.forEach((rowData) => {
    const row = ws.addRow(rowData);
    // Force ID cells to text to prevent scientific notation
    const familyIdCell = row.getCell(1);
    const memberIdCell = row.getCell(5);
    familyIdCell.numFmt = "@";
    memberIdCell.numFmt = "@";
    // Style data rows lightly
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { readingOrder: "rtl" };
    });
  });

  // ── 4. Data validation (dropdowns) ───────────────────────────────────────
  // Apply to all rows that users might fill in (row 2 = first data row)
  const firstDataRow = 2;
  const lastDataRow = firstDataRow + VALIDATION_ROWS;

  // Marital status dropdown — column index MARITAL_STATUS_COL + 1 (ExcelJS is 1-based)
  const maritalColLetter = ws.getColumn(MARITAL_STATUS_COL + 1).letter;
  for (let r = firstDataRow; r <= lastDataRow; r++) {
    ws.getCell(`${maritalColLetter}${r}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [maritalRange],
      showErrorMessage: true,
      errorStyle: "warning",
      errorTitle: "قيمة غير صحيحة",
      error: "يرجى اختيار قيمة من القائمة",
      prompt: "اختر الحالة الاجتماعية",
      promptTitle: "الحالة الاجتماعية",
    };
  }

  // Medical condition dropdown — column index MEDICAL_CONDITION_COL + 1
  const medicalColLetter = ws.getColumn(MEDICAL_CONDITION_COL + 1).letter;
  for (let r = firstDataRow; r <= lastDataRow; r++) {
    ws.getCell(`${medicalColLetter}${r}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [medicalRange],
      showErrorMessage: true,
      errorStyle: "warning",
      errorTitle: "قيمة غير صحيحة",
      error: "يرجى اختيار قيمة من القائمة",
      prompt: "اختر الحالة الصحية",
      promptTitle: "الحالة الصحية",
    };
  }

  // Freeze the header row
  ws.views = [{ state: "frozen", ySplit: 1, rightToLeft: true }];

  // ── 2. Hidden options sheet (added AFTER main sheet so SheetNames[0] is data) ─
  const optionsSheet = wb.addWorksheet("_options");
  optionsSheet.state = "veryHidden";
  const maxOptions = Math.max(maritalNames.length, medicalNames.length);
  for (let i = 0; i < maxOptions; i++) {
    optionsSheet.getCell(i + 1, 1).value = maritalNames[i] ?? "";
    optionsSheet.getCell(i + 1, 2).value = medicalNames[i] ?? "";
  }

  // ── 3. Write & download ───────────────────────────────────────────────────
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "families_import_template.xlsx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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

  // Find the first sheet that is NOT the hidden options helper sheet.
  // The template adds "_options" as the second sheet, but guard against it
  // ever being first (e.g. opened & re-saved by some spreadsheet apps).
  const dataSheetName =
    wb.SheetNames.find((n) => n !== "_options") ?? wb.SheetNames[0];
  const sheet = wb.Sheets[dataSheetName];

  const rawRows: any[] = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false,
  });

  // ── Arabic → English key mapping ─────────────────────────────────────────
  // The downloaded template now uses Arabic headers as the visible column names.
  // When users re-upload the file, sheet_to_json will produce Arabic-keyed rows.
  // We normalise them to the English internal keys the parser expects.
  // Old English-header files are left unchanged (keys already match).
  const AR_TO_EN: Record<string, string> = {
    "رقم هوية رب الأسرة": "family_national_id",
    "صلة القرابة": "relationship_id",
    "اسم العائلة": "family_name",
    "اسم الفرد": "name",
    "رقم هوية الفرد": "national_id",
    "تاريخ الميلاد": "dob",
    "الجنس": "gender",
    "رقم الجوال": "phone",
    "رقم جوال احتياطي": "backup_phone",
    "عدد الأفراد": "total_members",
    "الحالة الاجتماعية ▼": "marital_status_id",
    "الحالة الاجتماعية": "marital_status_id",
    "رقم الخيمة": "tent_number",
    "الموقع": "location",
    "ملاحظات": "notes",
    "الحالة الصحية ▼": "medical_condition",
    "الحالة الصحية": "medical_condition",
  };

  const normaliseRow = (row: any): any => {
    const out: any = {};
    for (const [k, v] of Object.entries(row)) {
      const mapped = AR_TO_EN[k.trim()] ?? k;
      out[mapped] = v;
    }
    return out;
  };

  const normalizedRows = rawRows.map(normaliseRow);

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

  for (const row of normalizedRows) {
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
  if (!originalFamilies || !errors || Object.keys(errors).length === 0) {
    console.warn("No failed families to export or data missing.");
    return;
  }

  const wb = XLSX.utils.book_new();

  const getNameById = (list: any[] | undefined, id: any) => {
    if (!list || id === undefined || id === null) return id;
    const match = list.find((item) => String(item.id) === String(id));
    return match ? match.name : id;
  };

  const formatError = (errorObj: any): string => {
    if (!errorObj) return "";
    let messages: string[] = [];

    // Helper to extract messages from nested objects
    const extract = (obj: any) => {
      if (!obj) return;
      if (Array.isArray(obj)) {
        messages.push(...obj);
      } else if (typeof obj === "object") {
        Object.values(obj).forEach((v) => extract(v));
      }
    };

    extract(errorObj);
    return messages.join(" | ");
  };

  const headers = [...FAMILY_IMPORT_HEADERS, "سبب الخطأ (Error Reason)"];
  const rows: any[] = [];

  // Iterate over the keys in the errors object
  Object.entries(errors).forEach(([indexStr, errorDetail]) => {
    // The key might be the index in the 'families' array we sent.
    // We try 0-indexed first, then fall back to 1-indexed (idx - 1) if needed.
    const rawIdx = parseInt(indexStr, 10);
    if (isNaN(rawIdx)) return;

    // Try to find the family object.
    // Backend index '2' might mean originalFamilies[2] (0-indexed)
    // or originalFamilies[1] (1-indexed).
    let family = originalFamilies[rawIdx];

    // If not found at direct index, and index is > 0, try index - 1 (1-indexed fallback)
    if (!family && rawIdx > 0) {
      family = originalFamilies[rawIdx - 1];
    }

    if (!family) {
      console.warn(
        `[Excel Export] Skip index ${indexStr}: No matching family data found in the original list (list length: ${originalFamilies.length}).`,
      );
      return;
    }

    const errorSummary = formatError(errorDetail);

    // Each family can have multiple members; we need to recreate the flat structure
    family.members.forEach((m: any, mIdx: number) => {
      const row = [
        family.national_id || "", // family_national_id
        getNameById(lookups?.relationships, m.relationship_id) || "",
        mIdx === 0 ? family.family_name || "" : "",
        m.name || "",
        m.national_id || "",
        m.dob || "",
        m.gender || "male",
        mIdx === 0 ? family.phone || "" : "",
        mIdx === 0 ? family.backup_phone || "" : "",
        mIdx === 0 ? family.total_members || "" : "",
        getNameById(lookups?.maritalStatuses, family.marital_status_id) || "",
        mIdx === 0 ? family.tent_number || "" : "",
        mIdx === 0 ? family.location || "" : "",
        mIdx === 0 ? family.notes || "" : "",
        mIdx === 0
          ? m.medical_condition ||
            getNameById(lookups?.medicalConditions, m.medical_condition_id) ||
            ""
          : m.medical_condition || "",
        errorSummary, // The final column with the error
      ];
      rows.push(row);
    });
  });

  if (rows.length === 0) {
    console.error("No rows were constructed for the error file.");
    return;
  }

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Set column widths
  ws["!cols"] = headers.map(() => ({ wch: 25 }));
  // Make the error column wider
  ws["!cols"][headers.length - 1] = { wch: 50 };

  XLSX.utils.book_append_sheet(wb, ws, "Errors_To_Fix");
  XLSX.writeFile(wb, "failed_families_fix_this.xlsx");
}
