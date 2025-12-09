import {
  WebsiteSettings,
  WebsiteSettingsFormValues,
} from "../types/settings.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type SettingsResponse = {
  success: boolean;
  message: string;
  data: WebsiteSettings;
};

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

export const settingsApi = {
  get: async (): Promise<SettingsResponse> => {
    return apiRequest<SettingsResponse>("/settings");
  },

  update: async (
    data: WebsiteSettingsFormValues
  ): Promise<SettingsResponse> => {
    const formData = new FormData();

    // Site names
    formData.append("site_name[en]", data.siteName.en);
    formData.append("site_name[ar]", data.siteName.ar);

    // Contact info
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("whatsapp", data.whatsapp);

    // Social media (optional)
    if (data.facebook) formData.append("facebook", data.facebook);
    if (data.twitter) formData.append("twitter", data.twitter);
    if (data.instagram) formData.append("instagram", data.instagram);
    if (data.linkedin) formData.append("linkedin", data.linkedin);
    if (data.youtube) formData.append("youtube", data.youtube);

    // Files
    if (data.siteLogo instanceof File) {
      formData.append("site_logo", data.siteLogo);
    }
    if (data.favicon instanceof File) {
      formData.append("favicon", data.favicon);
    }

    // Add _method for Laravel PUT/PATCH
    formData.append("_method", "POST");

    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${
          typeof window !== "undefined"
            ? localStorage.getItem("auth_token")
            : ""
        }`,
        Accept: "application/json",
        "Accept-Language": "ar",
      },
      body: formData,
    });

    const resData = await response.json();

    if (!response.ok) {
      throw { ...resData, status: response.status };
    }

    return resData;
  },
};
