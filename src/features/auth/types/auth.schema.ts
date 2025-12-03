import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "الاسم مطلوب"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export const verifySchema = z.object({
  code: z.string().length(6, "رمز التحقق يجب أن يكون 6 أرقام"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type VerifyFormValues = z.infer<typeof verifySchema>;

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "representative" | "contributor";
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
