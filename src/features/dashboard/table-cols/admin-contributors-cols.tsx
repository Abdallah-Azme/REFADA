import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react";

export type AdminContributor = {
  id: number;
  name: string;
  type: "organization" | "individual" | "company";
  email: string;
  phone: string;
  totalContributions: string;
  status: "active" | "inactive";
};

export const dummyAdminContributors: AdminContributor[] = [
  {
    id: 1,
    name: "مؤسسة الخير",
    type: "organization",
    email: "info@alkhair.org",
    phone: "0112345678",
    totalContributions: "500,000 ر.س",
    status: "active",
  },
  {
    id: 2,
    name: "محمد عبدالله",
    type: "individual",
    email: "mohammed@example.com",
    phone: "0551234567",
    totalContributions: "5,000 ر.س",
    status: "active",
  },
  {
    id: 3,
    name: "شركة العطاء",
    type: "company",
    email: "contact@alataa.com",
    phone: "0123456789",
    totalContributions: "100,000 ر.س",
    status: "inactive",
  },
  {
    id: 4,
    name: "جمعية البر",
    type: "organization",
    email: "info@albirr.org",
    phone: "0112223344",
    totalContributions: "250,000 ر.س",
    status: "active",
  },
  {
    id: 5,
    name: "أحمد سالم",
    type: "individual",
    email: "ahmed.salem@example.com",
    phone: "0509998877",
    totalContributions: "15,000 ر.س",
    status: "active",
  },
];

type ActionHandlers = {
  onToggleStatus: (contributor: AdminContributor) => void;
  onEdit: (contributor: AdminContributor) => void;
  onDelete: (contributor: AdminContributor) => void;
  onView: (contributor: AdminContributor) => void;
};

export const createAdminContributorColumns = (
  handlers: ActionHandlers
): ColumnDef<AdminContributor>[] => [
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
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          النوع
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div className="text-center">
          {type === "organization"
            ? "مؤسسة"
            : type === "company"
            ? "شركة"
            : "فرد"}
        </div>
      );
    },
  },

  {
    accessorKey: "email",
    header: () => (
      <div className="text-center font-semibold">البريد الإلكتروني</div>
    ),
    cell: ({ row }) => <div className="text-right">{row.original.email}</div>,
  },

  {
    accessorKey: "phone",
    header: () => <div className="text-center font-semibold">رقم الهاتف</div>,
    cell: ({ row }) => <div className="text-center">{row.original.phone}</div>,
  },

  {
    accessorKey: "totalContributions",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          إجمالي المساهمات
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.original.totalContributions}</div>
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
      const contributor = row.original;
      return (
        <div className="flex justify-center">
          <Switch
            checked={contributor.status === "active"}
            onCheckedChange={() => handlers.onToggleStatus(contributor)}
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
      const contributor = row.original;
      return (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => handlers.onView(contributor)}
            title="عرض التفاصيل"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
            onClick={() => handlers.onEdit(contributor)}
            title="تعديل"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700"
            onClick={() => handlers.onDelete(contributor)}
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

import { PendingUser } from "@/features/representatives/types/pending-users.schema";

export const createApprovedContributorsColumns =
  (): ColumnDef<PendingUser>[] => [
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
      cell: ({ row }) => (
        <div className="text-center">{row.original.phone}</div>
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
      header: () => (
        <div className="text-center font-semibold">رقم الترخيص</div>
      ),
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
  ];
