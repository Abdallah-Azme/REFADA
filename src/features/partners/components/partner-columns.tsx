"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Partner } from "../types/partner.schema";
import { Button } from "@/shared/ui/button";
import { Eye, Trash2, Edit } from "lucide-react";
import Image from "next/image";

export const createPartnerColumns = (
  onView: (partner: Partner) => void,
  onEdit: (partner: Partner) => void,
  onDelete: (id: number) => void,
  t: (key: string) => string
): ColumnDef<Partner>[] => [
  {
    accessorKey: "id",
    header: t("columns.id"),
    cell: ({ row }) => (
      <div className="font-medium text-center">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "logo",
    header: t("columns.logo"),
    cell: ({ row }) => {
      const logo = row.getValue("logo") as string;
      return (
        <div className="h-10 w-20 mx-auto relative overflow-hidden rounded border bg-white flex items-center justify-center">
          {logo ? (
            <Image
              src={logo}
              alt="Logo"
              fill
              className="object-contain p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="text-xs text-gray-400">{t("columns.no_logo")}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: t("columns.name"),
    cell: ({ row }) => (
      <div className="font-medium text-center">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "order",
    header: t("columns.order"),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("order")}</div>
    ),
  },
  {
    id: "actions",
    header: t("columns.actions"),
    cell: ({ row }) => {
      const partner = row.original;

      return (
        <div className="flex items-center gap-2 justify-center text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(partner)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(partner)}
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(partner.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
