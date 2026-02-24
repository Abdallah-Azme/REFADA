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
  t: any,
  validDelegateNames?: string[] | null,
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
    id: "idNumber",
    accessorFn: (row: any) => row.idNumber || row.id_number || "",
    header: () => (
      <div className="text-center font-semibold">{t("table.id_number")}</div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {(row.getValue("idNumber") as string) || "-"}
      </div>
    ),
  },

  {
    id: "campName",
    accessorFn: (row: any) =>
      row.campName || row.camp_name || row.camp?.name || "",
    header: () => (
      <div className="text-center font-semibold">{t("table.camp_name")}</div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {(row.getValue("campName") as string) || "-"}
      </div>
    ),
    filterFn: (row, columnId, filterValue) => {
      // The filterValue here is the `campFilter` string from ComboBox (e.g. "إيواء حياة")
      if (!filterValue || filterValue === "all") return true;

      const nameVal = (row.getValue("name") as string) || "";

      // If validDelegateNames array is loaded, filter strictly by user presence in array
      if (validDelegateNames && validDelegateNames.length > 0) {
        return (
          validDelegateNames.includes(nameVal) ||
          validDelegateNames.includes(nameVal.trim())
        );
      } else if (validDelegateNames && validDelegateNames.length === 0) {
        // We searched a real camp, but it had 0 delegates
        return false;
      }

      // Fallback matching if api array is not available
      const campName = (row.getValue(columnId) as string) || "";
      return campName.includes(filterValue) || filterValue.includes(campName);
    },
  },

  {
    id: "adminPositionName",
    accessorFn: (row: any) =>
      row.adminPositionName ||
      row.admin_position_name ||
      row.adminPosition?.name ||
      "",
    header: () => (
      <div className="text-center font-semibold">
        {t("table.admin_position")}
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {(row.getValue("adminPositionName") as string) || "-"}
      </div>
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
    id: "createdAt",
    accessorFn: (row: any) =>
      row.createdAt || row.created_at || new Date().toISOString(),
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
      const dateString = row.getValue("createdAt") as string;
      const date = new Date(dateString);
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
