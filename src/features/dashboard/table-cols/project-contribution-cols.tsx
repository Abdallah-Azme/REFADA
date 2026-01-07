import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Progress } from "@/components/ui/progress";
import { Eye, Heart } from "lucide-react";

// ============================================================================
// Project type matching API response
// ============================================================================

export type Project = {
  id: number;
  name: string;
  type: string;
  addedBy: string;
  beneficiaryCount: number;
  college: string;
  status: string;
  isApproved: boolean;
  notes: string | null;
  projectImage: string | null;
  totalReceived: number;
  totalRemaining: number;
  createdAt: string;
  updatedAt: string;
};

// Legacy type for backwards compatibility with old code if needed
export type LegacyProject = {
  id: number;
  projectName: string;
  camp: string;
  indicator: number;
  total: number;
  received: number;
  remaining: number;
  beneficiaryFamilies: number;
  requests: string;
};

export const dummyData: LegacyProject[] = [];

type ActionHandlers = {
  onView: (project: Project) => void;
  onContribute: (project: Project) => void;
};

export const createColumnsForContributor = (
  handlers: ActionHandlers
): ColumnDef<Project>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-start mx-4">
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
        className="mx-4"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="تحديد الصف"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "المشروع",
    cell: ({ row }) => (
      <div className="text-right">
        <div className="font-bold text-gray-900">{row.original.name}</div>
        <div className="text-xs text-gray-500">
          {row.original.type === "product"
            ? "منتج"
            : row.original.type === "internal"
            ? "داخلي"
            : row.original.type}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "addedBy",
    header: "أضيف بواسطة",
    cell: ({ row }) => (
      <div className="text-start text-gray-600">{row.original.addedBy}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.original.status;
      let statusText = status;
      let colorClass = "bg-gray-100 text-gray-700";

      if (status === "pending") {
        statusText = "قيد الانتظار";
        colorClass = "bg-yellow-100 text-yellow-700";
      } else if (status === "approved" || row.original.isApproved) {
        statusText = "موافق عليه";
        colorClass = "bg-green-100 text-green-700";
      } else if (status === "rejected") {
        statusText = "مرفوض";
        colorClass = "bg-red-100 text-red-700";
      } else if (status === "completed") {
        statusText = "مكتمل";
        colorClass = "bg-blue-100 text-blue-700";
      }

      return (
        <div className="flex justify-center">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
          >
            {statusText}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "indicator",
    header: "المؤشر",
    cell: ({ row }) => {
      const total = row.original.beneficiaryCount || 1;
      const received = row.original.totalReceived || 0;
      const value = Math.round((received / total) * 100);

      let colorClass = "bg-primary";
      if (value < 30) colorClass = "bg-orange-500";
      else if (value < 60) colorClass = "bg-yellow-500";
      else if (value < 80) colorClass = "bg-green-500";
      else colorClass = "bg-green-600";

      return (
        <div className="w-24">
          <Progress value={value} className="h-2" indicatorColor={colorClass} />
          <div className="text-xs text-center text-gray-500 mt-1">{value}%</div>
        </div>
      );
    },
  },
  {
    accessorKey: "beneficiaryCount",
    header: "المستفيدين",
    cell: ({ row }) => (
      <div className="text-start text-gray-600">
        {row.original.beneficiaryCount}
      </div>
    ),
  },
  {
    accessorKey: "totalReceived",
    header: "تم استلام",
    cell: ({ row }) => (
      <div className="text-start text-gray-600">
        {row.original.totalReceived}
      </div>
    ),
  },
  {
    accessorKey: "totalRemaining",
    header: "المتبقي",
    cell: ({ row }) => (
      <div className="text-start text-gray-600">
        {row.original.totalRemaining}
      </div>
    ),
  },
  {
    id: "view",
    header: "عرض",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={() => handlers.onView(row.original)}
        >
          <Eye className="w-5 h-5" />
        </Button>
      </div>
    ),
  },
  {
    id: "contribute",
    header: "مساهمة",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button
          className="bg-[#1B2540] hover:bg-[#2c3b60] text-white rounded-full px-4 py-1 h-8 text-xs flex items-center gap-2"
          onClick={() => handlers.onContribute(row.original)}
        >
          <Heart className="w-3 h-3" />
          ساهم الان
        </Button>
      </div>
    ),
  },
];
