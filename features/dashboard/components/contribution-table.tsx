"use client";
import { Button } from "@/components/ui/button";
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

import { RotateCcw, SearchCheck } from "lucide-react";
import AddProjectDialog from "./add-project-project";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createContributionColumns,
  dummyData,
} from "../table-cols/contribution-cols";
import PaginationControls from "./pagination-controls";

const formSchema = z.object({
  project: z.string().optional(),
  status: z.string().optional(),
  caseStatus: z.string().optional(),
});

// ========================================
// TYPE DEFINITIONS
// ========================================
type Contribution = {
  id: number;
  contributorName: string;
  category: string;
  subcategory: string;
  result: string;
  date: string;
  amount: number;
};

type ActionHandlers = {
  onEdit: (contribution: Contribution) => void;
  onDelete: (contribution: Contribution) => void;
};

// ========================================
// MAIN TABLE COMPONENT
// ========================================
export default function ContributionTable() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project: "",
      status: "",
      caseStatus: "",
    },
  });

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
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [data] = React.useState<Contribution[]>(dummyData);

  const handleEdit = (contribution: Contribution): void => {
    console.log("Edit:", contribution);
    alert(`تعديل: ${contribution.contributorName}`);
  };

  const handleDelete = (contribution: Contribution): void => {
    console.log("Delete:", contribution);
    alert("تم الحذف");
  };

  const table = useReactTable<Contribution>({
    data,
    columns: createContributionColumns({
      onEdit: handleEdit,
      onDelete: handleDelete,
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
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="space-y-4">
        {/* Header with Title and Search */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">سجل المساهمات</h1>

          <div className="p-6 border-b border-gray-100">
            {/* HEADER & BUTTONS */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                المشاريع الحالية
              </h3>
            </div>
            <div className="flex justify-between items-center gap-2">
              {/* FORM */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex items-center gap-3 self-end"
                >
                  {/* المشروع */}
                  <FormField
                    control={form.control}
                    name="project"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-[160px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700">
                              <SelectValue placeholder="المشروع" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">الكل</SelectItem>
                              <SelectItem value="1">مشروع 1</SelectItem>
                              <SelectItem value="2">مشروع 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* حالة المشروع */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-[160px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700">
                              <SelectValue placeholder="حالة المشروع" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">نشط</SelectItem>
                              <SelectItem value="paused">متوقف</SelectItem>
                              <SelectItem value="ended">منتهي</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* الحالة */}
                  <FormField
                    control={form.control}
                    name="caseStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-[140px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700">
                              <SelectValue placeholder="الحالة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">نشط</SelectItem>
                              <SelectItem value="inactive">غير نشط</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>

              <div className="flex flex-col gap-2">
                <AddProjectDialog />
                <div className="flex gap-1">
                  <Button
                    className="bg-primary w-1/2 text-white px-6 flex-1 py-2 rounded-xl flex items-center gap-2 text-sm font-medium"
                    size="lg"
                  >
                    <SearchCheck className="w-4 h-4" />
                    بحث
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="px-6 flex-1 shrink-0 w-1/2 py-2 rounded-xl"
                    onClick={() => form.reset()}
                  >
                    <RotateCcw className="w-4 h-4 text-primary" />
                    إعادة البحث
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
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
                      createContributionColumns({
                        onEdit: handleEdit,
                        onDelete: handleDelete,
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

        {/* Pagination */}
        <div className="flex items-center justify-center">
          <PaginationControls table={table} />
        </div>
      </div>
    </div>
  );
}
