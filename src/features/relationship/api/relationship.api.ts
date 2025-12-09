import {
  Relationship,
  RelationshipFormValues,
} from "../types/relationship.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type RelationshipsResponse = {
  success: boolean;
  message: string;
  data: Relationship[];
};

type RelationshipResponse = {
  success: boolean;
  message: string;
  data: Relationship;
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

export const relationshipApi = {
  getAll: async (): Promise<RelationshipsResponse> => {
    return apiRequest<RelationshipsResponse>("/relationships");
  },

  getById: async (id: number): Promise<RelationshipResponse> => {
    return apiRequest<RelationshipResponse>(`/relationships/${id}`);
  },

  create: async (
    data: RelationshipFormValues
  ): Promise<RelationshipResponse> => {
    const formData = new FormData();
    formData.append("name", data.name);

    const response = await fetch(`${API_BASE_URL}/relationships`, {
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
    data: RelationshipFormValues
  ): Promise<RelationshipResponse> => {
    const formData = new FormData();
    formData.append("name", data.name);

    const response = await fetch(`${API_BASE_URL}/relationships/${id}`, {
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
    return apiRequest(`/relationships/${id}`, {
      method: "DELETE",
    });
  },
};
