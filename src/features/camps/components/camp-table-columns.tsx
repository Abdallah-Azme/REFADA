import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, MapPin, Eye } from "lucide-react";
import { Camp } from "../types/camp.schema";
import { campService } from "../services/camp.service";
import { CampTableColumn } from "../types/camp-table.types";

// Helper to get name as string from either string or object format
const getCampName = (
  name: string | { ar?: string; en?: string } | undefined,
): string => {
  if (!name) return "";
  if (typeof name === "string") return name;
  return name.ar || name.en || "";
};

export const createAdminCampColumns = (
  { onEdit, onDelete, onToggleStatus, onView }: CampTableColumn,
  t: (key: string) => string,
): ColumnDef<Camp>[] => [
  {
    id: "name",
    accessorFn: (row) => getCampName(row.name),
    header: t("columns.name"),
    cell: ({ getValue }) => (
      <div className="font-medium">{getValue() as string}</div>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "location",
    header: t("columns.location"),
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-4 w-4 text-gray-500" />
        {row.getValue("location")}
      </div>
    ),
  },
  {
    accessorKey: "delegate",
    header: t("columns.delegate"),
    cell: ({ row }) => {
      const delegate = row.getValue("delegate") as string | null;
      return (
        <div className={delegate ? "font-medium" : "text-gray-400 italic"}>
          {delegate || t("no_delegate")}
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: t("columns.status"),
    cell: ({ row }) => {
      const status =
        (row.getValue("status") as "active" | "inactive") || "active";
      const camp = row.original;
      return (
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className="cursor-pointer hover:opacity-80"
          onClick={() => camp.slug && onToggleStatus(camp.slug)}
        >
          {/* Attempt to translate status if possible, otherwise use service label */}
          {t(`status.${status}`)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: t("columns.actions"),
    cell: ({ row }) => {
      const camp = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(camp)}
            title={t("view_details")}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(camp)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => camp.slug && onDelete(camp.slug)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
