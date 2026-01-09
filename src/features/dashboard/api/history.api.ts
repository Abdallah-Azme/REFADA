import { ContributionHistoryResponse } from "../types/history.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function getAuthToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

export const historyApi = {
  getContributorHistory: async (): Promise<ContributionHistoryResponse> => {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/contributor/history`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Accept-Language": "ar",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw { ...data, status: response.status };
    }

    return data;
  },
};
