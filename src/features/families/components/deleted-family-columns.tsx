"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DeletedFamily } from "../types/family.schema";
import { useTranslations } from "next-intl";
import { Button } from "@/src/shared/ui/button";
import { Trash2 } from "lucide-react";

const sanitizeValue = (value: unknown): string => {
  if (value === null || value === undefined || value === "undefined") {
    return "";
  }
  return String(value);
};

export const createDeletedFamilyColumns = (
  t: (key: string) => string,
  onDelete: (family: DeletedFamily) => void,
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
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDelete(row.original)}
        title={t("force_delete.button")}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    ),
  },
];
