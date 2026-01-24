"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DeletedFamily } from "../types/family.schema";
import { useTranslations } from "next-intl";
import { Button } from "@/src/shared/ui/button";
import { Trash2, RefreshCcw } from "lucide-react";

const sanitizeValue = (value: unknown): string => {
  if (value === null || value === undefined || value === "undefined") {
    return "";
  }
  return String(value);
};

export const createDeletedFamilyColumns = (
  t: (key: string) => string,
  onDelete: (family: DeletedFamily) => void,
  onRestore: (family: DeletedFamily) => void,
): ColumnDef<DeletedFamily>[] => [
  {
    accessorKey: "familyName",
    header: t("columns.familyName"),
    cell: ({ row }) => sanitizeValue(row.getValue("familyName")),
  },
  {
    accessorKey: "nationalId",
    header: t("columns.nationalId"),
    cell: ({ row }) => sanitizeValue(row.getValue("nationalId")),
  },
  {
    accessorKey: "camp",
    header: t("columns.camp"),
    cell: ({ row }) => sanitizeValue(row.getValue("camp")),
  },
  {
    accessorKey: "deletedBy",
    header: t("columns.deletedBy"),
    cell: ({ row }) => sanitizeValue(row.getValue("deletedBy")),
  },
  {
    accessorKey: "deleteReason",
    header: t("columns.deleteReason"),
    cell: ({ row }) => sanitizeValue(row.getValue("deleteReason")),
  },
  {
    accessorKey: "deletedAt",
    header: t("columns.deletedAt"),
    cell: ({ row }) => {
      const date = row.getValue("deletedAt") as string;
      if (!date) return "";
      return new Date(date).toLocaleString("ar-EG"); // Should probably respect locale
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRestore(row.original)}
          title={t("restore.button") || "استعادة"}
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(row.original)}
          title={t("force_delete.button")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
