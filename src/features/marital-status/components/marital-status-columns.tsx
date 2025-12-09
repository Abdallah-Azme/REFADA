"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MaritalStatus } from "../types/marital-status.schema";
import { Button } from "@/shared/ui/button";
import { Edit, Trash2 } from "lucide-react";

export const createMaritalStatusColumns = (
  onEdit: (status: MaritalStatus) => void,
  onDelete: (id: number) => void
): ColumnDef<MaritalStatus>[] => [
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
      const status = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(status)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(status.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
