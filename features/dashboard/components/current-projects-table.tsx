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
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import { createColumns, dummyData } from "../table-cols/current-projects-cols";
import PaginationControls from "./pagination-controls";
import ContributionTable from "./contribution-table";

export type Project = {
  id: number;
  projectName: string;
  status: string;
  total: number;
  received: number;
  remaining: number;
  contributions: number;
  requests: string;
};

export default function CurrentProjectsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [data] = React.useState<Project[]>(dummyData);

  const handleEdit = (project: Project): void => {
    console.log("Edit:", project);
    alert(`تعديل: ${project.projectName}`);
  };

  const handleDelete = (project: Project): void => {
    console.log("Delete:", project);
    if (confirm(`هل تريد حذف ${project.projectName}؟`)) {
      alert("تم الحذف");
    }
  };

  const handleUpdate = (project: Project): void => {
    console.log("Approve:", project);
    alert(`تمت الموافقة على: ${project.projectName}`);
  };

  const table = useReactTable<Project>({
    data,
    columns: createColumns({
      onEdit: handleEdit,
      onDelete: handleDelete,
      onUpdate: handleUpdate,
    }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[960px]">
          <TableHeader>
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
                  data-state={row.getIsSelected() && "selected"}
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
                  colSpan={
                    createColumns({
                      onEdit: handleEdit,
                      onDelete: handleDelete,
                      onUpdate: handleUpdate,
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

      {/* Pagination - separate from table */}
      <div className="flex items-center justify-center px-2 py-4">
        <PaginationControls table={table} />
      </div>
    </div>
  );
}
