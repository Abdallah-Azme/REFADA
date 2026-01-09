import {
  AdminCounts,
  ContributorCounts,
  CountsResponse,
  DelegateCounts,
} from "../types/counts.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function getAuthToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

async function fetchCounts<T>(endpoint: string): Promise<T> {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Accept-Language": "ar",
    },
  });

  const data: CountsResponse<T> = await response.json();

  if (!response.ok) {
    throw { ...data, status: response.status };
  }

  return data.data;
}

export const countsApi = {
  getAdminCounts: (): Promise<AdminCounts> => fetchCounts("/admin/counts"),
  getDelegateCounts: (): Promise<DelegateCounts> =>
    fetchCounts("/delegate/counts"),
  getContributorCounts: (): Promise<ContributorCounts> =>
    fetchCounts("/contributor/counts"),
};
