import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, MapPin } from "lucide-react";
import { Camp } from "../types/camp.schema";
import { campService } from "../services/camp.service";
import { CampTableColumn } from "../types/camp-table.types";

export const createAdminCampColumns = ({
  onEdit,
  onDelete,
  onToggleStatus,
}: CampTableColumn): ColumnDef<Camp>[] => [
  {
    accessorKey: "name",
    header: "اسم المخيم",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "location",
    header: "الموقع",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-4 w-4 text-gray-500" />
        {row.getValue("location")}
      </div>
    ),
  },
  {
    accessorKey: "capacity",
    header: "السعة",
  },
  {
    accessorKey: "currentOccupancy",
    header: "الإشغال",
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
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as "active" | "inactive";
      return (
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className="cursor-pointer hover:opacity-80"
          onClick={() => onToggleStatus(row.original.id)}
        >
          {campService.getStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const camp = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(camp)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(camp.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
