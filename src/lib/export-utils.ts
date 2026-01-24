import * as XLSX from "xlsx";

/**
 * Export data to Excel file
 * @param data - Array of objects to export
 * @param filename - Name of the file (without extension)
 * @param sheetName - Name of the worksheet
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  sheetName: string = "Sheet1",
) {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Format families data for Excel export
 */
export function formatFamiliesForExport(families: any[]) {
  return families.map((family) => ({
    "Family Name": family.familyName || "",
    "National ID": family.nationalId || "",
    Phone: family.phone || "",
    "Backup Phone": family.backupPhone || "",
    Gender: family.gender || "",
    "Date of Birth": family.dob || "",
    Camp:
      typeof family.camp === "string" ? family.camp : family.camp?.name || "",
    "Total Members": family.totalMembers || 0,
    "Tent Number": family.tentNumber || "",
    Location: family.location || "",
    "Marital Status": family.maritalStatus?.name || "",
    "Medical Condition": family.medicalCondition?.name || "Healthy",
    Notes: family.notes || "",
    "Created At": family.createdAt
      ? new Date(family.createdAt).toLocaleDateString()
      : "",
  }));
}

/**
 * Format families with their members for Excel export (Flattened)
 */
export function formatFamiliesWithMembersForExport(
  familiesWithMembers: { family: any; members: any[] }[],
) {
  const flattenedData: any[] = [];

  familiesWithMembers.forEach(({ family, members }) => {
    // If no members found (which shouldn't happen usually as head is a member), just add family info
    if (!members || members.length === 0) {
      flattenedData.push({
        "Family ID": family.id,
        "Family Name": family.familyName || "",
        "Head National ID": family.nationalId || "",
        Contact: family.phone || "",
        Camp:
          typeof family.camp === "string"
            ? family.camp
            : family.camp?.name || "",
        "Tent Number": family.tentNumber || "",
        "Member Name": "-",
        "Member National ID": "-",
        "Member Gender": "-",
        "Member DOB": "-",
        "Member Relationship": "-",
        "Member Med. Condition": "-",
      });
      return;
    }

    // Add a row for each member
    members.forEach((member) => {
      flattenedData.push({
        "Family ID": family.id,
        "Family Name": family.familyName || "",
        "Head National ID": family.nationalId || "",
        Contact: family.phone || "",
        Camp:
          typeof family.camp === "string"
            ? family.camp
            : family.camp?.name || "",
        "Tent Number": family.tentNumber || "",
        "Member Name": member.name,
        "Member National ID": member.nationalId,
        "Member Gender": member.gender,
        "Member DOB": member.dob,
        "Member Relationship": member.relationship,
        "Member Med. Condition": member.medicalCondition || "Healthy",
      });
    });
  });

  return flattenedData;
}
