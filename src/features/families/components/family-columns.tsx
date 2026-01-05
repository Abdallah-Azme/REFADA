"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Family } from "../types/family.schema";
import { Button } from "@/src/shared/ui/button";
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

export const createFamilyColumns = (
  onView: (family: Family) => void,
  onEdit: (family: Family) => void,
  onDelete: (family: Family) => void,
  options?: { hideDelete?: boolean }
): ColumnDef<Family>[] => [
  {
    accessorKey: "familyName",
    header: "اسم العائلة",
    cell: ({ row }) => sanitizeValue(row.getValue("familyName")),
  },
  {
    accessorKey: "nationalId",
    header: "رقم الهوية",
    cell: ({ row }) => sanitizeValue(row.getValue("nationalId")),
  },
  {
    accessorKey: "phone",
    header: "رقم الهاتف",
    cell: ({ row }) => sanitizeValue(row.getValue("phone")),
  },
  {
    accessorKey: "totalMembers",
    header: "عدد الأفراد",
    cell: ({ row }) => sanitizeValue(row.getValue("totalMembers")),
  },
  {
    accessorKey: "camp",
    header: "إيواء",
    cell: ({ row }) => sanitizeValue(row.getValue("camp")),
  },
  {
    accessorKey: "tentNumber",
    header: "رقم الخيمة",
    cell: ({ row }) => sanitizeValue(row.getValue("tentNumber")),
  },
  {
    accessorKey: "location",
    header: "الموقع",
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
              <span className="sr-only">فتح القائمة</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(family)}>
              <Eye className="mr-2 h-4 w-4" />
              عرض التفاصيل
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(family)}>
              <Pencil className="mr-2 h-4 w-4" />
              تعديل
            </DropdownMenuItem>
            {!options?.hideDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(family)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                حذف
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
