import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyResetCodeRequest,
  VerifyResetCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ApiErrorResponse,
} from "../types/auth.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Helper function to convert object to FormData
 */
function toFormData(data: Record<string, any>): FormData {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value !== undefined && value !== null) {
      // Convert boolean to string "1" or "0" for API
      if (typeof value === "boolean") {
        formData.append(key, value ? "1" : "0");
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  return formData;
}

/**
 * Helper function to make API requests
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": "ar",
    "X-Front-URL": typeof window !== "undefined" ? window.location.origin : "",
  };

  // Merge existing headers
  if (options.headers) {
    const existingHeaders = new Headers(options.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  // Add auth token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // Include cookies
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as ApiErrorResponse;
  }

  return data as T;
}

/**
 * Login API
 */
export async function loginApi(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const formData = toFormData(credentials);

  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: formData,
  });
}

/**
 * Register API
 */
export async function registerApi(
  data: RegisterRequest
): Promise<RegisterResponse> {
  const formData = toFormData(data);

  return apiRequest<RegisterResponse>("/auth/register", {
    method: "POST",
    body: formData,
  });
}

/**
 * Forgot Password API
 */
export async function forgotPasswordApi(
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> {
  const formData = toFormData(data);

  return apiRequest<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: formData,
  });
}

/**
 * Verify Reset Code API
 */
export async function verifyResetCodeApi(
  data: VerifyResetCodeRequest
): Promise<VerifyResetCodeResponse> {
  const formData = toFormData(data);

  return apiRequest<VerifyResetCodeResponse>("/auth/verify-reset-code", {
    method: "POST",
    body: formData,
  });
}

/**
 * Reset Password API
 */
export async function resetPasswordApi(
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> {
  const formData = toFormData(data);

  return apiRequest<ResetPasswordResponse>("/auth/reset-password", {
    method: "POST",
    body: formData,
  });
}

/**
 * Refresh Token API
 */
export async function refreshTokenApi(
  data: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
  const formData = toFormData(data);

  return apiRequest<RefreshTokenResponse>("/auth/refresh-token", {
    method: "POST",
    body: formData,
  });
}

/**
 * Logout API
 */
export async function logoutApi(): Promise<{
  success: boolean;
  message: string;
}> {
  return apiRequest("/logout", {
    method: "POST",
    body: new FormData(), // Empty form data
  });
}

/**
 * Delete Account API
 */
export async function deleteAccountApi(): Promise<{
  success: boolean;
  message: string;
}> {
  return apiRequest("/delete-account", {
    method: "DELETE",
  });
}

/**
 * Update FCM Token API
 */
export async function updateFcmTokenApi(
  fcmToken: string
): Promise<{ success: boolean; message: string }> {
  const formData = toFormData({ fcm_token: fcmToken });

  return apiRequest("/user/fcm-token", {
    method: "POST",
    body: formData,
  });
}
