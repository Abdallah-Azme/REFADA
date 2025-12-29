import {
  AdminPosition,
  AdminPositionFormValues,
} from "../types/admin-position.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type AdminPositionsResponse = {
  success: boolean;
  message: string;
  data: AdminPosition[];
};

type AdminPositionResponse = {
  success: boolean;
  message: string;
  data: AdminPosition;
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

export const adminPositionApi = {
  getAll: async (): Promise<AdminPositionsResponse> => {
    return apiRequest<AdminPositionsResponse>("/admin-positions");
  },

  getById: async (id: number): Promise<AdminPositionResponse> => {
    return apiRequest<AdminPositionResponse>(`/admin-positions/${id}`);
  },

  create: async (
    data: AdminPositionFormValues
  ): Promise<AdminPositionResponse> => {
    const formData = new FormData();
    formData.append("name", data.name);

    const response = await fetch(`${API_BASE_URL}/admin-positions`, {
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

  update: async (
    id: number,
    data: AdminPositionFormValues
  ): Promise<AdminPositionResponse> => {
    const formData = new FormData();
    formData.append("name", data.name);

    const response = await fetch(`${API_BASE_URL}/admin-positions/${id}`, {
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

  delete: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    return apiRequest(`/admin-positions/${id}`, {
      method: "DELETE",
    });
  },
};
