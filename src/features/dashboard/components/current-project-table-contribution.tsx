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
  createColumnsForContributor,
  Project,
} from "../table-cols/project-contribution-cols";
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
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().optional(),
  project: z.string().optional(),
  status: z.string().optional(),
  family: z.string().optional(),
});

interface CurrentProjectsTableContributionProps {
  projects?: Project[];
  campId?: number;
}

export default function CurrentProjectsTableContribution({
  projects = [],
  campId,
}: CurrentProjectsTableContributionProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
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

  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isContributeDialogOpen, setIsContributeDialogOpen] =
    React.useState(false);

  // Filter projects based on search
  const watchedName = form.watch("name");
  const watchedStatus = form.watch("status");

  const filteredProjects = React.useMemo(() => {
    let filtered = [...projects];

    if (watchedName) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(watchedName.toLowerCase())
      );
    }

    if (watchedStatus) {
      filtered = filtered.filter((p) => p.status === watchedStatus);
    }

    return filtered;
  }, [projects, watchedName, watchedStatus]);

  const handleView = (project: Project): void => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleContribute = (project: Project): void => {
    setSelectedProject(project);
    setIsContributeDialogOpen(true);
    setIsDialogOpen(false);
  };

  const table = useReactTable<Project>({
    data: filteredProjects,
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {}

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
              {/* اسم المشروع */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="اسم المشروع"
                        {...field}
                        className="w-[200px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700"
                      />
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
                          <SelectItem value="pending">قيد الانتظار</SelectItem>
                          <SelectItem value="approved">موافق عليه</SelectItem>
                          <SelectItem value="completed">مكتمل</SelectItem>
                          <SelectItem value="rejected">مرفوض</SelectItem>
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
                    createColumnsForContributor({
                      onView: handleView,
                      onContribute: handleContribute,
                    }).length
                  }
                  className="h-24 text-center"
                >
                  {projects.length === 0
                    ? "لا توجد مشاريع في هذا الإيواء"
                    : "لا توجد نتائج."}
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
        campId={campId}
      />
    </div>
  );
}
