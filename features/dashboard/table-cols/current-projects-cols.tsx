import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, Pencil, Trash2 } from "lucide-react";

// ============================================================================
// DUMMY DATA
// In production, this would come from an API call
// Simulating server data for demonstration purposes

export type Project = {
  id: number;
  projectName: string;
  status: string;
  total: number;
  received: number;
  remaining: number;
  contributions: number;
  requests: string;
};

// ============================================================================
export const dummyData: Project[] = [
  {
    id: 1,
    projectName: "مشروع 1200 علبة لبن",
    status: "قيد التنفيذ",
    total: 1200,
    received: 700,
    remaining: 500,
    contributions: 3,
    requests: "3 طلبات",
  },
  {
    id: 2,
    projectName: "مشروع 50 حقيبة",
    status: "تم التسليم",
    total: 50,
    received: 20,
    remaining: 30,
    contributions: 33,
    requests: "3 طلبات",
  },
  {
    id: 3,
    projectName: "مشروع 130 علبة لبن",
    status: "تم التسليم",
    total: 130,
    received: 100,
    remaining: 30,
    contributions: 10,
    requests: "3 طلبات",
  },
  {
    id: 4,
    projectName: "مشروع 30 عبوة دقيق",
    status: "قيد التنفيذ",
    total: 30,
    received: 10,
    remaining: 20,
    contributions: 2,
    requests: "3 طلبات",
  },
  {
    id: 5,
    projectName: "مشروع 20 علبة لبن",
    status: "ملغي",
    total: 20,
    received: 10,
    remaining: 10,
    contributions: 2,
    requests: "3 طلبات",
  },
  {
    id: 6,
    projectName: "مشروع 20 علبة لبن",
    status: "تم التسليم",
    total: 1200,
    received: 1200,
    remaining: 1200,
    contributions: 1200,
    requests: "3 طلبات",
  },
  {
    id: 7,
    projectName: "مشروع 20 علبة لبن",
    status: "ملغي",
    total: 1200,
    received: 10,
    remaining: 10,
    contributions: 1200,
    requests: "3 طلبات",
  },
  {
    id: 8,
    projectName: "مشروع 20 علبة لبن",
    status: "في الانتظار",
    total: 1200,
    received: 1200,
    remaining: 1200,
    contributions: 1200,
    requests: "3 طلبات",
  },
];

/**
 * Creates column definitions for the data table
 *
 * @param handlers - Object containing callback functions for actions
 * @returns Array of column definitions compatible with @tanstack/react-table
 *
 * Each column definition includes:
 * - id or accessorKey: Unique identifier or data field accessor
 * - header: Function/ReactNode to render the header cell
 * - cell: Function to render each body cell
 * - enableSorting: Whether this column supports sorting
 * - enableHiding: Whether this column can be hidden via column visibility
 *
 * This pattern follows the shadcn/ui documentation structure where:
 * 1. We separate column definitions from the table component
 * 2. We pass action handlers as parameters for flexibility
 * 3. We use TanStack Table's built-in features for sorting, filtering, etc.
 */

type ActionHandlers = {
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onUpdate: (project: Project) => void;
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
  // PROJECT NAME COLUMN
  // Main column showing project details
  // Includes sortable header with shadcn/ui Button component
  // ========================================
  {
    accessorKey: "projectName",
    /**
     * Header with sort button
     * Following shadcn/ui pattern: use Button with ghost variant
     * Click toggles between ascending, descending, and no sort
     * column.getIsSorted() returns 'asc', 'desc', or false
     */
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
    /**
     * Cell rendering
     * row.original gives access to the full data object
     * We show project name as main text and requests as subtext
     */
    cell: ({ row }) => (
      <div className="text-right">
        <div className="font-semibold text-gray-900">
          {row.original.projectName}
        </div>
        <div className="text-sm text-gray-500">{row.original.requests}</div>
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
  // TOTAL COLUMN (الاجمالي)
  // Shows total count with center alignment
  // ========================================
  {
    accessorKey: "total",
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
    cell: ({ row }) => <div className="text-center">{row.original.total}</div>,
  },

  // ========================================
  // RECEIVED COLUMN (تم تسليم)
  // Shows delivered/received count
  // ========================================
  {
    accessorKey: "received",
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
      <div className="text-center">{row.original.received}</div>
    ),
  },

  // ========================================
  // REMAINING COLUMN (المتبقي)
  // Shows remaining count
  // ========================================
  {
    accessorKey: "remaining",
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
      <div className="text-center">{row.original.remaining}</div>
    ),
  },

  // ========================================
  // CONTRIBUTIONS COLUMN (المساهمات)
  // Shows number of contributions
  // ========================================
  {
    accessorKey: "contributions",
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
      <div className="text-center">{row.original.contributions}</div>
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
    header: () => <div className="text-center font-semibold">تحديث</div>,
    cell: ({ row }) => {
      const project = row.original;

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
    header: () => <div className="text-center font-semibold">حذف</div>,
    cell: ({ row }) => {
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
