import { User } from "../types/auth.schema";

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

export interface ProfileUser extends User {
  backupPhone: string | null;
  campName: string | null;
  idNumber: string; // User has id_number, Profile has idNumber (camelCase from API?)
  // Note: API provided shows camelCase keys e.g. "idNumber", "adminPosition".
  // User schema has snake_case "id_number".
  // I will use camelCase to match the provided JSON example EXACTLY.
  adminPosition: string | null;
  licenseNumber: string | null;
  acceptTerms: boolean;
  status: string;
  profileImageUrl: string | null;
  createdAt: string; // JSON says "createdAt", User has "created_at"
  updatedAt: string; // JSON says "updatedAt"
  camp: any | null;
}

export interface ProfileResponse {
  status: boolean;
  message: string;
  data: ProfileUser;
}

export async function getProfileApi(): Promise<ProfileResponse> {
  return apiRequest<ProfileResponse>(`/profile`, {
    method: "GET",
  });
}
