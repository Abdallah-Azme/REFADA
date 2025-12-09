import {
  MaritalStatus,
  MaritalStatusFormValues,
} from "../types/marital-status.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type MaritalStatusesResponse = {
  success: boolean;
  message: string;
  data: MaritalStatus[];
};

type MaritalStatusResponse = {
  success: boolean;
  message: string;
  data: MaritalStatus;
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

export const maritalStatusApi = {
  getAll: async (): Promise<MaritalStatusesResponse> => {
    return apiRequest<MaritalStatusesResponse>("/marital-statuses");
  },

  getById: async (id: number): Promise<MaritalStatusResponse> => {
    return apiRequest<MaritalStatusResponse>(`/marital-statuses/${id}`);
  },

  create: async (
    data: MaritalStatusFormValues
  ): Promise<MaritalStatusResponse> => {
    const formData = new FormData();
    formData.append("name", data.name);

    const response = await fetch(`${API_BASE_URL}/marital-statuses`, {
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
    data: MaritalStatusFormValues
  ): Promise<MaritalStatusResponse> => {
    const formData = new FormData();
    formData.append("name", data.name);

    const response = await fetch(`${API_BASE_URL}/marital-statuses/${id}`, {
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
    return apiRequest(`/marital-statuses/${id}`, {
      method: "DELETE",
    });
  },
};
