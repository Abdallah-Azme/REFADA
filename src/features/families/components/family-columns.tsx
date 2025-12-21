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

export const createFamilyColumns = (
  onView: (family: Family) => void,
  onEdit: (family: Family) => void,
  onDelete: (family: Family) => void
): ColumnDef<Family>[] => [
  {
    accessorKey: "familyName",
    header: "اسم العائلة",
  },
  {
    accessorKey: "nationalId",
    header: "رقم الهوية",
  },
  {
    accessorKey: "phone",
    header: "رقم الهاتف",
  },
  {
    accessorKey: "totalMembers",
    header: "عدد الأفراد",
  },
  {
    accessorKey: "camp",
    header: "إيواء",
  },
  {
    accessorKey: "tentNumber",
    header: "رقم الخيمة",
  },
  {
    accessorKey: "location",
    header: "الموقع",
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
            <DropdownMenuItem
              onClick={() => onDelete(family)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
