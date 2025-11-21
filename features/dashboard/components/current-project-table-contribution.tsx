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
import { createColumns, dummyData } from "../table-cols/current-projects-cols";
import PaginationControls from "./pagination-controls";
import { Button } from "@/components/ui/button";
import { RotateCcw, SearchCheck } from "lucide-react";
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

import ProjectDetailsDialog from "./project-details-dialog";

import ContributeDialog from "./contribute-dialog";

export type Project = {
  id: number;
  projectName: string;
  camp: string;
  indicator: number;
  total: number;
  received: number;
  remaining: number;
  beneficiaryFamilies: number;
  requests: string;
};

const formSchema = z.object({
  project: z.string().optional(),
  status: z.string().optional(),
  family: z.string().optional(),
});

export default function CurrentProjectsTableContribution() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project: "",
      status: "",
      family: "",
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

  const [data] = React.useState<Project[]>(dummyData);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isContributeDialogOpen, setIsContributeDialogOpen] =
    React.useState(false);

  const handleView = (project: Project): void => {
    console.log("View:", project);
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleContribute = (project: Project): void => {
    console.log("Contribute:", project);
    setSelectedProject(project);
    setIsContributeDialogOpen(true);
    // If details dialog is open, we might want to close it or keep it open.
    // Usually, opening a new dialog on top is fine, or we can close the details one.
    // Let's keep details open if it was open, or close it.
    // For now, let's close the details dialog to avoid stacking issues if not desired.
    setIsDialogOpen(false);
  };

  const table = useReactTable<Project>({
    data,
    columns: createColumns({
      onView: handleView,
      onContribute: handleContribute,
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="rounded-lg bg-white">
      <div className="p-6">
        <div className="flex justify-between items-center gap-2">
          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              size="lg"
              variant="outline"
              className="px-6 py-2 rounded-xl flex items-center gap-2"
              onClick={() => form.reset()}
            >
              <RotateCcw className="w-4 h-4 text-primary" />
              إعادة البحث
            </Button>

            <Button
              className="bg-[#1B2540] text-white px-6 py-2 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-[#2c3b60]"
              size="lg"
            >
              <SearchCheck className="w-4 h-4" />
              بحث
            </Button>
          </div>

          {/* FORM */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-3"
            >
              {/* العائلة */}
              <FormField
                control={form.control}
                name="family"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[160px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700">
                          <SelectValue placeholder="العائلة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="family1">عائلة 1</SelectItem>
                          <SelectItem value="family2">عائلة 2</SelectItem>
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
                          <SelectItem value="completed">مكتمل</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

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
            </form>
          </Form>
        </div>
      </div>

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
                      onView: handleView,
                      onContribute: handleContribute,
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

      <ProjectDetailsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        project={selectedProject}
        onContribute={handleContribute}
      />

      <ContributeDialog
        isOpen={isContributeDialogOpen}
        onClose={() => setIsContributeDialogOpen(false)}
        project={selectedProject}
      />
    </div>
  );
}
