import { z } from "zod";

// Profile Schema - matches backend response
export const profileSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  backupPhone: z.string().optional().nullable(),
  campName: z.string().optional().nullable(),
  idNumber: z.string().optional(),
  role: z.string().optional(),
  adminPosition: z.string().optional().nullable(),
  adminPositionName: z.string().optional().nullable(),
  licenseNumber: z.string().optional().nullable(),
  acceptTerms: z.boolean().optional(),
  status: z.string().optional(),
  profileImageUrl: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  camp: z.any().optional().nullable(),
});

export type Profile = z.infer<typeof profileSchema>;

// Update Profile Form Schema
export const updateProfileSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  idNumber: z.string().optional(),
  phone: z.string().optional(),
  backupPhone: z.string().optional(),
  adminPosition: z.string().optional(),
  licenseNumber: z.string().optional(),
  profile_image: z.any().optional(), // Keep as snake_case for file upload
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

// Change Password Schema
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    new_password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    new_password_confirmation: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "كلمة المرور غير متطابقة",
    path: ["new_password_confirmation"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
