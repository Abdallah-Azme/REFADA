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

export interface ContributorsResponse {
  success: boolean;
  message: string;
  data: PendingUser[];
}

export async function getContributorsApi(): Promise<ContributorsResponse> {
  return apiRequest<ContributorsResponse>(
    `/admin/users?role=contributor&status=approved`,
    {
      method: "GET",
    }
  );
}

export async function createContributorApi(
  data: CreateContributorFormValues
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
  if (data.license_number)
    formData.append("license_number", data.license_number);

  return apiRequest<CreateContributorResponse>("/admin/users", {
    method: "POST",
    body: formData,
  });
}

export async function deleteContributorApi(
  id: number
): Promise<DeleteContributorResponse> {
  return apiRequest<DeleteContributorResponse>(`/admin/users/${id}`, {
    method: "DELETE",
  });
}
