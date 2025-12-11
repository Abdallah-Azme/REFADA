import { AboutUsData } from "../types/about-us.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type AboutUsResponse = {
  success: boolean;
  message: string;
  data: AboutUsData;
};

export const aboutUsApi = {
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

    const response = await fetch(`${API_BASE_URL}/about-us`, {
      method: "GET",
      headers,
      next: { revalidate: 0 }, // Ensure fresh data
    });

    const data = await response.json();

    if (!response.ok) {
      throw { ...data, status: response.status };
    }

    return data as AboutUsResponse;
  },
};
