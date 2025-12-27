import { AboutUsPageItem } from "../types/about-us.schema";
import { PageUpdateFormValues } from "../types/page.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type AboutUsResponse = {
  success: boolean;
  message: string;
  data: AboutUsPageItem[];
};

type AboutUsSectionResponse = {
  success: boolean;
  message: string;
  data: AboutUsPageItem;
};

export const aboutUsApi = {
  getImageUrl: (path: string | null) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://reffad.cloud/storage/${path}`;
  },

  get: async (): Promise<AboutUsResponse> => {
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

    const response = await fetch(`${API_BASE_URL}/about-us/`, {
      method: "GET",
      headers,
      next: { revalidate: 0 },
    });

    const data = await response.json();

    if (!response.ok) {
      throw { ...data, status: response.status };
    }

    return data as AboutUsResponse;
  },

  update: async (data: FormData): Promise<AboutUsResponse> => {
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

    const response = await fetch(`${API_BASE_URL}/about-us/`, {
      method: "POST",
      headers,
      body: data,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw { ...responseData, status: response.status };
    }

    return responseData as AboutUsResponse;
  },

  // Update a specific section (mission, vision, goals) via /about-us/{pageType}
  updateSection: async (
    pageType: string,
    data: PageUpdateFormValues
  ): Promise<AboutUsSectionResponse> => {
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

    const response = await fetch(`${API_BASE_URL}/about-us/${pageType}`, {
      method: "POST",
      headers,
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw { ...responseData, status: response.status };
    }

    return responseData as AboutUsSectionResponse;
  },
};
