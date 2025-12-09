import { z } from "zod";

export const complaintSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(8, "رقم الهاتف مطلوب"),
  topic: z.string().min(2, "الموضوع مطلوب"),
  message: z.string().min(5, "الرسالة مطلوبة"),
  camp_id: z.number().or(z.string()),
});

export type ComplaintFormValues = z.infer<typeof complaintSchema>;

export interface Complaint {
  id: number;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  campId: number;
  campName: string;
  createdAt: string;
  updatedAt: string;
}
