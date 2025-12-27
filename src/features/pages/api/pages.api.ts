import { PageData, PageUpdateFormValues } from "../types/page.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type PagesResponse = {
  success: boolean;
  message: string;
  data: PageData[];
};

type PageResponse = {
  success: boolean;
  message: string;
  data: PageData;
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

export const pagesApi = {
  getAll: async (): Promise<PagesResponse> => {
    return apiRequest<PagesResponse>("/pages");
  },

  getByType: async (pageType: string): Promise<PageResponse> => {
    return apiRequest<PageResponse>(`/pages/${pageType}`);
  },

  update: async (
    pageType: string,
    data: PageUpdateFormValues
  ): Promise<PageResponse> => {
    const formData = new FormData();
    formData.append("title[ar]", data.title_ar);
    formData.append("title[en]", data.title_en);
    formData.append("description[ar]", data.description_ar);
    formData.append("description[en]", data.description_en);

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    if (data.file instanceof File) {
      formData.append("file", data.file);
    }

    return apiRequest<PageResponse>(`/about-us/${pageType}`, {
      method: "POST",
      body: formData,
    });
  },
};
