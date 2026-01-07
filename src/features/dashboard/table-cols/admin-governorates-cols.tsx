import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { Governorate } from "../types/governorates.schema";

type ActionHandlers = {
  onEdit: (governorate: Governorate) => void;
  onDelete: (governorate: Governorate) => void;
};

export const createGovernorateColumns = (
  handlers: ActionHandlers,
  t: (key: string) => string
): ColumnDef<Governorate>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          #
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-center">{row.original.id}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("name")}
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("created_at")}
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        {new Date(row.original.created_at).toLocaleDateString("ar-EG")}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-semibold">{t("actions")}</div>
    ),
    cell: ({ row }) => {
      const governorate = row.original;
      return (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
            onClick={() => handlers.onEdit(governorate)}
            title={t("actions_edit")}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700"
            onClick={() => handlers.onDelete(governorate)}
            title={t("actions_delete")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
