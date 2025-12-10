import {
  Profile,
  UpdateProfileFormValues,
  ChangePasswordFormValues,
} from "../types/profile.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type ProfileResponse = {
  success: boolean;
  message: string;
  data: Profile;
};

async function getAuthToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

export const profileApi = {
  getProfile: async (): Promise<ProfileResponse> => {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Accept-Language": "ar",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw { ...data, status: response.status };
    }

    return data;
  },

  updateProfile: async (
    formData: UpdateProfileFormValues
  ): Promise<ProfileResponse> => {
    const token = await getAuthToken();
    const formDataToSend = new FormData();

    // Append all fields to FormData with camelCase names
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);

    if (formData.idNumber) formDataToSend.append("idNumber", formData.idNumber);
    if (formData.phone) formDataToSend.append("phone", formData.phone);
    if (formData.backupPhone)
      formDataToSend.append("backupPhone", formData.backupPhone);
    if (formData.adminPosition)
      formDataToSend.append("adminPosition", formData.adminPosition);
    if (formData.licenseNumber)
      formDataToSend.append("licenseNumber", formData.licenseNumber);

    // Handle file upload
    if (formData.profile_image instanceof File) {
      formDataToSend.append("profile_image", formData.profile_image);
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Accept-Language": "ar",
      },
      body: formDataToSend,
    });

    const data = await response.json();

    if (!response.ok) {
      throw { ...data, status: response.status };
    }

    return data;
  },

  changePassword: async (
    passwordData: ChangePasswordFormValues
  ): Promise<{ success: boolean; message: string }> => {
    const token = await getAuthToken();
    const formData = new FormData();

    formData.append("current_password", passwordData.current_password);
    formData.append("new_password", passwordData.new_password);
    formData.append(
      "new_password_confirmation",
      passwordData.new_password_confirmation
    );

    const response = await fetch(`${API_BASE_URL}/profile/change-password`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Accept-Language": "ar",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw { ...data, status: response.status };
    }

    return data;
  },
};
