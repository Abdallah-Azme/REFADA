import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().optional(),
  subject: z.string().min(1, "الموضوع مطلوب"),
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
});

export type ContactMessageFormValues = z.infer<typeof contactMessageSchema>;

export interface ContactMessage extends ContactMessageFormValues {
  id: string;
  status: "new" | "read" | "replied";
  createdAt: Date;
}

export type CreateContactMessageDto = Omit<
  ContactMessage,
  "id" | "status" | "createdAt"
>;

export enum MessageStatus {
  New = "new",
  Read = "read",
  Replied = "replied",
}
