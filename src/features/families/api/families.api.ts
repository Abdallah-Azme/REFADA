import {
  FamiliesResponse,
  Family,
  FamilyFormValues,
  FamilyResponse,
  DeletedFamiliesResponse,
} from "../types/family.schema";

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

  // Check if the response has a success field and it's false
  if ("success" in data && data.success === false) {
    throw { ...data, status: response.status };
  }

  return data as T;
}

export async function getFamiliesApi(
  params?: string,
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
  data: FamilyFormValues,
): Promise<{ success: boolean; message: string }> {
  const formData = new FormData();
  formData.append("family_name", data.familyName);
  formData.append("national_id", data.nationalId);
  formData.append("dob", data.dob);
  formData.append("phone", data.phone);
  if (data.backupPhone) formData.append("backup_phone", data.backupPhone);
  formData.append("total_members", data.totalMembers.toString());
  if (data.tentNumber) formData.append("tent_number", data.tentNumber);
  if (data.location) formData.append("location", data.location);
  if (data.notes) formData.append("notes", data.notes);
  formData.append("camp_id", data.campId);
  formData.append("marital_status_id", data.maritalStatusId);

  // Medical conditions for head of family - send as array
  if (data.medicalConditionIds && data.medicalConditionIds.length > 0) {
    // If "other" is in the array and we have custom text, send it
    if (
      data.medicalConditionIds.includes("other") &&
      data.medicalConditionText
    ) {
      formData.append("medical_condition", data.medicalConditionText);
    }
    // Send each non-"other" ID as medical_condition_id[]
    data.medicalConditionIds.forEach((id) => {
      if (id !== "other") {
        formData.append("medical_condition_id[]", id);
      }
    });
  }

  // Add head of family as members[0]
  formData.append("members[0][name]", data.familyName);
  formData.append("members[0][gender]", data.gender);
  formData.append("members[0][dob]", data.dob);
  formData.append("members[0][national_id]", data.nationalId);
  formData.append("members[0][relationship_id]", "1"); // Head of family relationship

  // Medical conditions for head of family in members[0]
  if (data.medicalConditionIds && data.medicalConditionIds.length > 0) {
    if (
      data.medicalConditionIds.includes("other") &&
      data.medicalConditionText
    ) {
      formData.append(
        "members[0][medical_condition]",
        data.medicalConditionText,
      );
    }
    data.medicalConditionIds.forEach((id) => {
      if (id !== "other") {
        formData.append("members[0][medical_condition_id][]", id);
      }
    });
  }

  // Append other members starting at index 1
  if (data.members && data.members.length > 0) {
    data.members.forEach((member, index) => {
      const memberIndex = index + 1; // Offset by 1 since head is at 0
      formData.append(`members[${memberIndex}][name]`, member.name);
      formData.append(`members[${memberIndex}][gender]`, member.gender);
      formData.append(`members[${memberIndex}][dob]`, member.dob);
      formData.append(
        `members[${memberIndex}][national_id]`,
        member.nationalId,
      );
      formData.append(
        `members[${memberIndex}][relationship_id]`,
        member.relationshipId,
      );

      // Medical conditions as array
      if (member.medicalConditionIds && member.medicalConditionIds.length > 0) {
        if (
          member.medicalConditionIds.includes("other") &&
          member.medicalConditionText
        ) {
          formData.append(
            `members[${memberIndex}][medical_condition]`,
            member.medicalConditionText,
          );
        }
        member.medicalConditionIds.forEach((id) => {
          if (id !== "other") {
            formData.append(
              `members[${memberIndex}][medical_condition_id][]`,
              id,
            );
          }
        });
      }
    });
  }

  return apiRequest("/families", {
    method: "POST",
    body: formData,
  });
}

export async function updateFamilyApi(
  id: number,
  data: FamilyFormValues,
  originalNationalId?: string,
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
  if (data.tentNumber) formData.append("tent_number", data.tentNumber);
  if (data.location) formData.append("location", data.location);
  if (data.notes) formData.append("notes", data.notes);
  formData.append("camp_id", data.campId);
  formData.append("marital_status_id", data.maritalStatusId);

  // Uses POST for update per Postman collection ("edit" request)
  // Note: Members are handled separately via the edit-family-dialog's member update logic
  return apiRequest(`/families/${id}/update`, {
    method: "POST",
    body: formData,
  });
}

export async function deleteFamilyApi(
  id: number,
): Promise<{ success: boolean; message: string }> {
  const formData = new FormData();
  formData.append("delete_reason", "Deleted from dashboard");

  return apiRequest(`/families/${id}/delete`, {
    method: "POST",
    body: formData,
  });
}

export interface CreateFamilyMemberPayload {
  name: string;
  nationalId: string;
  gender: "male" | "female";
  dob: string;
  relationshipId: string;
  medicalConditionIds?: string[]; // Array of medical condition IDs
  medicalConditionText?: string; // Custom text when 'other' is selected
}

export async function createFamilyMemberApi(
  familyId: number,
  data: CreateFamilyMemberPayload,
): Promise<{ success: boolean; message: string; data?: any }> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("national_id", data.nationalId);
  formData.append("gender", data.gender);
  formData.append("dob", data.dob);
  formData.append("relationship_id", data.relationshipId);
  // Medical conditions as array
  if (data.medicalConditionIds && data.medicalConditionIds.length > 0) {
    if (
      data.medicalConditionIds.includes("other") &&
      data.medicalConditionText
    ) {
      formData.append("medical_condition", data.medicalConditionText);
    }
    data.medicalConditionIds.forEach((id) => {
      if (id !== "other") {
        formData.append("medical_condition_id[]", id);
      }
    });
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
  familyId: number,
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
  originalNationalId?: string,
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
  // Medical conditions as array
  if (data.medicalConditionIds && data.medicalConditionIds.length > 0) {
    if (
      data.medicalConditionIds.includes("other") &&
      data.medicalConditionText
    ) {
      formData.append("medical_condition", data.medicalConditionText);
    }
    data.medicalConditionIds.forEach((id) => {
      if (id !== "other") {
        formData.append("medical_condition_id[]", id);
      }
    });
  }

  return apiRequest(`/families/${familyId}/members/${memberId}`, {
    method: "POST",
    body: formData,
  });
}

// Delete Family Member API
export async function deleteFamilyMemberApi(
  familyId: number,
  memberId: number,
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/families/${familyId}/members/${memberId}`, {
    method: "DELETE",
  });
}

// Family Statistics API
export interface FamilyStatistics {
  familyId: number;
  familyName: string;
  totalMembers: number;
  malesCount: number;
  femalesCount: number;
}

export interface FamilyStatisticsResponse {
  success: boolean;
  message: string;
  data: FamilyStatistics;
}

export async function getFamilyStatisticsApi(
  familyId: number,
): Promise<FamilyStatisticsResponse> {
  return apiRequest<FamilyStatisticsResponse>(
    `/families/${familyId}/statistics`,
    {
      method: "GET",
    },
  );
}

// Bulk Delete Families API
export interface BulkDeleteFamiliesPayload {
  familyIds: number[];
  deleteReason: string;
}

export async function bulkDeleteFamiliesApi(
  payload: BulkDeleteFamiliesPayload,
): Promise<{ success: boolean; message: string }> {
  const formData = new FormData();

  // Append each family ID as family_ids[]
  payload.familyIds.forEach((id) => {
    formData.append("family_ids[]", id.toString());
  });

  formData.append("delete_reason", payload.deleteReason);

  return apiRequest("/family/bulk-delete", {
    method: "POST",
    body: formData,
  });
}

export async function getDeletedFamiliesApi(): Promise<DeletedFamiliesResponse> {
  // Need to import DeletedFamiliesResponse type if it wasn't automatically imported
  // But wait, it's in the same file as FamiliesResponse usually?
  // Ah, families.api.ts imports from family.schema.ts
  return apiRequest<DeletedFamiliesResponse>("/families/deleted", {
    method: "GET",
  });
}

// Restore family (from deleted/archive)
export async function restoreFamilyApi(
  id: number,
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/families/${id}/restore`, {
    method: "POST",
  });
}

export async function forceDeleteFamilyApi(familyId: number): Promise<void> {
  return apiRequest<void>(`/families/${familyId}/force-delete`, {
    method: "DELETE",
  });
}
