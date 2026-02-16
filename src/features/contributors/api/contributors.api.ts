import { PendingUser } from "@/features/representatives/types/pending-users.schema";
import {
  CreateContributorFormValues,
  CreateContributorResponse,
  DeleteContributorResponse,
} from "../types/create-contributor.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": "ar",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw { ...data, status: response.status };
  }

  return data as T;
}

export interface ContributorsResponse {
  success: boolean;
  message: string;
  data: PendingUser[];
}

export async function getContributorsApi(): Promise<ContributorsResponse> {
  return apiRequest<ContributorsResponse>(`/admin/users?role=contributor`, {
    method: "GET",
  });
}

export async function createContributorApi(
  data: CreateContributorFormValues,
): Promise<CreateContributorResponse> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("id_number", data.id_number);
  formData.append("role", "contributor");
  formData.append("password", data.password);
  formData.append("password_confirmation", data.password_confirmation);
  if (data.backup_phone) formData.append("backup_phone", data.backup_phone);
  formData.append("admin_position", data.admin_position);
  if (data.license_number)
    formData.append("license_number", data.license_number);

  return apiRequest<CreateContributorResponse>("/admin/users", {
    method: "POST",
    body: formData,
  });
}

export async function deleteContributorApi(
  id: number,
): Promise<DeleteContributorResponse> {
  return apiRequest<DeleteContributorResponse>(`/admin/users/${id}`, {
    method: "DELETE",
  });
}

// ============================================================================
// Camp Families API
// ============================================================================

export interface CampFamily {
  id: number;
  familyName: string;
  nationalId: string;
  dob: string;
  phone: string;
  backupPhone: string;
  totalMembers: number;
  fileUrl: string | null;
  maritalStatus: string;
  tentNumber: string;
  location: string;
  notes: string;
  camp: string;
  quantity: number | null;
  malesCount: number;
  femalesCount: number;
  membersCount: number;
  ageGroups: string[];
  medicalConditions: string[];
  hasBenefit?: boolean;
  members?: any[];
  addedByContributor?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CampFamiliesResponse {
  success: boolean;
  message: string;
  data: {
    families: CampFamily[];
    ageGroups: string[];
    medicalConditions: string[];
  };
}

export async function getCampFamiliesApi(
  campId: number,
  projectId?: number,
): Promise<CampFamiliesResponse> {
  const queryParams = projectId ? `?project_id=${projectId}` : "";
  return apiRequest<CampFamiliesResponse>(
    `/contributor/camps/families/${campId}${queryParams}`,
    {
      method: "GET",
    },
  );
}

// Get families for the authenticated representative's camp (no campId required)
export async function getRepresentativeCampFamiliesApi(): Promise<CampFamiliesResponse> {
  return apiRequest<CampFamiliesResponse>(`/contributor/camps/families`, {
    method: "GET",
  });
}

// Get families for a specific contribution (includes addedByContributor flag)
export interface DelegateFamiliesResponse {
  success: boolean;
  message: string;
  data: {
    families: CampFamily[];
  };
}

export async function getDelegateFamiliesForContributionApi(
  contributionId: number,
): Promise<DelegateFamiliesResponse> {
  return apiRequest<DelegateFamiliesResponse>(
    `/delegate/families/contribution/${contributionId}`,
    {
      method: "GET",
    },
  );
}

// ============================================================================
// Contribution API
// ============================================================================

export interface ContributeFormData {
  projectId: number;
  contributedQuantity: number;
  notes?: string;
  families?: number[];
}

export interface ContributeResponse {
  success: boolean;
  message: string;
  data?: any;
}

export async function submitContributionApi(
  data: ContributeFormData,
): Promise<ContributeResponse> {
  const formData = new FormData();
  formData.append("contributedQuantity", data.contributedQuantity.toString());

  if (data.notes) {
    formData.append("notes", data.notes);
  }

  if (data.families && data.families.length > 0) {
    data.families.forEach((familyId) => {
      formData.append("families[]", familyId.toString());
    });
  }

  return apiRequest<ContributeResponse>(
    `/contributor/projects/${data.projectId}/contribute`,
    {
      method: "POST",
      body: formData,
    },
  );
}

// ============================================================================
// Medical Conditions API
// ============================================================================

export interface MedicalCondition {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalConditionsResponse {
  success: boolean;
  message: string;
  data: MedicalCondition[];
}

export async function getMedicalConditionsApi(): Promise<MedicalConditionsResponse> {
  return apiRequest<MedicalConditionsResponse>("/medical-conditions", {
    method: "GET",
  });
}

// ============================================================================
// Contributor History API
// ============================================================================

export interface ContributorFamily {
  id: number;
  familyName: string;
  nationalId: string;
  dob: string;
  phone: string;
  backupPhone: string;
  totalMembers: number;
  fileUrl: string | null;
  maritalStatus: string;
  tentNumber: string;
  location: string;
  notes: string;
  camp: string;
  quantity: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContributionHistoryProject {
  id: number;
  name: string;
  type: string;
  addedBy: string;
  beneficiaryCount: number;
  college: string;
  status: string;
  isApproved: boolean;
  notes: string | null;
  projectImage: string;
  totalReceived: number;
  totalRemaining: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContributionHistoryItem {
  id: number;
  totalQuantity: number;
  notes: string | null;
  status: string;
  project: ContributionHistoryProject;
  contributorFamilies: ContributorFamily[];
  createdAt: string;
  updatedAt: string;
}

export interface ContributorHistoryResponse {
  success: boolean;
  message: string;
  data: ContributionHistoryItem[];
}

export async function getContributorHistoryApi(): Promise<ContributorHistoryResponse> {
  return apiRequest<ContributorHistoryResponse>("/contributor/history", {
    method: "GET",
  });
}

// ============================================================================
// Admin Contributions API
// ============================================================================

export interface AdminContribution {
  id: number;
  totalQuantity: number;
  notes: string | null;
  status: string;
  project: ContributionHistoryProject | null;
  contributorFamilies: ContributorFamily[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface AdminContributionsResponse {
  success: boolean;
  message: string;
  data: AdminContribution[];
  meta: PaginationMeta;
}

export interface AdminContributionsParams {
  page?: number;
  camp_id?: number;
  project_id?: string;
  status?: string;
}

export async function getAdminContributionsApi(
  params: AdminContributionsParams = {},
): Promise<AdminContributionsResponse> {
  const queryParts: string[] = [];

  if (params.page) queryParts.push(`page=${params.page}`);
  if (params.camp_id) queryParts.push(`camp_id=${params.camp_id}`);
  if (params.project_id && params.project_id !== "all")
    queryParts.push(`project_id=${params.project_id}`);
  if (params.status && params.status !== "all")
    queryParts.push(`status=${params.status}`);

  const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";

  return apiRequest<AdminContributionsResponse>(
    `/admin/contributions${queryString}`,
    {
      method: "GET",
    },
  );
}

// ============================================================================
// Delete Family from Contribution API
// ============================================================================

export interface DeleteFamilyFromContributionResponse {
  success: boolean;
  message: string;
}

export async function deleteFamilyFromContributionApi(
  contributionId: number,
  familyId: number,
): Promise<DeleteFamilyFromContributionResponse> {
  return apiRequest<DeleteFamilyFromContributionResponse>(
    `/contributions/${contributionId}/families/${familyId}`,
    {
      method: "DELETE",
    },
  );
}

// ============================================================================
// Delete Contribution API
// ============================================================================

export interface DeleteContributionResponse {
  success: boolean;
  message: string;
}

export async function deleteContributionApi(
  contributionId: number,
): Promise<DeleteContributionResponse> {
  return apiRequest<DeleteContributionResponse>(
    `/contributions/${contributionId}`,
    {
      method: "DELETE",
    },
  );
}

// ============================================================================
// Delegate (Representative) Contributions API
// ============================================================================

export interface DelegateContribution {
  id: number;
  notes: string | null;
  status: string;
  alreadyConfirmed?: boolean;
  delegate?: string;
  project?: ContributionHistoryProject | null;
  contributorFamilies: ContributorFamily[];
  createdAt: string;
  updatedAt: string;
}

export interface DelegateContributionsResponse {
  success: boolean;
  message: string;
  data: DelegateContribution[];
}

export async function getDelegateContributionsApi(): Promise<DelegateContributionsResponse> {
  return apiRequest<DelegateContributionsResponse>("/delegate/contributions", {
    method: "GET",
  });
}

// ============================================================================
// Confirm Delegate Contribution API
// ============================================================================

export interface ConfirmDelegateContributionResponse {
  success: boolean;
  message: string;
}

export async function confirmDelegateContributionApi(
  contributionId: number,
  confirmedQuantity: number,
): Promise<ConfirmDelegateContributionResponse> {
  const formData = new FormData();
  formData.append("confirmed_quantity", confirmedQuantity.toString());

  return apiRequest<ConfirmDelegateContributionResponse>(
    `/delegate/contributions/${contributionId}/confirm`,
    {
      method: "POST",
      body: formData,
    },
  );
}

// ============================================================================
// Add Families to Contribution API
// ============================================================================

export interface FamilyQuantity {
  id: number;
  quantity: number;
}

export interface AddFamiliesToContributionResponse {
  success: boolean;
  message: string;
}

export async function addFamiliesToContributionApi(
  contributionId: number,
  families: FamilyQuantity[],
): Promise<AddFamiliesToContributionResponse> {
  const formData = new FormData();

  families.forEach((family, index) => {
    formData.append(`families[${index}][id]`, family.id.toString());
    formData.append(`families[${index}][quantity]`, family.quantity.toString());
  });

  return apiRequest<AddFamiliesToContributionResponse>(
    `/delegate/contributions/${contributionId}/add-families`,
    {
      method: "POST",
      body: formData,
    },
  );
}

// ============================================================================
// Complete Delegate Contribution API
// ============================================================================

export interface CompleteDelegateContributionResponse {
  success: boolean;
  message: string;
}

export async function completeDelegateContributionApi(
  contributionId: number,
): Promise<CompleteDelegateContributionResponse> {
  const formData = new FormData();

  return apiRequest<CompleteDelegateContributionResponse>(
    `/delegate/contributions/${contributionId}/complete`,
    {
      method: "POST",
      body: formData,
    },
  );
}
