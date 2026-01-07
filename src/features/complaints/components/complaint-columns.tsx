"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Complaint } from "../types/complaint.schema";
import { Button } from "@/shared/ui/button";
import { Eye, Trash2 } from "lucide-react";

export const createComplaintColumns = (
  onView: (complaint: Complaint) => void,
  onDelete: (id: number) => void,
  t: (key: string) => string
): ColumnDef<Complaint>[] => [
  {
    accessorKey: "id",
    header: t("columns.id"),
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: t("columns.name"),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: t("columns.email"),
    cell: ({ row }) => <div className="text-sm">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: t("columns.phone"),
    cell: ({ row }) => <div className="text-sm">{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "campName",
    header: t("columns.camp"),
    cell: ({ row }) => <div>{row.getValue("campName")}</div>,
  },
  {
    accessorKey: "topic",
    header: t("columns.topic"),
    cell: ({ row }) => (
      <div className="max-w-xs truncate">{row.getValue("topic")}</div>
    ),
  },
  {
    id: "actions",
    header: t("columns.actions"),
    cell: ({ row }) => {
      const complaint = row.original;

      return (
        <div className="flex items-center gap-2 justify-center">
          <Button variant="outline" size="sm" onClick={() => onView(complaint)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(complaint.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
