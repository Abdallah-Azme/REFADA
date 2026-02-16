import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Trash2 } from "lucide-react";
import {
  AdminContribution,
  ContributorFamily,
} from "@/features/contributors/api/contributors.api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ActionHandlers = {
  onView: (item: AdminContribution) => void;
  onDelete: (item: AdminContribution) => void;
};

export const createAdminContributionColumns = (
  handlers: ActionHandlers,
  t: (key: string) => string,
): ColumnDef<AdminContribution>[] => [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => (
      <div className="text-center font-medium text-gray-500">
        {row.original.id}
      </div>
    ),
  },
  {
    accessorKey: "project.name",
    header: t("project"),
    cell: ({ row }) => (
      <div className="text-right">
        {row.original.project ? (
          <>
            <div className="font-bold text-gray-900">
              {row.original.project.name}
            </div>
            <div className="text-xs text-gray-500">
              {row.original.project.type}
            </div>
          </>
        ) : (
          <span className="text-gray-400">{t("no_project")}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "totalQuantity",
    header: t("quantity"),
    cell: ({ row }) => (
      <div className="text-center text-gray-600 font-semibold">
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
        statusText = t("status_pending");
        colorClass = "bg-yellow-100 text-yellow-700";
      } else if (status === "approved") {
        statusText = t("status_approved");
        colorClass = "bg-green-100 text-green-700";
      } else if (status === "rejected") {
        statusText = t("status_rejected");
        colorClass = "bg-red-100 text-red-700";
      } else if (status === "completed") {
        statusText = t("status_completed");
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
    accessorKey: "contributorFamilies",
    header: t("families_benefited"),
    cell: ({ row }) => {
      const families = row.original.contributorFamilies;
      if (!families || families.length === 0) {
        return <div className="text-center text-gray-400">-</div>;
      }

      const displayCount = Math.min(families.length, 2);
      const remaining = families.length - displayCount;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center cursor-pointer">
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
      <div className="text-center text-gray-500 text-sm max-w-[150px] truncate">
        {row.original.notes || "-"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: t("contribution_date"),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="text-center text-gray-600 text-sm">
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
      <div className="flex justify-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={() => handlers.onView(row.original)}
        >
          <Eye className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => handlers.onDelete(row.original)}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    ),
  },
];
