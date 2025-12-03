import { ContactMessage } from "../types/message.schema";

export const mockMessages: ContactMessage[] = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+970599123456",
    subject: "استفسار عن المشاريع",
    message: "أود الاستفسار عن كيفية المشاركة في المشاريع الخيرية...",
    status: "new",
    createdAt: new Date("2024-01-15T10:30:00"),
  },
  {
    id: "2",
    name: "فاطمة علي",
    email: "fatima@example.com",
    phone: "+970598765432",
    subject: "طلب مساعدة",
    message: "نحتاج مساعدة عاجلة في المخيم...",
    status: "read",
    createdAt: new Date("2024-01-14T14:20:00"),
  },
  {
    id: "3",
    name: "محمود حسن",
    email: "mahmoud@example.com",
    subject: "شكر وتقدير",
    message: "نشكركم على جهودكم الرائعة في خدمة المجتمع...",
    status: "replied",
    createdAt: new Date("2024-01-13T09:15:00"),
  },
];
