import { Partner, PartnerFormValues } from "../types/partner.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type PartnersResponse = {
  success: boolean;
  message: string;
  data: Partner[];
};

type PartnerResponse = {
  success: boolean;
  message: string;
  data: Partner;
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

export const partnerApi = {
  getAll: async (): Promise<PartnersResponse> => {
    return apiRequest<PartnersResponse>("/partners");
  },

  getById: async (id: number): Promise<PartnerResponse> => {
    return apiRequest<PartnerResponse>(`/partners/${id}`);
  },

  create: async (data: PartnerFormValues): Promise<PartnerResponse> => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.logo instanceof File) {
      formData.append("logo", data.logo);
    }
    if (data.order) {
      formData.append("order", data.order.toString());
    }

    return apiRequest<PartnerResponse>("/partners", {
      method: "POST",
      body: formData,
    });
  },

  update: async (
    id: number,
    data: PartnerFormValues
  ): Promise<PartnerResponse> => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.logo instanceof File) {
      formData.append("logo", data.logo);
    }
    if (data.order) {
      formData.append("order", data.order.toString());
    }

    return apiRequest<PartnerResponse>(`/partners/${id}`, {
      method: "POST",
      body: formData,
    });
  },

  delete: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    return apiRequest(`/partners/${id}`, {
      method: "DELETE",
    });
  },
};
