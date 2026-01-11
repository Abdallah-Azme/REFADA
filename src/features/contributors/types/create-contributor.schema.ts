import { z } from "zod";

// Schema for creating a new contributor
export const createContributorSchema = z
  .object({
    name: z.string().min(1, "الاسم مطلوب"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    phone: z.string().min(10, "رقم الهاتف غير صحيح"),
    id_number: z.string().length(9, "رقم الهوية يجب أن يكون 9 أرقام"),
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    password_confirmation: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    backup_phone: z.string().optional(),
    admin_position: z.string().min(1, "الصفة الإدارية مطلوبة"),
    license_number: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["password_confirmation"],
  })
  .refine(
    (data) => {
      // If admin_position is 'جمعية', license_number is required
      if (data.admin_position === "جمعية") {
        return !!data.license_number && data.license_number.length > 0;
      }
      return true;
    },
    {
      message: "رقم الترخيص مطلوب للجمعيات",
      path: ["license_number"],
    }
  );

export type CreateContributorFormValues = z.infer<
  typeof createContributorSchema
>;

export interface CreateContributorResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface DeleteContributorResponse {
  success: boolean;
  message: string;
}
