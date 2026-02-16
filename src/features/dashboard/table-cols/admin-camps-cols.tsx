import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, MapPin } from "lucide-react";
import { Camp } from "@/features/camps/types/camp.schema";

interface AdminCampColumnsProps {
  onEdit: (camp: Camp) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const createAdminCampColumns = (
  { onEdit, onDelete, onToggleStatus }: AdminCampColumnsProps,
  t: (key: string) => string,
): ColumnDef<Camp>[] => [
  {
    accessorKey: "name",
    header: t("columns.name"),
    cell: ({ row }) => {
      const name = row.original.name;
      // Handle name if it's an object (based on schema) or string
      const displayName =
        typeof name === "string" ? name : name?.ar || name?.en || "";
      return <div className="font-medium">{displayName}</div>;
    },
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
    accessorKey: "delegates",
    header: t("columns.delegate"),
    cell: ({ row }) => {
      const delegates = row.original.delegates;
      let names = "";
      if (Array.isArray(delegates)) {
        names = delegates
          .map((d) => (typeof d === "string" ? d : d.name))
          .join(", ");
      } else if (typeof delegates === "string") {
        names = delegates;
      }
      return <div>{names || "-"}</div>;
    },
  },
  {
    header: t("columns.families_count"),
    accessorFn: (row) => row.statistics?.familyCount || 0,
    cell: ({ row }) => {
      const count = row.original.statistics?.familyCount || 0;
      return <div>{count}</div>;
    },
  },
  {
    accessorKey: "status",
    header: t("columns.status"),
    cell: ({ row }) => {
      const status = row.original.status || "active"; // Default/fallback
      return (
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className="cursor-pointer hover:opacity-80"
          onClick={() => onToggleStatus(row.original.id.toString())}
        >
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
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(camp)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(camp.id.toString())}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
