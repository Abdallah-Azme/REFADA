"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AdminPosition } from "../types/admin-position.schema";
import { Button } from "@/shared/ui/button";
import { Edit, Trash2 } from "lucide-react";

export const createAdminPositionColumns = (
  onEdit: (position: AdminPosition) => void,
  onDelete: (id: number) => void
): ColumnDef<AdminPosition>[] => [
  {
    accessorKey: "id",
    header: "الرقم",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: "الاسم",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    id: "actions",
    header: "الإجراءات",
    cell: ({ row }) => {
      const position = row.original;

      return (
        <div className="flex items-center gap-2 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(position)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(position.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
