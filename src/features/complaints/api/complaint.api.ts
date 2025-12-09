import { ComplaintFormValues } from "../types/complaint.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type ComplaintResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export const complaintApi = {
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
};
