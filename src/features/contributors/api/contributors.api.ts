import { PendingUser } from "@/features/representatives/types/pending-users.schema";

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
