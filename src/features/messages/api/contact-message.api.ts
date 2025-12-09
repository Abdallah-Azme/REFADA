import {
  ContactMessage,
  ContactMessageFormValues,
} from "../types/message.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type ContactMessagesResponse = {
  success: boolean;
  message: string;
  data: ContactMessage[];
};

type ContactMessageResponse = {
  success: boolean;
  message: string;
  data: ContactMessage;
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

  // Only add Content-Type if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
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

export const contactMessagesApi = {
  getAll: async (): Promise<ContactMessagesResponse> => {
    return apiRequest<ContactMessagesResponse>("/contact-us");
  },

  getById: async (id: number): Promise<ContactMessageResponse> => {
    return apiRequest<ContactMessageResponse>(`/contact-us/${id}`);
  },

  create: async (
    data: Omit<ContactMessageFormValues, "subject">
  ): Promise<ContactMessageResponse> => {
    return apiRequest<ContactMessageResponse>("/contact-us", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  delete: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    return apiRequest(`/contact-us/${id}`, {
      method: "DELETE",
    });
  },
};
