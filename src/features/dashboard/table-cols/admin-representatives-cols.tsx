import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, X } from "lucide-react";
import { PendingUser } from "@/features/representatives/types/pending-users.schema";

type ActionHandlers = {
  onApprove: (user: PendingUser) => void;
  onReject: (user: PendingUser) => void;
};

export const createPendingDelegatesColumns = (
  handlers: ActionHandlers
): ColumnDef<PendingUser>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          الاسم
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium">{row.original.name}</div>
    ),
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          البريد الإلكتروني
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-right">{row.original.email}</div>,
  },

  {
    accessorKey: "phone",
    header: () => <div className="text-center font-semibold">رقم الهاتف</div>,
    cell: ({ row }) => <div className="text-center">{row.original.phone}</div>,
  },

  {
    accessorKey: "campName",
    header: () => <div className="text-center font-semibold">اسم المخيم</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.campName || "-"}</div>
    ),
  },

  {
    accessorKey: "idNumber",
    header: () => <div className="text-center font-semibold">رقم الهوية</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.idNumber}</div>
    ),
  },

  {
    accessorKey: "licenseNumber",
    header: () => <div className="text-center font-semibold">رقم الترخيص</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.licenseNumber || "-"}</div>
    ),
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
            variant={status === "approved" ? "default" : "secondary"}
            className={
              status === "approved"
                ? "bg-green-500 hover:bg-green-600"
                : status === "pending"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-red-500 hover:bg-red-600"
            }
          >
            {status === "approved"
              ? "مقبول"
              : status === "pending"
              ? "قيد الانتظار"
              : "مرفوض"}
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          تاريخ التسجيل
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="text-center">{date.toLocaleDateString("ar-EG")}</div>
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="text-center font-semibold">الإجراءات</div>,
    cell: ({ row }) => {
      const user = row.original;
      const isPending = user.status === "pending";

      if (!isPending) return null;

      return (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
            onClick={() => handlers.onApprove(user)}
            title="قبول"
          >
            <Check className="h-4 w-4" />
            قبول
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
            onClick={() => handlers.onReject(user)}
            title="رفض"
          >
            <X className="h-4 w-4" />
            رفض
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
