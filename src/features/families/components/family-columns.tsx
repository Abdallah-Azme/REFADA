"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Family } from "../types/family.schema";
import { Button } from "@/src/shared/ui/button";
import { Checkbox } from "@/src/shared/ui/checkbox";
import { MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/shared/ui/dropdown-menu";

// Helper to sanitize undefined values (both JS undefined and string "undefined")
const sanitizeValue = (value: unknown): string => {
  if (value === null || value === undefined || value === "undefined") {
    return "";
  }
  return String(value);
};

// ... imports

export const createFamilyColumns = (
  onView: (family: Family) => void,
  onEdit: (family: Family) => void,
  onDelete: (family: Family) => void,
  t: (key: string) => string,
  options?: { hideDelete?: boolean }
): ColumnDef<Family>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: "ps-2",
    },
  },
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
    accessorKey: "phone",
    header: t("columns.phone"),
    cell: ({ row }) => sanitizeValue(row.getValue("phone")),
  },
  {
    accessorKey: "totalMembers",
    header: t("columns.totalMembers"),
    cell: ({ row }) => sanitizeValue(row.getValue("totalMembers")),
  },
  {
    accessorKey: "camp",
    header: t("columns.camp"),
    cell: ({ row }) => sanitizeValue(row.getValue("camp")),
  },
  {
    accessorKey: "tentNumber",
    header: t("columns.tentNumber"),
    cell: ({ row }) => sanitizeValue(row.getValue("tentNumber")),
  },
  {
    accessorKey: "location",
    header: t("columns.location"),
    cell: ({ row }) => sanitizeValue(row.getValue("location")),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const family = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t("actions_menu.open_menu")}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(family)}>
              <Eye className="mr-2 h-4 w-4" />
              {t("actions_menu.view_details")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(family)}>
              <Pencil className="mr-2 h-4 w-4" />
              {t("actions_menu.edit")}
            </DropdownMenuItem>
            {!options?.hideDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(family)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                {t("actions_menu.delete")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
