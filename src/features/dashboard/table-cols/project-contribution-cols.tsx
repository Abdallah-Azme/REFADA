import { Button } from "@/components/ui/button";

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
  DelegatePhone?: string;
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
  handlers: ActionHandlers,
  t: any
): ColumnDef<Project>[] => [
  {
    accessorKey: "name",
    header: t("project"),
    cell: ({ row }) => (
      <div className="">
        <div className="font-bold text-gray-900">{row.original.name}</div>
        <div className="text-xs text-gray-500">
          {row.original.type === "product"
            ? t("type_product")
            : row.original.type === "internal"
            ? t("type_internal")
            : row.original.type}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "addedBy",
    header: t("added_by"),
    cell: ({ row }) => (
      <div className="text-start text-gray-600">{row.original.addedBy}</div>
    ),
  },
  {
    accessorKey: "DelegatePhone",
    header: t("mobile"),
    cell: ({ row }) => (
      <div className="text-start text-gray-600">
        {row.original.DelegatePhone || "-"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: t("status"),
    cell: ({ row }) => {
      const status = row.original.status;
      let statusText = status;
      let colorClass = "bg-gray-100 text-gray-700";

      if (status === "pending") {
        statusText = "قيد التنفيذ"; // In Progress/Under Execution
        colorClass = "bg-yellow-100 text-yellow-700";
      } else if (status === "approved" || row.original.isApproved) {
        statusText = t("approved");
        colorClass = "bg-green-100 text-green-700";
      } else if (status === "rejected") {
        statusText = t("rejected");
        colorClass = "bg-red-100 text-red-700";
      } else if (status === "completed") {
        statusText = t("completed");
        colorClass = "bg-blue-100 text-blue-700";
      } else if (status === "delivered") {
        statusText = t("delivered");
        colorClass = "bg-purple-100 text-purple-700";
      }

      return (
        <div className="flex ">
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
    header: t("indicator"),
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
    header: t("beneficiaries"),
    cell: ({ row }) => (
      <div className="text-start text-gray-600">
        {row.original.beneficiaryCount}
      </div>
    ),
  },
  {
    accessorKey: "totalReceived",
    header: t("received"),
    cell: ({ row }) => (
      <div className="text-start text-gray-600">
        {row.original.totalReceived}
      </div>
    ),
  },
  {
    accessorKey: "totalRemaining",
    header: t("remaining"),
    cell: ({ row }) => (
      <div className="text-start text-gray-600">
        {row.original.totalRemaining}
      </div>
    ),
  },
  {
    id: "view",
    header: t("view"),
    cell: ({ row }) => (
      <div className="flex">
        <Button
          variant="ghost"
          size="icon"
          className="text-green-600 hover:text-green-700 hover:bgذ-green-50"
          onClick={() => handlers.onView(row.original)}
        >
          <Eye className="w-5 h-5" />
        </Button>
      </div>
    ),
  },
  {
    id: "contribute",
    header: t("contribute"),
    cell: ({ row }) => (
      <div className="flex">
        <Button
          className="bg-[#1B2540] hover:bg-[#2c3b60] text-white rounded-full px-4 py-1 h-8 text-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlers.onContribute(row.original)}
          disabled={
            row.original.status === "completed" ||
            row.original.status === "delivered"
          }
        >
          <Heart className="w-3 h-3" />
          {t("contribute_now")}
        </Button>
      </div>
    ),
  },
];
