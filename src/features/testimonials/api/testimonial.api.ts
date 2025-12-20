import {
  Testimonial,
  TestimonialFormValues,
} from "../types/testimonial.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type TestimonialsResponse = {
  success: boolean;
  message: string;
  data: Testimonial[];
};

type TestimonialResponse = {
  success: boolean;
  message: string;
  data: Testimonial; // Or TestimonialDetail
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": "ar", // Default to AR for listing
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

export const testimonialApi = {
  getAll: async (): Promise<TestimonialsResponse> => {
    return apiRequest<TestimonialsResponse>("/testimonials");
  },

  getById: async (id: number): Promise<TestimonialResponse> => {
    return apiRequest<TestimonialResponse>(`/testimonials/${id}`);
  },

  create: async (data: TestimonialFormValues): Promise<TestimonialResponse> => {
    const formData = new FormData();
    formData.append("user_name", data.userName);
    if (data.userImage instanceof File) {
      formData.append("user_image", data.userImage);
    }
    formData.append("opinion[ar]", data.opinion_ar);
    formData.append("opinion[en]", data.opinion_en);
    if (data.order) {
      formData.append("order", data.order.toString());
    }

    return apiRequest<TestimonialResponse>("/testimonials", {
      method: "POST",
      body: formData,
    });
  },

  update: async (
    id: number,
    data: TestimonialFormValues
  ): Promise<TestimonialResponse> => {
    const formData = new FormData();
    formData.append("user_name", data.userName);
    if (data.userImage instanceof File) {
      formData.append("user_image", data.userImage);
    }
    formData.append("opinion[ar]", data.opinion_ar);
    formData.append("opinion[en]", data.opinion_en);
    if (data.order) {
      formData.append("order", data.order.toString());
    }

    // Since it's an update with file, we often use POST with _method=PUT or just POST if the backend supports it.
    // The postman says POST. I'll try just POST first.
    return apiRequest<TestimonialResponse>(`/testimonials/${id}`, {
      method: "POST",
      body: formData,
    });
  },

  delete: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    return apiRequest(`/testimonials/${id}`, {
      method: "DELETE",
    });
  },
};
