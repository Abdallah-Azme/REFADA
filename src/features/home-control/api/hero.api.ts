import { HeroFormValues, HeroData } from "../types/hero.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type HeroResponse = {
  success: boolean;
  message: string;
  data: HeroData;
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

export const heroApi = {
  get: async (): Promise<HeroResponse> => {
    return apiRequest<HeroResponse>("/homepage");
  },

  update: async (data: HeroFormValues): Promise<HeroResponse> => {
    const formData = new FormData();

    // Text fields
    formData.append("hero_title[ar]", data.hero_title_ar);
    formData.append("hero_title[en]", data.hero_title_en);
    formData.append("hero_description[ar]", data.hero_description_ar);
    formData.append("hero_description[en]", data.hero_description_en);

    if (data.hero_subtitle_ar) {
      formData.append("hero_subtitle[ar]", data.hero_subtitle_ar);
    }
    if (data.hero_subtitle_en) {
      formData.append("hero_subtitle[en]", data.hero_subtitle_en);
    }

    // Files
    if (data.hero_image instanceof File) {
      formData.append("hero_image", data.hero_image);
    }
    if (data.small_hero_image instanceof File) {
      formData.append("small_hero_image", data.small_hero_image);
    }

    // POST request to /homepage/1 as per requirement
    // Custom fetch because we need to handle FormData and headers carefully
    return apiRequest<HeroResponse>("/homepage/1", {
      method: "POST",
      body: formData,
    });
  },
};
