import * as XLSX from "xlsx";

/**
 * Pagination metadata from API responses
 */
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

/**
 * API response with pagination
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta?: PaginationMeta;
}

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
 * Fetch all paginated data from an API
 * @param fetchFn - Function to fetch data with URLSearchParams
 * @param baseParams - Base query parameters (filters, search, etc.)
 * @param onProgress - Optional callback for progress updates
 * @returns All fetched data
 */
export async function fetchAllPaginatedData<T>(
  fetchFn: (params: string) => Promise<PaginatedResponse<T>>,
  baseParams: URLSearchParams,
  onProgress?: (current: number, total: number) => void,
): Promise<T[]> {
  const allData: T[] = [];
  let currentPage = 1;
  let lastPage = 1;

  // Set a high per_page to minimize API calls
  baseParams.set("per_page", "1000");

  do {
    baseParams.set("page", currentPage.toString());
    const response = await fetchFn(baseParams.toString());

    if (response.data && response.data.length > 0) {
      allData.push(...response.data);
    }

    if (response.meta) {
      lastPage = response.meta.last_page;
      if (onProgress) {
        onProgress(currentPage, lastPage);
      }
    } else {
      // No pagination metadata, assume single page
      break;
    }

    currentPage++;
  } while (currentPage <= lastPage);

  return allData;
}

/**
 * Export data to Excel with automatic pagination handling
 * @param fetchFn - Function to fetch paginated data
 * @param formatFn - Function to format data for Excel
 * @param baseParams - Base query parameters (filters, search, etc.)
 * @param filename - Name of the file (without extension)
 * @param sheetName - Name of the worksheet
 * @param onProgress - Optional callback for progress updates
 */
export async function exportToExcelWithPagination<T>(
  fetchFn: (params: string) => Promise<PaginatedResponse<T>>,
  formatFn: (data: T[]) => any[],
  baseParams: URLSearchParams,
  filename: string,
  sheetName: string = "Sheet1",
  onProgress?: (current: number, total: number) => void,
): Promise<void> {
  // Fetch all data across all pages
  const allData = await fetchAllPaginatedData(fetchFn, baseParams, onProgress);

  // Format data for Excel
  const formattedData = formatFn(allData);

  // Export to Excel
  exportToExcel(formattedData, filename, sheetName);
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
    "Marital Status":
      typeof family.maritalStatus === "string"
        ? family.maritalStatus
        : family.maritalStatus?.name || "",
    "Medical Conditions": Array.isArray(family.medicalConditions)
      ? family.medicalConditions.join(", ")
      : family.medicalCondition?.name || "Healthy",
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
        "Member Med. Condition": Array.isArray(member.medicalConditions)
          ? member.medicalConditions.join(", ")
          : member.medicalCondition || "Healthy",
      });
    });
  });

  return flattenedData;
}

/**
 * Format contributors data for Excel export
 */
export function formatContributorsForExport(contributors: any[]) {
  return contributors.map((contributor) => ({
    Name: contributor.name || "",
    Email: contributor.email || "",
    Phone: contributor.phone || "",
    Role: contributor.role || "",
    Status: contributor.status || "",
    Camp: contributor.camp?.name || contributor.camp || "",
    "Created At": contributor.createdAt
      ? new Date(contributor.createdAt).toLocaleDateString()
      : "",
  }));
}

/**
 * Format projects data for Excel export
 */
export function formatProjectsForExport(projects: any[]) {
  return projects.map((project) => ({
    Name: project.name || "",
    Type: project.type || "",
    Status: project.status || "",
    Camp: project.camp?.name || project.camp || "",
    "Beneficiary Count": project.beneficiaryCount || 0,
    "Total Received": project.totalReceived || 0,
    "Total Remaining": project.totalRemaining || 0,
    Budget: (project.totalReceived || 0) + (project.totalRemaining || 0),
    College: project.college || "",
    "Added By": project.addedBy || "",
    "Created At": project.createdAt
      ? new Date(project.createdAt).toLocaleDateString()
      : "",
  }));
}

/**
 * Format camps data for Excel export
 */
export function formatCampsForExport(camps: any[]) {
  return camps.map((camp) => ({
    Name:
      typeof camp.name === "string"
        ? camp.name
        : camp.name?.ar || camp.name?.en || "",
    Governorate: camp.governorate?.name || camp.governorate || "",
    "Family Count": camp.familyCount || 0,
    "Created At": camp.createdAt
      ? new Date(camp.createdAt).toLocaleDateString()
      : "",
  }));
}

/**
 * Format representatives data for Excel export
 */
export function formatRepresentativesForExport(representatives: any[]) {
  return representatives.map((rep) => ({
    Name: rep.name || "",
    Email: rep.email || "",
    Phone: rep.phone || "",
    Camp: rep.camp?.name || rep.camp || "",
    Status: rep.status || "",
    "Created At": rep.createdAt
      ? new Date(rep.createdAt).toLocaleDateString()
      : "",
  }));
}

/**
 * Format pending users data for Excel export
 */
export function formatPendingUsersForExport(users: any[]) {
  return users.map((user) => ({
    Name: user.name || "",
    Email: user.email || "",
    Phone: user.phone || "",
    Role: user.role || "",
    Camp: user.camp?.name || user.camp || "",
    Status: user.status || "",
    "Requested At": user.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "",
  }));
}

/**
 * Format governorates data for Excel export
 */
export function formatGovernoratesForExport(governorates: any[]) {
  return governorates.map((gov) => ({
    Name:
      typeof gov.name === "string"
        ? gov.name
        : gov.name?.ar || gov.name?.en || "",
    "Camp Count": gov.campCount || 0,
    "Created At": gov.createdAt
      ? new Date(gov.createdAt).toLocaleDateString()
      : "",
  }));
}

/**
 * Format contact messages data for Excel export
 */
export function formatMessagesForExport(messages: any[]) {
  return messages.map((msg) => ({
    Name: msg.name || "",
    Email: msg.email || "",
    Phone: msg.phone || "",
    Subject: msg.subject || "",
    Message: msg.message || "",
    Status: msg.status || "",
    "Received At": msg.createdAt
      ? new Date(msg.createdAt).toLocaleDateString()
      : "",
  }));
}

/**
 * Format contributions data for Excel export
 */
export function formatContributionsForExport(contributions: any[]) {
  return contributions.map((contribution) => ({
    "Contributor Name": contribution.contributorName || "",
    "Project Name":
      contribution.projectName || contribution.project?.name || "",
    Amount: contribution.amount || 0,
    Type: contribution.type || "",
    Status: contribution.status || "",
    "Contribution Date": contribution.contributionDate
      ? new Date(contribution.contributionDate).toLocaleDateString()
      : "",
    Notes: contribution.notes || "",
  }));
}
