import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  subject: z.string().optional(),
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
});

export type ContactMessageFormValues = z.infer<typeof contactMessageSchema>;

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
  status?: "new" | "read" | "replied";
  createdAt: string;
  updatedAt?: string;
}

export type CreateContactMessageDto = Omit<
  ContactMessage,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export enum MessageStatus {
  New = "new",
  Read = "read",
  Replied = "replied",
}
