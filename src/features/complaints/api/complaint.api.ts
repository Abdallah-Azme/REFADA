import { Complaint, ComplaintFormValues } from "../types/complaint.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type ComplaintsResponse = {
  success: boolean;
  message: string;
  data: Complaint[];
};

type ComplaintResponse = {
  success: boolean;
  message: string;
  data: Complaint;
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

export const complaintApi = {
  getAll: async (): Promise<ComplaintsResponse> => {
    return apiRequest<ComplaintsResponse>("/complaints");
  },

  getById: async (id: number): Promise<ComplaintResponse> => {
    return apiRequest<ComplaintResponse>(`/complaints/${id}`);
  },

  create: async (data: ComplaintFormValues): Promise<ComplaintResponse> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("topic", data.topic);
    formData.append("message", data.message);
    formData.append("camp_id", data.camp_id.toString());

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

    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: "POST",
      headers,
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
    return apiRequest(`/complaints/${id}`, {
      method: "DELETE",
    });
  },
};
