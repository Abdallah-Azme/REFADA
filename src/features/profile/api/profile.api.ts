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

    // Append all fields to FormData with snake_case names as expected by the API
    // Always send required fields to match registration validation
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("id_number", formData.idNumber || "");
    formDataToSend.append("phone", formData.phone || "");

    // Optional fields
    if (formData.backupPhone) {
      formDataToSend.append("backup_phone", formData.backupPhone);
    }
    // Note: admin_position and license_number are set during registration and are read-only
    // They should not be updated via profile update

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
