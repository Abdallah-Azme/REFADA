import { PendingUser } from "../types/pending-users.schema";
import {
  CreateRepresentativeFormValues,
  CreateRepresentativeResponse,
} from "../types/create-representative.schema";

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

  return data as T;
}

export interface RepresentativesResponse {
  success: boolean;
  message: string;
  data: PendingUser[]; // Reusing PendingUser as it likely has the same shape + status
}

export async function getRepresentativesApi(): Promise<RepresentativesResponse> {
  return apiRequest<RepresentativesResponse>(`/admin/users?role=delegate`, {
    method: "GET",
  });
}

export async function createRepresentativeApi(
  data: CreateRepresentativeFormValues
): Promise<CreateRepresentativeResponse> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("id_number", data.id_number);
  formData.append("role", "delegate");
  formData.append("password", data.password);
  formData.append("password_confirmation", data.password_confirmation);
  if (data.backup_phone) formData.append("backup_phone", data.backup_phone);
  if (data.admin_position)
    formData.append("admin_position", data.admin_position);
  if (data.license_number)
    formData.append("license_number", data.license_number);
  formData.append("camp_id", data.camp_id);

  return apiRequest<CreateRepresentativeResponse>("/admin/users", {
    method: "POST",
    body: formData,
  });
}

export interface DeleteRepresentativeResponse {
  success: boolean;
  message: string;
}

export async function deleteRepresentativeApi(
  id: number
): Promise<DeleteRepresentativeResponse> {
  return apiRequest<DeleteRepresentativeResponse>(`/admin/users/${id}`, {
    method: "DELETE",
  });
}

export interface ApproveRejectResponse {
  success: boolean;
  message: string;
}

export async function approveRepresentativeApi(
  userId: number,
  campId: number
): Promise<ApproveRejectResponse> {
  const formData = new FormData();
  formData.append("camp_id", campId.toString());

  return apiRequest<ApproveRejectResponse>(`/users/${userId}/approve`, {
    method: "POST",
    body: formData,
  });
}

export async function rejectRepresentativeApi(
  userId: number
): Promise<ApproveRejectResponse> {
  return apiRequest<ApproveRejectResponse>(`/users/${userId}/reject`, {
    method: "POST",
  });
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export async function changeRepresentativePasswordApi(
  userId: number,
  password: string,
  passwordConfirmation: string
): Promise<ChangePasswordResponse> {
  const formData = new FormData();
  formData.append("password", password);
  formData.append("password_confirmation", passwordConfirmation);

  return apiRequest<ChangePasswordResponse>(`/admin/users/${userId}/password`, {
    method: "POST",
    body: formData,
  });
}
