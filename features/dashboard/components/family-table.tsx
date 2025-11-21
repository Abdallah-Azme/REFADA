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
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import {
  createFamilyColumns,
  dummyData,
  Family,
} from "../table-cols/family-cols";
import PaginationControls from "./pagination-controls";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FamilyFilteringForm from "./family-filtering-form";
import FamilyButtonsActions from "./family-buttons-actions";

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

const formSchema = z.object({
  familyName: z.string().optional(),
  status: z.string().optional(),
  caseStatus: z.string().optional(),
});

export default function FamilyTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0, // Current page (0-indexed)
    pageSize: 10, // Rows per page
  });

  const [data] = React.useState<Family[]>(dummyData);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      familyName: "",
      status: "",
      caseStatus: "",
    },
  });

  const handleEdit = (project: Family): void => {
    console.log("Edit:", project);
    alert(`تعديل: ${project.id}`);
  };

  const handleDelete = (project: Family): void => {
    console.log("Delete:", project);
    if (confirm(`هل تريد حذف ${project.id}؟`)) {
      alert("تم الحذف");
    }
  };

  const handleUpdate = (project: Family): void => {
    console.log("Approve:", project);
    alert(`تمت الموافقة على: ${project.id}`);
  };

  const table = useReactTable<Family>({
    data,

    columns: createFamilyColumns({
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
    <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-100">
      {/* Header with Filtering Form and Action Buttons */}
      <div className="flex items-center justify-between p-2">
        {/* Filtering Form */}
        <div className="flex flex-col gap-2">
          <FamilyFilteringForm form={form} />
        </div>
        {/* Action Buttons */}
        <FamilyButtonsActions form={form} />
      </div>

      {/* Table */}
      <div className="w-full overflow-auto py-6 px-1">
        <div className="space-y-4">
          <div className="rounded-md border border-gray-200 bg-white">
            <Table className="">
              <TableHeader>
                {/* getHeaderGroups() returns header row groups */}
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="mx-4">
                    {/* Loop through each header cell */}
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {/* Don't render anything for placeholder headers */}
                          {header.isPlaceholder
                            ? null
                            : /* flexRender renders the header from column def */
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody className="">
                {/* Check if we have rows to display */}
                {table.getRowModel().rows?.length ? (
                  /* getRowModel().rows gives us the rows after pagination/filtering */
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      /* Add selected state for styling */
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {/* Loop through each cell in the row */}
                      {row.getVisibleCells().map((cell) => (
                        <TableCell className=" " key={cell.id}>
                          {/* flexRender renders the cell from column def */}
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  /* Show "no results" message if no rows */
                  <TableRow>
                    <TableCell
                      colSpan={
                        createFamilyColumns({
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

          <div className="flex items-center justify-center px-2">
            <PaginationControls table={table} />
          </div>
        </div>
      </div>
    </div>
  );
}
