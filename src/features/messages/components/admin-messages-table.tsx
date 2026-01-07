"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import {
  ColumnDef,
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
import { createAdminMessageColumns } from "./message-table-columns";
import { ContactMessage } from "../types/message.schema";
import PaginationControls from "@/src/features/dashboard/components/pagination-controls";
import { Input } from "@/shared/ui/input";
import { useTranslations } from "next-intl";

interface AdminMessagesTableProps {
  data: ContactMessage[];
  onView: (message: ContactMessage) => void;
  onDelete: (id: number) => void;
  customColumns?: ColumnDef<ContactMessage>[];
}

export default function AdminMessagesTable({
  data,
  onView,
  onDelete,
  customColumns,
}: AdminMessagesTableProps) {
  const t = useTranslations("messages_page");
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

  // Use custom columns if provided, otherwise create default ones (though default ones might miss translations if we don't pass t here, but creating them here is complex if we depend on parent t)
  // Actually, better to specificy that we use the customColumns primarily.
  // We can pass a dummy t if we fallback, or just rely on customColumns being passed from Page.
  const columns =
    customColumns ||
    createAdminMessageColumns({ onView, onDelete }, (key) => key);

  const table = useReactTable<ContactMessage>({
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
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder={t("columns.name") + "..."}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder={t("columns.email") + "..."}
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
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
                <TableRow
                  key={row.id}
                  className={
                    row.original.status === "new" ? "bg-blue-50/50" : ""
                  }
                >
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
