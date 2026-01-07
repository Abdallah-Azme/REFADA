"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef, // Ensure ColumnDef is imported
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import { Input } from "@/components/ui/input";
import { createAdminCampColumns } from "./camp-table-columns";
import { Camp } from "../types/camp.schema";
import { CampTableColumn } from "../types/camp-table.types";
import PaginationControls from "@/src/features/dashboard/components/pagination-controls";
import { useTranslations } from "next-intl";

interface CampsTableProps {
  data: Camp[];
  customColumns?: ColumnDef<Camp>[];
  onEdit?: (camp: Camp) => void;
  onDelete?: (slug: string) => void;
  onToggleStatus?: (slug: string) => void;
  onView?: (camp: Camp) => void;
}

export function CampsTable({
  data,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
  customColumns,
}: CampsTableProps) {
  const t = useTranslations("camps");
  const tCommon = useTranslations("common");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns =
    customColumns ||
    createAdminCampColumns(
      {
        onEdit: onEdit || (() => {}),
        onDelete: onDelete || (() => {}),
        onToggleStatus: onToggleStatus || (() => {}),
        onView: onView || (() => {}),
      },
      (key) => key
    );

  const table = useReactTable<Camp>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center py-4">
        <Input
          placeholder={t("columns.name") + "..."}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  {tCommon("no_results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center px-2">
        <PaginationControls table={table} />
      </div>
    </div>
  );
}
