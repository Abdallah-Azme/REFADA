/**
 * Query parameters for fetching families with server-side filtering and pagination
 */
export interface FamiliesQueryParams {
  /** Search term for family name */
  search?: string;
  /** Filter by national ID */
  national_id?: string;
  /** Filter by marital status name (e.g., "متزوج") */
  marital_status?: string;
  /** Filter by medical condition name (e.g., "حساسية") */
  medical_condition?: string;
  /** Filter by age group key (e.g., "lateMiddleAge", "youth") */
  age_group?: string;
  /** Filter by camp ID */
  camp_id?: string | number;
  /** Number of items per page (default: 10) */
  per_page?: number;
  /** Current page number (default: 1) */
  page?: number;
}

/**
 * Convert FamiliesQueryParams object to URL query string
 */
export function buildFamiliesQueryString(params: FamiliesQueryParams): string {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }
  if (params.national_id) {
    searchParams.set("national_id", params.national_id);
  }
  if (params.marital_status) {
    searchParams.set("marital_status", params.marital_status);
  }
  if (params.medical_condition) {
    searchParams.set("medical_condition", params.medical_condition);
  }
  if (params.age_group) {
    searchParams.set("age_group", params.age_group);
  }
  if (params.camp_id !== undefined && params.camp_id !== "") {
    searchParams.set("camp_id", String(params.camp_id));
  }
  if (params.per_page !== undefined) {
    searchParams.set("per_page", String(params.per_page));
  }
  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  return searchParams.toString();
}

/**
 * Default query parameters
 */
export const DEFAULT_FAMILIES_QUERY: FamiliesQueryParams = {
  per_page: 10,
  page: 1,
};
