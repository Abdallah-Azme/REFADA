// Query params for server-side filtering and pagination
export interface ProjectsQueryParams {
  search?: string;
  status?: string;
  type?: string;
  beneficiary_count?: string;
  family_name?: string;
  page?: number;
  per_page?: number;
}

// Default query params
export const DEFAULT_PROJECTS_QUERY: ProjectsQueryParams = {
  page: 1,
  per_page: 15,
};

// Build query string from params
export function buildProjectsQueryString(params: ProjectsQueryParams): string {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.append("search", params.search);
  }
  if (params.status) {
    searchParams.append("status", params.status);
  }
  if (params.type) {
    searchParams.append("type", params.type);
  }
  if (params.beneficiary_count) {
    searchParams.append("beneficiary_count", params.beneficiary_count);
  }
  if (params.family_name) {
    searchParams.append("family_name", params.family_name);
  }
  if (params.page) {
    searchParams.append("page", params.page.toString());
  }
  if (params.per_page) {
    searchParams.append("per_page", params.per_page.toString());
  }

  return searchParams.toString();
}
