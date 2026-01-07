import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, Clock, CheckCircle } from "lucide-react";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: Date;
}

export const dummyMessages: ContactMessage[] = [
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
    message: "نحتاج مساعدة عاجلة في الإيواء...",
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

interface AdminMessageColumnsProps {
  onView: (message: ContactMessage) => void;
  onDelete: (id: string) => void;
}

export const createAdminMessageColumns = (
  { onView, onDelete }: AdminMessageColumnsProps,
  t: (key: string) => string
): ColumnDef<ContactMessage>[] => [
  {
    accessorKey: "name",
    header: t("name"),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: t("email"),
  },
  {
    accessorKey: "subject",
    header: t("subject"),
  },
  {
    accessorKey: "createdAt",
    header: t("createdAt"),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      // Using a locale-agnostic or passed locale would be better, but 'ar-EG' was hardcoded.
      // We'll keep the formatting logic but maybe we should pass locale?
      // For now, let's stick to simple formatting or keep existing behavior.
      return (
        <div className="text-sm text-gray-500">
          {new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(date)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: t("status"),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      switch (status) {
        case "new":
          return (
            <Badge variant="default" className="bg-blue-500">
              <Clock className="h-3 w-3 mr-1" />
              {t("new")}
            </Badge>
          );
        case "read":
          return (
            <Badge variant="secondary">
              <Eye className="h-3 w-3 mr-1" />
              {t("read")}
            </Badge>
          );
        case "replied":
          return (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="h-3 w-3 mr-1" />
              {t("replied")}
            </Badge>
          );
        default:
          return null;
      }
    },
  },
  {
    id: "actions",
    header: t("actions"),
    cell: ({ row }) => {
      const message = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onView(message)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(message.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
