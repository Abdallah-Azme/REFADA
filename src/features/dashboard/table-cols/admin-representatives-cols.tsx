import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, X, Trash2, KeyRound } from "lucide-react";
import { PendingUser } from "@/features/representatives/types/pending-users.schema";

type ActionHandlers = {
  onApprove: (user: PendingUser) => void;
  onReject: (user: PendingUser) => void;
  onDelete?: (user: PendingUser) => void;
  onChangePassword?: (user: PendingUser) => void;
};

export const createPendingDelegatesColumns = (
  handlers: ActionHandlers,
  t: any
): ColumnDef<PendingUser>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("table.name")}
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium">{row.original.name}</div>
    ),
  },

  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("table.role")}
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <div className="text-center">
          <Badge variant="outline">
            {role === "delegate"
              ? t("table.roles.delegate")
              : role === "contributor"
              ? t("table.roles.contributor")
              : role}
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("table.email")}
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-right">{row.original.email}</div>,
  },

  {
    accessorKey: "phone",
    header: () => (
      <div className="text-center font-semibold">{t("table.phone")}</div>
    ),
    cell: ({ row }) => <div className="text-center">{row.original.phone}</div>,
  },

  {
    accessorKey: "idNumber",
    header: () => (
      <div className="text-center font-semibold">{t("table.id_number")}</div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.idNumber}</div>
    ),
  },

  {
    accessorKey: "campName",
    header: () => (
      <div className="text-center font-semibold">{t("table.camp_name")}</div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.campName || "-"}</div>
    ),
  },

  {
    accessorKey: "adminPositionName",
    header: () => (
      <div className="text-center font-semibold">
        {t("table.admin_position")}
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.adminPositionName || "-"}</div>
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
          {t("table.status")}
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
              ? t("table.status_labels.approved")
              : status === "pending"
              ? t("table.status_labels.pending")
              : t("table.status_labels.rejected")}
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
          {t("table.created_at")}
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
    header: () => (
      <div className="text-center font-semibold">{t("table.actions")}</div>
    ),
    cell: ({ row }) => {
      const user = row.original;
      const isPending = user.status === "pending";
      const isApproved = user.status === "approved";

      if (isPending) {
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
              onClick={() => handlers.onApprove(user)}
              title={t("table.actions_labels.approve")}
            >
              <Check className="h-4 w-4" />
              {t("table.actions_labels.approve")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
              onClick={() => handlers.onReject(user)}
              title={t("table.actions_labels.reject")}
            >
              <X className="h-4 w-4" />
              {t("table.actions_labels.reject")}
            </Button>
          </div>
        );
      }

      if (isApproved) {
        return (
          <div className="flex items-center justify-center gap-2">
            {handlers.onChangePassword && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                onClick={() => handlers.onChangePassword!(user)}
                title={t("table.actions_labels.change_password")}
              >
                <KeyRound className="h-4 w-4" />
              </Button>
            )}
            {handlers.onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                onClick={() => handlers.onDelete!(user)}
                title={t("table.actions_labels.delete")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      }

      // Rejected users - show delete button
      if (user.status === "rejected" && handlers.onDelete) {
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
              onClick={() => handlers.onDelete!(user)}
              title={t("table.actions_labels.delete")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }

      return null;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
