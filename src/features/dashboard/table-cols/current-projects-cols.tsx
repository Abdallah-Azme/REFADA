import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, Pencil, Trash2 } from "lucide-react";
import { Project } from "@/features/projects";

export type { Project };

/**
 * Creates column definitions for the data table
 *
 * @param handlers - Object containing callback functions for actions
 * @returns Array of column definitions compatible with @tanstack/react-table
 */

// ... imports

type ActionHandlers = {
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onUpdate: (project: Project) => void;
  t: (key: string) => string;
  hideApproveDelete?: boolean;
};

export const createColumns = (
  handlers: ActionHandlers,
): ColumnDef<Project>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="  flex items-start mx-6">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={handlers.t("actions.select_all")}
        />
      </div>
    ),
    cell: ({ row }) => (
      <Checkbox
        className=" mx-6"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={handlers.t("actions.select_row")}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {handlers.t("columns.project")}
          <ArrowUpDown className="me-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right">
        <div className="font-semibold text-gray-900">{row.original.name}</div>
        <div className="text-sm text-gray-500">
          {row.original.beneficiaryCount} مستفيد
        </div>
      </div>
    ),
  },
  {
    accessorKey: "camp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {handlers.t("columns.camp")}
          <ArrowUpDown className="me-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center text-gray-700">
        {row.original.camp || "-"}
      </div>
    ),
  },
  {
    id: "progress",
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {handlers.t("columns.progress")}
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    // ... cell implementation remains same logic, just keeping it
    cell: ({ row }) => {
      const totalReceived = row.original.totalReceived || 0;
      const totalRemaining = row.original.totalRemaining || 0;
      const total = totalReceived + totalRemaining;

      const percentage =
        total > 0 ? Math.round((totalReceived / total) * 100) : 0;

      let progressColor = "bg-blue-500";
      let bgColor = "bg-blue-100";
      let textColor = "text-blue-700";

      if (percentage === 100) {
        progressColor = "bg-green-500";
        bgColor = "bg-green-100";
        textColor = "text-green-700";
      } else if (percentage > 0) {
        progressColor = "bg-orange-500";
        bgColor = "bg-orange-100";
        textColor = "text-orange-700";
      }

      return (
        <div className="flex flex-col items-center gap-1 min-w-[120px]">
          <div className={`w-full h-2 rounded-full ${bgColor}`}>
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className={`text-xs font-medium ${textColor}`}>
            {percentage}% ({totalReceived}/{total})
          </span>
        </div>
      );
    },
  },
  {
    id: "total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {handlers.t("columns.total")}
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.totalReceived + row.original.totalRemaining}
      </div>
    ),
  },
  {
    accessorKey: "totalReceived",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {handlers.t("columns.received")}
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.original.totalReceived}</div>
    ),
  },
  {
    accessorKey: "totalRemaining",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {handlers.t("columns.remaining")}
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.original.totalRemaining}</div>
    ),
  },
  {
    id: "contributions",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {handlers.t("columns.contributions")}
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-center">0</div>,
  },
  {
    id: "update",
    header: () =>
      handlers.hideApproveDelete ? null : (
        <div className="text-center font-semibold">
          {handlers.t("columns.update")}
        </div>
      ),
    cell: ({ row }) => {
      if (handlers.hideApproveDelete) return null;
      const project = row.original;
      const isPending =
        project.status === "pending" || project.status === "في الانتظار";

      if (!isPending) {
        return (
          <div className="flex items-center justify-center">
            <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
              {handlers.t("actions.accepted")}
            </span>
          </div>
        );
      }

      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            className="h-8 w-8 p-2 text-green-600 hover:bg-green-100 hover:text-green-700"
            onClick={() => handlers.onUpdate(project)}
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">{handlers.t("actions.update")}</span>
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "edit",
    header: () => (
      <div className="text-center font-semibold">
        {handlers.t("columns.edit")}
      </div>
    ),
    cell: ({ row }) => {
      const project = row.original;

      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
            onClick={() => handlers.onEdit(project)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">{handlers.t("actions.edit")}</span>
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "delete",
    header: () =>
      handlers.hideApproveDelete ? null : (
        <div className="text-center font-semibold">
          {handlers.t("columns.delete")}
        </div>
      ),
    cell: ({ row }) => {
      if (handlers.hideApproveDelete) return null;
      const project = row.original;

      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700"
            onClick={() => handlers.onDelete(project)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{handlers.t("actions.delete")}</span>
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
