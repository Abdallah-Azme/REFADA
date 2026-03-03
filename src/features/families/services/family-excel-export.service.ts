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
