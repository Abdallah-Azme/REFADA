import { z } from "zod";

// ============================================
// Zod Schemas for Form Validation
// ============================================

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

// Registration schema with conditional validation
export const registerSchema = z
  .object({
    name: z.string().min(1, "الاسم مطلوب"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    password_confirmation: z.string(),
    id_number: z.string().min(1, "رقم الهوية مطلوب"),
    phone: z.string().min(1, "رقم الهاتف مطلوب"),
    backup_phone: z.string().optional(),
    role: z.enum(["delegate", "contributor"], {
      required_error: "يرجى اختيار نوع الحساب",
    }),
    // Optional fields for delegate
    admin_position: z.string().optional(),
    license_number: z.string().optional(),
    accept_terms: z.boolean().refine((val) => val === true, {
      message: "يجب الموافقة على الشروط والأحكام",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["password_confirmation"],
  })
  .refine(
    (data) => {
      // If role is delegate, admin_position and license_number are required
      if (data.role === "delegate") {
        return !!data.admin_position && !!data.license_number;
      }
      return true;
    },
    {
      message: "المنصب الإداري ورقم الترخيص مطلوبان للمندوب",
      path: ["admin_position"],
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
export type RegisterFormValues = z.infer<typeof registerSchema>;
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
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in?: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens?: AuthTokens; // May auto-login or require verification
  };
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
  data: {
    tokens: AuthTokens;
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
