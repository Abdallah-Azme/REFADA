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
import PaginationControls from "./pagination-controls";
import {
  createColumnsForContributor,
  dummyData,
  Project,
} from "../table-cols/project-contribution-cols";
import ProjectDetailsDialog from "./project-details-dialog";
import ContributeDialog from "./contribute-dialog";

const formSchema = z.object({
  project: z.string().optional(),
  camp: z.string().optional(),
  family: z.string().optional(),
});

// ========================================
// MAIN TABLE COMPONENT
// ========================================
export default function ContributionTable() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project: "",
      camp: "",
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
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [data] = React.useState<Project[]>(dummyData);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isContributeDialogOpen, setIsContributeDialogOpen] =
    React.useState(false);

  const handleView = (project: Project): void => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleContribute = (project: Project): void => {
    setSelectedProject(project);
    setIsContributeDialogOpen(true);
    // Close details dialog if open to prevent stacking
    setIsDialogOpen(false);
  };

  const table = useReactTable<Project>({
    data,
    columns: createColumnsForContributor({
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

  function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <div className="w-full p-6 bg-white rounded-lg min-h-screen bg" dir="rtl">
      <div className="space-y-4">
        {/* Header with Title and Search */}
        <div className=" mb-2">
          <h2 className="text-2xl font-bold text-gray-800">سجل المساهمات</h2>

          <div className="p-6  ">
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

                  {/* الإيواء */}
                  <FormField
                    control={form.control}
                    name="camp"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-[160px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700">
                              <SelectValue placeholder="الإيواء" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="camp1">إيواء 1</SelectItem>
                              <SelectItem value="camp2">إيواء 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

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
                </form>
              </Form>

              <div className="flex flex-col gap-2">
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
        <div className=" bg-white ">
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
                      createColumnsForContributor({
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

        {/* Pagination */}
        <div className="flex items-center justify-center">
          <PaginationControls table={table} />
        </div>

        {/* Dialogs */}
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
    </div>
  );
}
