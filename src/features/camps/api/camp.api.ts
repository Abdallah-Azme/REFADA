import {
  Camp,
  CampFormValues,
  CampStatisticsResponse,
  CampFamilyStatisticsResponse,
} from "../types/camp.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type CampsResponse = {
  success: boolean;
  message: string;
  data: Camp[];
};

type PaginatedCampsResponse = {
  success: boolean;
  message: string;
  data: Camp[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

type CampResponse = {
  success: boolean;
  message: string;
  data: Camp;
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
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

export const campsApi = {
  getAll: async (): Promise<CampsResponse> => {
    return apiRequest<CampsResponse>("/camps?per_page=10");
  },

  // Separate endpoint for getting camp names (used in family filter)
  getCampNames: async (): Promise<CampsResponse> => {
    return apiRequest<CampsResponse>("/camps-list/names");
  },

  getPaginated: async (
    page: number = 1,
    perPage: number = 10,
    searchName?: string,
  ): Promise<PaginatedCampsResponse> => {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("per_page", String(perPage));
    if (searchName && searchName.trim()) {
      params.append("name", searchName.trim());
    }
    return apiRequest<PaginatedCampsResponse>(`/camps?${params.toString()}`);
  },

  create: async (data: CampFormValues): Promise<CampResponse> => {
    const formData = new FormData();

    formData.append("name[ar]", data.name_ar);
    formData.append("name[en]", data.name_en);
    formData.append("location", data.location);
    if (data.description_ar)
      formData.append("description[ar]", data.description_ar);
    if (data.description_en)
      formData.append("description[en]", data.description_en);
    formData.append("capacity", data.capacity.toString());
    formData.append("currentOccupancy", data.currentOccupancy.toString());
    formData.append("governorate_id", data.governorate_id.toString());

    // Coordinates
    if (data.coordinates) {
      formData.append("latitude", data.coordinates.lat.toString());
      formData.append("longitude", data.coordinates.lng.toString());
    }

    // Image
    if (data.camp_img instanceof File) {
      formData.append("camp_img", data.camp_img);
    }

    const response = await fetch(`${API_BASE_URL}/camps`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
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

  update: async (slug: string, data: CampFormValues): Promise<CampResponse> => {
    const formData = new FormData();

    formData.append("name[ar]", data.name_ar);
    formData.append("name[en]", data.name_en);
    formData.append("location", data.location);
    if (data.description_ar)
      formData.append("description[ar]", data.description_ar);
    if (data.description_en)
      formData.append("description[en]", data.description_en);
    formData.append("capacity", data.capacity.toString());
    formData.append("currentOccupancy", data.currentOccupancy.toString());
    formData.append("governorate_id", data.governorate_id.toString());

    // Coordinates
    if (data.coordinates) {
      formData.append("latitude", data.coordinates.lat.toString());
      formData.append("longitude", data.coordinates.lng.toString());
    }

    // Image - only append if it's a new file
    if (data.camp_img instanceof File) {
      formData.append("camp_img", data.camp_img);
    }

    const response = await fetch(`${API_BASE_URL}/camps/${slug}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
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
    slug: string,
    deleteRelated?: boolean,
  ): Promise<{ success: boolean; message: string }> => {
    const url = deleteRelated
      ? `${API_BASE_URL}/camps/${slug}?deleteRelated=true`
      : `${API_BASE_URL}/camps/${slug}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        Accept: "application/json",
        "Accept-Language": "ar",
      },
    });

    const resData = await response.json();

    if (!response.ok) {
      throw { ...resData, status: response.status };
    }

    return resData;
  },

  getCampBySlug: async (slug: string): Promise<CampResponse> => {
    const response = await apiRequest<CampResponse>(`/camps/${slug}`);
    return response;
  },

  getStatistics: async (page: number = 1): Promise<CampStatisticsResponse> => {
    return apiRequest<CampStatisticsResponse>(`/camps/statistics?page=${page}`);
  },

  getFamilyStatistics: async (): Promise<CampFamilyStatisticsResponse> => {
    return apiRequest<CampFamilyStatisticsResponse>("/camp/family-statistics");
  },
};
