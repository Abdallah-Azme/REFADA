import {
  PendingUsersResponse,
  ApproveUserRequest,
  ApproveUserResponse,
} from "../types/pending-users.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Helper function to make API requests
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": "ar",
  };

  // Merge existing headers
  if (options.headers) {
    const existingHeaders = new Headers(options.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  // Add auth token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as T;
}

/**
 * Get pending users (filtered by role if provided)
 */
export async function getPendingUsersApi(
  role?: "delegate" | "contributor"
): Promise<PendingUsersResponse> {
  const queryParams = role ? `?role=${role}` : "";
  return apiRequest<PendingUsersResponse>(`/users/pending${queryParams}`, {
    method: "GET",
  });
}

/**
 * Approve a user
 */
export async function approveUserApi(
  userId: number,
  data?: ApproveUserRequest
): Promise<ApproveUserResponse> {
  const formData = new FormData();

  if (data?.camp_id) {
    formData.append("camp_id", data.camp_id.toString());
  }

  return apiRequest<ApproveUserResponse>(`/users/${userId}/approve`, {
    method: "POST",
    body: formData,
  });
}

/**
 * Reject a user
 */
export async function rejectUserApi(
  userId: number
): Promise<ApproveUserResponse> {
  return apiRequest<ApproveUserResponse>(`/users/${userId}/reject`, {
    method: "POST",
    body: new FormData(),
  });
}
