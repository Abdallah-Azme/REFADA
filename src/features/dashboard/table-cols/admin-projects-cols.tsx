import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, X, Eye } from "lucide-react";

export type AdminProject = {
  id: number;
  name: string;
  representative: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  budget: string;
};

export const dummyAdminProjects: AdminProject[] = [
  {
    id: 1,
    name: "مشروع كفالة اليتيم",
    representative: "أحمد محمد",
    date: "2024-01-15",
    status: "pending",
    budget: "50,000 ر.س",
  },
  {
    id: 2,
    name: "بناء مسجد",
    representative: "سارة علي",
    date: "2024-02-10",
    status: "approved",
    budget: "150,000 ر.س",
  },
  {
    id: 3,
    name: "سقيا الماء",
    representative: "خالد عمر",
    date: "2024-03-05",
    status: "rejected",
    budget: "20,000 ر.س",
  },
  {
    id: 4,
    name: "مشروع إفطار صائم",
    representative: "فاطمة أحمد",
    date: "2024-01-20",
    status: "pending",
    budget: "30,000 ر.س",
  },
  {
    id: 5,
    name: "كسوة الشتاء",
    representative: "محمد علي",
    date: "2024-02-15",
    status: "approved",
    budget: "80,000 ر.س",
  },
];

type ActionHandlers = {
  onAccept: (project: AdminProject) => void;
  onDecline: (project: AdminProject) => void;
  onView: (project: AdminProject) => void;
};

export const createAdminProjectColumns = (
  handlers: ActionHandlers
): ColumnDef<AdminProject>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          اسم المشروع
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium">{row.original.name}</div>
    ),
  },

  {
    accessorKey: "representative",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          المندوب
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right">{row.original.representative}</div>
    ),
  },

  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          تاريخ التقديم
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-center">{row.original.date}</div>,
  },

  {
    accessorKey: "budget",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          الميزانية
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-center">{row.original.budget}</div>,
  },

  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          الحالة
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex justify-center">
          <Badge
            variant={
              status === "approved"
                ? "default"
                : status === "rejected"
                ? "destructive"
                : "secondary"
            }
            className={
              status === "approved"
                ? "bg-green-500 hover:bg-green-600"
                : status === "pending"
                ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                : ""
            }
          >
            {status === "approved"
              ? "مقبول"
              : status === "rejected"
              ? "مرفوض"
              : "قيد الانتظار"}
          </Badge>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="text-center font-semibold">الإجراءات</div>,
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => handlers.onView(project)}
            title="عرض التفاصيل"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {project.status === "pending" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-green-600 hover:bg-green-100 hover:text-green-700"
                onClick={() => handlers.onAccept(project)}
                title="قبول"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700"
                onClick={() => handlers.onDecline(project)}
                title="رفض"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
