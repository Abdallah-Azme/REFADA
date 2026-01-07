import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, MapPin, Eye } from "lucide-react";
import { Camp } from "../types/camp.schema";
import { campService } from "../services/camp.service";
import { CampTableColumn } from "../types/camp-table.types";

export const createAdminCampColumns = (
  { onEdit, onDelete, onToggleStatus, onView }: CampTableColumn,
  t: (key: string) => string
): ColumnDef<Camp>[] => [
  {
    accessorKey: "name",
    header: t("columns.name"),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
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
    accessorKey: "capacity",
    header: t("columns.capacity"),
  },
  {
    accessorKey: "currentOccupancy",
    header: t("columns.occupancy"),
    cell: ({ row }) => {
      const camp = row.original;
      const percentage = campService.calculateOccupancyRate(camp);
      return (
        <div>
          {camp.currentOccupancy}{" "}
          <span className="text-xs text-gray-500">({percentage}%)</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: t("columns.status"),
    cell: ({ row }) => {
      const status = row.getValue("status") as "active" | "inactive";
      const camp = row.original;
      return (
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className="cursor-pointer hover:opacity-80"
          onClick={() => camp.slug && onToggleStatus(camp.slug)}
        >
          {/* Attempt to translate status if possible, otherwise use service label */}
          {status ? t(`status.${status}`) : t("status.inactive")}
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
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(camp)}
            title="عرض التفاصيل" // Translation needed for title? "View Details"
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
