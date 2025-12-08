import {
  GovernorateFormValues,
  GovernoratesResponse,
  GovernorateResponse,
} from "../types/governorates.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function toFormData(data: Record<string, any>): FormData {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "name_ar") {
      formData.append("name[ar]", data[key]);
    } else if (key === "name_en") {
      formData.append("name[en]", data[key] || "");
    } else {
      formData.append(key, data[key]);
    }
  });
  return formData;
}

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
      headers.Authorization = `Bearer ${token}`; // Remove Bearer if needed depending on backend
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

export const governoratesApi = {
  getAll: async (): Promise<GovernoratesResponse> => {
    return apiRequest<GovernoratesResponse>("/governorates");
  },

  create: async (data: GovernorateFormValues): Promise<GovernorateResponse> => {
    return apiRequest<GovernorateResponse>("/governorates", {
      method: "POST",
      body: toFormData(data),
    });
  },

  update: async (
    id: number,
    data: GovernorateFormValues
  ): Promise<GovernorateResponse> => {
    // User confirmed it's a POST request
    return apiRequest<GovernorateResponse>(`/governorates/${id}`, {
      method: "POST",
      body: toFormData(data),
    });
  },

  delete: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    return apiRequest(`/governorates/${id}`, {
      method: "DELETE",
    });
  },
};
