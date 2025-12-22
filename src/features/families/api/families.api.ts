import {
  FamiliesResponse,
  Family,
  FamilyFormValues,
  FamilyResponse,
} from "../types/family.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
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

  // Check if the response has a success field and it's false
  if ("success" in data && data.success === false) {
    throw { ...data, status: response.status };
  }

  return data as T;
}

export async function getFamiliesApi(
  params?: string
): Promise<FamiliesResponse> {
  const queryString = params ? `?${params}` : "";
  return apiRequest<FamiliesResponse>(`/families${queryString}`, {
    method: "GET",
  });
}

export async function getFamilyApi(id: number): Promise<FamilyResponse> {
  return apiRequest<FamilyResponse>(`/families/${id}`, {
    method: "GET",
  });
}

export async function createFamilyApi(
  data: FamilyFormValues
): Promise<{ success: boolean; message: string }> {
  const formData = new FormData();
  formData.append("family_name", data.familyName);
  formData.append("national_id", data.nationalId);
  formData.append("dob", data.dob);
  formData.append("phone", data.phone);
  if (data.backupPhone) formData.append("backup_phone", data.backupPhone);
  formData.append("total_members", data.totalMembers.toString());
  formData.append("tent_number", data.tentNumber);
  formData.append("location", data.location);
  if (data.notes) formData.append("notes", data.notes);
  formData.append("camp_id", data.campId);
  formData.append("marital_status_id", data.maritalStatusId);
  // Medical condition for head of family
  if (data.medicalConditionId && data.medicalConditionId !== "none") {
    formData.append("medical_condition_id", data.medicalConditionId);
  }
  if (data.file) formData.append("file", data.file); // Handle file upload

  return apiRequest("/families", {
    method: "POST",
    body: formData,
  });
}

export async function updateFamilyApi(
  id: number,
  data: FamilyFormValues,
  originalNationalId?: string
): Promise<{ success: boolean; message: string }> {
  const formData = new FormData();
  formData.append("family_name", data.familyName);
  // Only send national_id if it has changed from the original
  // This avoids the backend unique validation issue when national_id hasn't changed
  if (!originalNationalId || data.nationalId !== originalNationalId) {
    formData.append("national_id", data.nationalId);
  }
  formData.append("dob", data.dob);
  formData.append("phone", data.phone);
  if (data.backupPhone) formData.append("backup_phone", data.backupPhone);
  formData.append("total_members", data.totalMembers.toString());
  formData.append("tent_number", data.tentNumber);
  formData.append("location", data.location);
  if (data.notes) formData.append("notes", data.notes);
  formData.append("camp_id", data.campId);
  formData.append("marital_status_id", data.maritalStatusId);

  if (data.file instanceof File) {
    formData.append("file", data.file);
  }

  // Uses POST for update per Postman collection ("edit" request)
  return apiRequest(`/families/${id}`, {
    method: "POST",
    body: formData,
  });
}

export async function deleteFamilyApi(
  id: number
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/families/${id}`, {
    method: "DELETE",
  });
}

export interface CreateFamilyMemberPayload {
  name: string;
  nationalId: string;
  gender: "male" | "female";
  dob: string;
  relationshipId: string;
  medicalConditionId?: string; // Optional - only sent if not 'none'
  medicalConditionFile?: File; // Optional file for medical condition
}

export async function createFamilyMemberApi(
  familyId: number,
  data: CreateFamilyMemberPayload
): Promise<{ success: boolean; message: string; data?: any }> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("national_id", data.nationalId);
  formData.append("gender", data.gender);
  formData.append("dob", data.dob);
  formData.append("relationship_id", data.relationshipId);
  // Only append medical_condition_id if it's not 'none' and has a value
  if (data.medicalConditionId && data.medicalConditionId !== "none") {
    formData.append("medical_condition_id", data.medicalConditionId);
    // Append file if provided
    if (data.medicalConditionFile) {
      formData.append("file", data.medicalConditionFile);
    }
  }

  return apiRequest(`/families/${familyId}/members`, {
    method: "POST",
    body: formData,
  });
}

// Relationships API
export interface Relationship {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface RelationshipsResponse {
  success: boolean;
  message: string;
  data: Relationship[];
}

export async function getRelationshipsApi(): Promise<RelationshipsResponse> {
  return apiRequest<RelationshipsResponse>("/relationships", {
    method: "GET",
  });
}

// Marital Statuses API
export interface MaritalStatus {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaritalStatusesResponse {
  success: boolean;
  message: string;
  data: MaritalStatus[];
}

export async function getMaritalStatusesApi(): Promise<MaritalStatusesResponse> {
  return apiRequest<MaritalStatusesResponse>("/marital-statuses", {
    method: "GET",
  });
}

// Medical Conditions API
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

// Family Members Response Types
export interface FamilyMemberResponse {
  id: number;
  name: string;
  gender: "male" | "female";
  dob: string;
  nationalId: string;
  relationship: string;
  medicalCondition: string | null;
  file: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMembersResponse {
  success: boolean;
  message: string;
  data: FamilyMemberResponse[];
}

// Get Family Members API
export async function getFamilyMembersApi(
  familyId: number
): Promise<FamilyMembersResponse> {
  return apiRequest<FamilyMembersResponse>(`/families/${familyId}/members`, {
    method: "GET",
  });
}

// Update Family Member API
export async function updateFamilyMemberApi(
  familyId: number,
  memberId: number,
  data: CreateFamilyMemberPayload,
  originalNationalId?: string
): Promise<{ success: boolean; message: string; data?: any }> {
  const formData = new FormData();
  formData.append("name", data.name);
  // Only send national_id if it has changed from the original
  // This avoids the backend unique validation issue when national_id hasn't changed
  if (!originalNationalId || data.nationalId !== originalNationalId) {
    formData.append("national_id", data.nationalId);
  }
  formData.append("gender", data.gender);
  formData.append("dob", data.dob);
  formData.append("relationship_id", data.relationshipId);
  // Only append medical_condition_id if it's not 'none' and has a value
  if (data.medicalConditionId && data.medicalConditionId !== "none") {
    formData.append("medical_condition_id", data.medicalConditionId);
    // Append file if provided
    if (data.medicalConditionFile) {
      formData.append("file", data.medicalConditionFile);
    }
  }

  return apiRequest(`/families/${familyId}/members/${memberId}`, {
    method: "POST",
    body: formData,
  });
}

// Delete Family Member API
export async function deleteFamilyMemberApi(
  familyId: number,
  memberId: number
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/families/${familyId}/members/${memberId}`, {
    method: "DELETE",
  });
}
