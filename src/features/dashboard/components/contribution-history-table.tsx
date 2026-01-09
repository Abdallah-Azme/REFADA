"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/shared/ui/table";
import {
  ContributionHistoryItem,
  ContributorFamily,
} from "../types/history.types";
import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";
import { Button } from "@/src/shared/ui/button";
import { ContributionFamiliesDialog } from "./contribution-families-dialog";
import PaginationControls from "@/features/dashboard/components/pagination-controls";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ContributionHistoryTableProps {
  data: ContributionHistoryItem[];
}

export function ContributionHistoryTable({
  data,
}: ContributionHistoryTableProps) {
  const t = useTranslations("contributor_history");
  const [selectedFamilies, setSelectedFamilies] = useState<ContributorFamily[]>(
    []
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewFamilies = (families: ContributorFamily[]) => {
    setSelectedFamilies(families);
    setDialogOpen(true);
  };

  const columns: ColumnDef<ContributionHistoryItem>[] = [
    {
      accessorKey: "project.name",
      header: t("project_name"),
    },
    {
      accessorKey: "project.type",
      header: t("project_type"),
    },
    {
      accessorKey: "totalQuantity",
      header: t("total_quantity"),
    },
    {
      accessorKey: "confirmed_quantity",
      header: t("confirmed_quantity"),
      cell: ({ row }) => row.original.confirmed_quantity || "-",
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === "approved"
                ? "default"
                : status === "pending"
                ? "secondary"
                : "destructive"
            }
          >
            {t(`status_${status}`)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: t("date"),
      cell: ({ row }) => format(new Date(row.original.createdAt), "yyyy-MM-dd"),
    },
    {
      id: "actions",
      header: t("content"),
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewFamilies(row.original.contributorFamilies)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-right">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-right">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("no_results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center">
        <PaginationControls table={table} />
      </div>

      <ContributionFamiliesDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        families={selectedFamilies}
      />
    </div>
  );
}
