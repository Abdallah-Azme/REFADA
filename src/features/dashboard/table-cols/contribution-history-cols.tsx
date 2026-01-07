import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import {
  ContributionHistoryItem,
  ContributorFamily,
} from "@/features/contributors/api/contributors.api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ActionHandlers = {
  onView: (item: ContributionHistoryItem) => void;
};

export const createContributionHistoryColumns = (
  handlers: ActionHandlers,
  t: any
): ColumnDef<ContributionHistoryItem>[] => [
  {
    accessorKey: "project.name",
    header: t("project"),
    cell: ({ row }) => (
      <div className="text-right">
        <div className="font-bold text-gray-900">
          {row.original.project.name}
        </div>
        <div className="text-xs text-gray-500">
          {row.original.project.type === "product"
            ? t("type_product")
            : row.original.project.type === "internal"
            ? t("type_internal")
            : row.original.project.type}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "totalQuantity",
    header: t("quantity"),
    cell: ({ row }) => (
      <div className="text-start text-gray-600 font-semibold">
        {row.original.totalQuantity}
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
        statusText = t("pending");
        colorClass = "bg-yellow-100 text-yellow-700";
      } else if (status === "approved") {
        statusText = t("approved");
        colorClass = "bg-green-100 text-green-700";
      } else if (status === "rejected") {
        statusText = t("rejected");
        colorClass = "bg-red-100 text-red-700";
      } else if (status === "completed") {
        statusText = t("completed");
        colorClass = "bg-blue-100 text-blue-700";
      }

      return (
        <div className="flex justify-start">
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
    accessorKey: "contributorFamilies",
    header: t("beneficiary_families"),
    cell: ({ row }) => {
      const families = row.original.contributorFamilies;
      if (!families || families.length === 0) {
        return <div className="text-start text-gray-400">-</div>;
      }

      const displayCount = Math.min(families.length, 2);
      const remaining = families.length - displayCount;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-start cursor-pointer">
                <div className="text-gray-600">
                  {families.slice(0, displayCount).map((f, i) => (
                    <span key={f.id}>
                      {f.familyName}
                      {i < displayCount - 1 ? "، " : ""}
                    </span>
                  ))}
                  {remaining > 0 && (
                    <span className="text-primary font-medium">
                      {" "}
                      +{remaining} {t("others")}
                    </span>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <div className="text-right space-y-1">
                {families.map((f) => (
                  <div key={f.id} className="text-sm">
                    <span className="font-medium">{f.familyName}</span>
                    <span className="text-gray-400 text-xs mr-2">
                      ({f.totalMembers} {t("members")})
                    </span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "notes",
    header: t("notes"),
    cell: ({ row }) => (
      <div className="text-start text-gray-500 text-sm max-w-[150px] truncate">
        {row.original.notes || "-"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: t("date"),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="text-start text-gray-600 text-sm">
          {date.toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "view",
    header: t("view"),
    cell: ({ row }) => (
      <div className="flex justify-start">
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
];
