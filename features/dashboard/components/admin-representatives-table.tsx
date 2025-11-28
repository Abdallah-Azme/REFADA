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
import {
  createAdminRepresentativeColumns,
  dummyAdminRepresentatives,
  AdminRepresentative,
} from "../table-cols/admin-representatives-cols";
import PaginationControls from "./pagination-controls";

export default function AdminRepresentativesTable() {
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

  const [data, setData] = React.useState<AdminRepresentative[]>(
    dummyAdminRepresentatives
  );

  const handleToggleStatus = (rep: AdminRepresentative): void => {
    setData((prevData) =>
      prevData.map((r) =>
        r.id === rep.id
          ? { ...r, status: r.status === "active" ? "inactive" : "active" }
          : r
      )
    );
  };

  const handleDelete = (rep: AdminRepresentative): void => {
    setData((prevData) => prevData.filter((r) => r.id !== rep.id));
  };

  const handleView = (rep: AdminRepresentative): void => {
    console.log("View:", rep);
  };

  const table = useReactTable<AdminRepresentative>({
    data,
    columns: createAdminRepresentativeColumns({
      onToggleStatus: handleToggleStatus,
      onDelete: handleDelete,
      onView: handleView,
    }),
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
    <div className="rounded-lg bg-white">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[960px]">
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
                  colSpan={
                    createAdminRepresentativeColumns({
                      onToggleStatus: handleToggleStatus,
                      onDelete: handleDelete,
                      onView: handleView,
                    }).length
                  }
                  className="h-24 text-center"
                >
                  لا توجد نتائج.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center px-2 py-4">
        <PaginationControls table={table} />
      </div>
    </div>
  );
}
