import { z } from "zod";

// ============================================
// Zod Schemas for Form Validation
// ============================================

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

// Registration schema with conditional validation
// Registration schema with conditional validation
export const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z.string().min(1, t("validation.name_required")),
      email: z.string().email(t("validation.invalid_email")),
      password: z.string().min(8, t("validation.password_min_length_8")),
      password_confirmation: z.string(),
      id_number: z.string().length(9, t("validation.id_must_be_9_digits")),
      phone: z.string().min(1, t("validation.phone_required")),
      backup_phone: z.string().optional(),
      role: z.enum(["delegate", "contributor"], {
        required_error: t("validation.select_role"),
      }),
      // Contributor-specific fields
      admin_position: z.string().optional(),
      license_number: z.string().optional(),
      accept_terms: z.boolean().refine((val) => val === true, {
        message: t("validation.terms_required"),
      }),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("validation.password_mismatch"),
      path: ["password_confirmation"],
    })
    .refine(
      (data) => {
        // If role is contributor, admin_position is required
        if (data.role === "contributor") {
          return !!data.admin_position;
        }
        return true;
      },
      {
        message: t("validation.admin_position_required"),
        path: ["admin_position"],
      }
    )
    .refine(
      (data) => {
        // If admin_position is 'association', license_number is required
        if (data.admin_position === "association") {
          return !!data.license_number && data.license_number.length > 0;
        }
        return true;
      },
      {
        message: t("validation.license_required_for_association"),
        path: ["license_number"],
      }
    );

export const forgotPasswordSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
});

export const verifyResetCodeSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  reset_code: z.string().length(6, "رمز التحقق يجب أن يكون 6 أرقام"),
});

export const resetPasswordSchema = z
  .object({
    reset_token: z.string().min(1, "رمز إعادة التعيين مطلوب"),
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["password_confirmation"],
  });

// ============================================
// TypeScript Types
// ============================================

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type VerifyResetCodeFormValues = z.infer<typeof verifyResetCodeSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// ============================================
// API Request/Response Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  id_number: string;
  phone: string;
  backup_phone?: string;
  role: "delegate" | "contributor";
  admin_position?: string; // Required for delegate
  license_number?: string; // Required for delegate
  accept_terms: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  reset_code: string;
}

export interface ResetPasswordRequest {
  reset_token: string;
  password: string;
  password_confirmation: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "delegate" | "contributor";
  id_number?: string;
  phone?: string;
  backup_phone?: string;
  admin_position?: string;
  license_number?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  accessExpiresIn?: number;
  refreshExpiresIn?: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    tokenType: "Bearer";
    accessExpiresIn: number;
    refreshExpiresIn: number;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken?: string;
    refreshToken?: string;
    tokenType?: "Bearer";
    accessExpiresIn?: number;
    refreshExpiresIn?: number;
  } | null;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyResetCodeResponse {
  success: boolean;
  message: string;
  data: {
    reset_token: string;
  };
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    tokenType: "Bearer";
    accessExpiresIn: number;
    refreshExpiresIn: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// ============================================
// Auth State
// ============================================

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
