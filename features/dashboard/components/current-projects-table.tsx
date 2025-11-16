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
    pageIndex: 0, // Current page (0-indexed)
    pageSize: 10, // Rows per page
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
    <div className="w-full overflow-auto p-6 bg-gray-50">
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

        <div className="flex items-center justify-center px-2">
          <PaginationControls table={table} />
        </div>
      </div>
    </div>
  );
}
