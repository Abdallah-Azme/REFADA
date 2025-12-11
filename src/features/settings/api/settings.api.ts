import { Settings } from "../types/settings.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type SettingsResponse = {
  success: boolean;
  message: string;
  data: Settings;
};

export const settingsApi = {
  get: async (): Promise<SettingsResponse> => {
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

    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw { ...data, status: response.status };
    }

    return data as SettingsResponse;
  },
};
