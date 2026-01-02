import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, Pencil, Trash2 } from "lucide-react";
import { Project } from "@/features/projects";

/**
 * Creates column definitions for the data table
 *
 * @param handlers - Object containing callback functions for actions
 * @returns Array of column definitions compatible with @tanstack/react-table
 */

type ActionHandlers = {
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onUpdate: (project: Project) => void;
  hideApproveDelete?: boolean;
};

export const createColumns = (
  handlers: ActionHandlers
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
          aria-label="تحديد الكل"
        />
      </div>
    ),

    cell: ({ row }) => (
      <Checkbox
        className=" mx-6"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="تحديد الصف"
      />
    ),
    // Disable sorting and hiding for this utility column
    enableSorting: false,
    enableHiding: false,
  },

  // ========================================
  // PROJECT NAME COLUMN (Project)
  // ========================================
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          المشروع
          <ArrowUpDown className="me-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right">
        <div className="font-semibold text-gray-900">{row.original.name}</div>
        <div className="text-sm text-gray-500">
          {/* Requests field not in API, using beneficiaryCount as substitute or empty */}
          {row.original.beneficiaryCount} مستفيد
        </div>
      </div>
    ),
  },

  // ========================================
  // PROGRESS COLUMN
  // Shows progress bar based on totalReceived/total
  // ========================================
  {
    id: "progress",
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          التقدم
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const totalReceived = row.original.totalReceived || 0;
      const totalRemaining = row.original.totalRemaining || 0;
      const total = totalReceived + totalRemaining;

      // Calculate percentage
      const percentage =
        total > 0 ? Math.round((totalReceived / total) * 100) : 0;

      // Determine color based on progress
      let progressColor = "bg-blue-500"; // Not started
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
          {/* Progress bar */}
          <div className={`w-full h-2 rounded-full ${bgColor}`}>
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          {/* Percentage text */}
          <span className={`text-xs font-medium ${textColor}`}>
            {percentage}% ({totalReceived}/{total})
          </span>
        </div>
      );
    },
  },

  // ========================================
  // TOTAL COLUMN
  // ========================================
  {
    id: "total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          الاجمالي
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

  // ========================================
  // RECEIVED COLUMN
  // ========================================
  {
    accessorKey: "totalReceived",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          تم تسليم
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.original.totalReceived}</div>
    ),
  },

  // ========================================
  // REMAINING COLUMN
  // ========================================
  {
    accessorKey: "totalRemaining",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          المتبقي
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.original.totalRemaining}</div>
    ),
  },

  // ========================================
  // CONTRIBUTIONS COLUMN
  // ========================================
  {
    id: "contributions",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          المساهمات
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">0</div> // API doesn't return contributions count yet
    ),
  },

  // ========================================
  // ACTIONS COLUMN
  // Following shadcn/ui pattern for row actions
  // Contains edit, delete, and approve buttons
  // Uses Button component with ghost variant and icon size
  // ========================================
  {
    id: "update",
    header: () =>
      handlers.hideApproveDelete ? null : (
        <div className="text-center font-semibold">تحديث</div>
      ),
    cell: ({ row }) => {
      if (handlers.hideApproveDelete) return null;
      const project = row.original;
      const isPending =
        project.status === "pending" || project.status === "في الانتظار";

      // Show accepted indicator if project is not pending
      if (!isPending) {
        return (
          <div className="flex items-center justify-center">
            <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
              تم القبول
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
            <span className="sr-only">تحديث</span>
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: "edit",
    header: () => <div className="text-center font-semibold">تعديل</div>,
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
            <span className="sr-only">تعديل</span>
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
        <div className="text-center font-semibold">حذف</div>
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
            <span className="sr-only">حذف</span>
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
