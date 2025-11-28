import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Trash2 } from "lucide-react";

export type AdminRepresentative = {
  id: number;
  name: string;
  email: string;
  phone: string;
  projectsCount: number;
  status: "active" | "inactive";
};

export const dummyAdminRepresentatives: AdminRepresentative[] = [
  {
    id: 1,
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "0501234567",
    projectsCount: 5,
    status: "active",
  },
  {
    id: 2,
    name: "سارة علي",
    email: "sara@example.com",
    phone: "0507654321",
    projectsCount: 3,
    status: "inactive",
  },
  {
    id: 3,
    name: "خالد عمر",
    email: "khaled@example.com",
    phone: "0509876543",
    projectsCount: 0,
    status: "active",
  },
  {
    id: 4,
    name: "فاطمة أحمد",
    email: "fatima@example.com",
    phone: "0551234567",
    projectsCount: 8,
    status: "active",
  },
  {
    id: 5,
    name: "محمد علي",
    email: "mohammed.ali@example.com",
    phone: "0509876543",
    projectsCount: 2,
    status: "inactive",
  },
];

type ActionHandlers = {
  onToggleStatus: (rep: AdminRepresentative) => void;
  onDelete: (rep: AdminRepresentative) => void;
  onView: (rep: AdminRepresentative) => void;
};

export const createAdminRepresentativeColumns = (
  handlers: ActionHandlers
): ColumnDef<AdminRepresentative>[] => [
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
    accessorKey: "projectsCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          عدد المشاريع
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.original.projectsCount}</div>
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
            variant={status === "active" ? "default" : "secondary"}
            className={
              status === "active" ? "bg-green-500 hover:bg-green-600" : ""
            }
          >
            {status === "active" ? "نشط" : "غير نشط"}
          </Badge>
        </div>
      );
    },
  },

  {
    id: "toggle",
    header: () => <div className="text-center font-semibold">تفعيل/تعطيل</div>,
    cell: ({ row }) => {
      const rep = row.original;
      return (
        <div className="flex justify-center">
          <Switch
            checked={rep.status === "active"}
            onCheckedChange={() => handlers.onToggleStatus(rep)}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: "actions",
    header: () => <div className="text-center font-semibold">الإجراءات</div>,
    cell: ({ row }) => {
      const rep = row.original;
      return (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => handlers.onView(rep)}
            title="عرض التفاصيل"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700"
            onClick={() => handlers.onDelete(rep)}
            title="حذف"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
