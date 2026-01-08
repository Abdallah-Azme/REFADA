"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Activity } from "../types/activity.schema";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/shared/ui/button";
import { ArrowUpDown } from "lucide-react";

export const createActivityColumns = (
  t: (key: string) => string
): ColumnDef<Activity>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("id")} <ArrowUpDown className="ms-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("column_description")} <ArrowUpDown className="ms-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[500px]">
          <p className="text-sm">{row.getValue("description")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "subject_type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("type")} <ArrowUpDown className="ms-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("subject_type") as string;
      const typeName = type.split("\\").pop() || type;

      const typeColors: Record<string, string> = {
        Camp: "bg-blue-100 text-blue-800",
        Project: "bg-green-100 text-green-800",
        User: "bg-purple-100 text-purple-800",
        Family: "bg-orange-100 text-orange-800",
      };

      const typeLabels: Record<string, string> = {
        Camp: t("type_camp"),
        Project: t("type_project"),
        User: t("type_user"),
        Family: t("type_family"),
      };

      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            typeColors[typeName] || "bg-gray-100 text-gray-800"
          }`}
        >
          {typeLabels[typeName] || typeName}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("date")} <ArrowUpDown className="ms-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return (
        <div className="text-sm text-gray-600">
          {format(date, "PPp", { locale: ar })}
        </div>
      );
    },
  },
];
