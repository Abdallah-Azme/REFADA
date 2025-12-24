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
  // STATUS COLUMN
  // Shows status with colored badge
  // Colors match the screenshot: orange, green, pink, blue
  // ========================================
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          الحالة
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    /**
     * Status badge with conditional styling
     * We determine the color based on the status value:
     * - قيد التنفيذ (In Progress) -> Orange
     * - تم التسليم (Delivered) -> Green
     * - ملغي (Cancelled) -> Pink
     * - في الانتظار (Waiting) -> Blue
     */
    cell: ({ row }) => {
      const status = row.original.status;

      let badgeClass =
        "px-3 py-1 rounded-md text-center w-fit text-sm font-medium inline-block";

      if (status === "قيد التنفيذ") {
        badgeClass += " bg-orange-100 text-orange-700";
      } else if (status === "تم التسليم") {
        badgeClass += " bg-green-100 text-green-700";
      } else if (status === "ملغي") {
        badgeClass += " bg-pink-100 text-pink-700";
      } else if (status === "في الانتظار") {
        badgeClass += " bg-blue-100 text-blue-700";
      }

      return (
        <div className="flex justify-center w-full">
          <span className={badgeClass}>{status}</span>
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
