import { z } from "zod";

// Schema for creating a new representative (delegate)
export const createRepresentativeSchema = z
  .object({
    name: z.string().min(1, "الاسم مطلوب"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    phone: z.string().min(10, "رقم الهاتف غير صحيح"),
    id_number: z.string().length(9, "رقم الهوية يجب أن يكون 9 أرقام"),
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    password_confirmation: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    backup_phone: z.string().optional(),
    admin_position: z.string().optional(),
    license_number: z.string().optional(),
    camp_id: z.string().min(1, "المخيم مطلوب"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["password_confirmation"],
  });

export type CreateRepresentativeFormValues = z.infer<
  typeof createRepresentativeSchema
>;

export interface CreateRepresentativeResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    name: string;
    email: string;
  };
}
