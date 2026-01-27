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
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import { createAdminCampColumns } from "./camp-table-columns";
import { Camp } from "../types/camp.schema";
import { CampTableColumn } from "../types/camp-table.types";
import { useTranslations } from "next-intl";

interface ServerPaginationProps {
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

interface CampsTableProps {
  data: Camp[];
  customColumns?: ColumnDef<Camp>[];
  onEdit?: (camp: Camp) => void;
  onDelete?: (slug: string) => void;
  onToggleStatus?: (slug: string) => void;
  onView?: (camp: Camp) => void;
  pagination?: ServerPaginationProps;
  isLoading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function CampsTable({
  data,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
  customColumns,
  pagination,
  isLoading,
  searchValue,
  onSearchChange,
}: CampsTableProps) {
  const t = useTranslations("camps");
  const tCommon = useTranslations("common");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns =
    customColumns ||
    createAdminCampColumns(
      {
        onEdit: onEdit || (() => {}),
        onDelete: onDelete || (() => {}),
        onToggleStatus: onToggleStatus || (() => {}),
        onView: onView || (() => {}),
      },
      (key) => key,
    );

  const table = useReactTable<Camp>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: !!pagination,
    pageCount: pagination?.lastPage ?? -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const canPreviousPage = pagination ? pagination.page > 1 : false;
  const canNextPage = pagination
    ? pagination.page < pagination.lastPage
    : false;

  return (
    <div className="space-y-4">
      <div className="flex items-center py-4">
        <Input
          placeholder={t("columns.name") + "..."}
          value={searchValue ?? ""}
          onChange={(event) => onSearchChange?.(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border bg-white relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
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
                            header.getContext(),
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
                        cell.getContext(),
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

      {/* Server-side Pagination Controls */}
      {pagination && (
        <div className="flex flex-col sm:flex-row w-full sm:w-fit gap-3 items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm mx-auto">
          {/* Rows per page */}
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-600 font-medium">الصفوف لكل صفحة</p>
            <Select
              value={String(pagination.perPage)}
              onValueChange={(value) =>
                pagination.onPerPageChange(Number(value))
              }
            >
              <SelectTrigger className="h-9 w-[80px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page indicator */}
          <div className="text-sm font-medium text-gray-700">
            صفحة {pagination.page} من {pagination.lastPage} ({pagination.total}{" "}
            إجمالي)
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* First */}
            <Button
              variant="outline"
              size="icon"
              className="hidden lg:flex h-9 w-9"
              onClick={() => pagination.onPageChange(1)}
              disabled={!canPreviousPage}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>

            {/* Prev */}
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={!canPreviousPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Next */}
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={!canNextPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Last */}
            <Button
              variant="outline"
              size="icon"
              className="hidden lg:flex h-9 w-9"
              onClick={() => pagination.onPageChange(pagination.lastPage)}
              disabled={!canNextPage}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
