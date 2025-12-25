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
import React, { useEffect, useState } from "react";

import { Loader2, RotateCcw, SearchCheck } from "lucide-react";

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
import { createContributionHistoryColumns } from "../table-cols/contribution-history-cols";
import {
  getContributorHistoryApi,
  ContributionHistoryItem,
} from "@/features/contributors/api/contributors.api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
  project: z.string().optional(),
  status: z.string().optional(),
});

// ========================================
// CONTRIBUTION DETAILS DIALOG
// ========================================
function ContributionDetailsDialog({
  isOpen,
  onClose,
  contribution,
}: {
  isOpen: boolean;
  onClose: () => void;
  contribution: ContributionHistoryItem | null;
}) {
  if (!contribution) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-right">تفاصيل المساهمة</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-right">
          {/* Project Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">المشروع</h4>
            <p className="text-gray-600">{contribution.project.name}</p>
            <p className="text-sm text-gray-500">
              النوع:{" "}
              {contribution.project.type === "product"
                ? "منتج"
                : contribution.project.type === "internal"
                ? "داخلي"
                : contribution.project.type}
            </p>
          </div>

          {/* Contribution Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-1">الكمية</h4>
              <p className="text-2xl font-bold text-primary">
                {contribution.totalQuantity}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-1">الحالة</h4>
              <p
                className={`font-medium ${
                  contribution.status === "pending"
                    ? "text-yellow-600"
                    : contribution.status === "approved"
                    ? "text-green-600"
                    : contribution.status === "rejected"
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              >
                {contribution.status === "pending"
                  ? "قيد الانتظار"
                  : contribution.status === "approved"
                  ? "موافق عليه"
                  : contribution.status === "rejected"
                  ? "مرفوض"
                  : contribution.status === "completed"
                  ? "مكتمل"
                  : contribution.status}
              </p>
            </div>
          </div>

          {/* Families */}
          {contribution.contributorFamilies.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                العائلات المستفيدة ({contribution.contributorFamilies.length})
              </h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {contribution.contributorFamilies.map((family) => (
                  <div
                    key={family.id}
                    className="flex justify-between items-center bg-white p-2 rounded border"
                  >
                    <div>
                      <span className="font-medium">{family.familyName}</span>
                      <span className="text-gray-400 text-xs mr-2">
                        ({family.totalMembers} أفراد)
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{family.camp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {contribution.notes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-1">ملاحظات</h4>
              <p className="text-gray-600">{contribution.notes}</p>
            </div>
          )}

          {/* Date */}
          <div className="text-sm text-gray-500 text-center">
            تاريخ المساهمة:{" "}
            {new Date(contribution.createdAt).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ========================================
// MAIN TABLE COMPONENT
// ========================================
export default function ContributionTable() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project: "",
      status: "",
    },
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");

  const [data, setData] = useState<ContributionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContribution, setSelectedContribution] =
    useState<ContributionHistoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch contribution history
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await getContributorHistoryApi();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch contribution history:", error);
      toast.error("فشل في جلب سجل المساهمات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (item: ContributionHistoryItem): void => {
    setSelectedContribution(item);
    setIsDialogOpen(true);
  };

  // Filter data based on form values
  const watchedProject = form.watch("project");
  const watchedStatus = form.watch("status");

  const filteredData = React.useMemo(() => {
    let filtered = [...data];

    if (watchedProject && watchedProject !== "all") {
      filtered = filtered.filter(
        (item) => item.project.id.toString() === watchedProject
      );
    }

    if (watchedStatus && watchedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === watchedStatus);
    }

    return filtered;
  }, [data, watchedProject, watchedStatus]);

  // Get unique projects for filter dropdown
  const uniqueProjects = React.useMemo(() => {
    const projectMap = new Map<number, string>();
    data.forEach((item) => {
      projectMap.set(item.project.id, item.project.name);
    });
    return Array.from(projectMap.entries()).map(([id, name]) => ({
      id: id.toString(),
      name,
    }));
  }, [data]);

  const table = useReactTable<ContributionHistoryItem>({
    data: filteredData,
    columns: createContributionHistoryColumns({
      onView: handleView,
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

  if (isLoading) {
    return (
      <div className="w-full p-6 bg-white rounded-lg min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-3 text-gray-600">جاري تحميل سجل المساهمات...</span>
      </div>
    );
  }

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
                              {uniqueProjects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                  {project.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* الحالة */}
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
                              <SelectValue placeholder="الحالة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">الكل</SelectItem>
                              <SelectItem value="pending">
                                قيد الانتظار
                              </SelectItem>
                              <SelectItem value="approved">
                                موافق عليه
                              </SelectItem>
                              <SelectItem value="rejected">مرفوض</SelectItem>
                              <SelectItem value="completed">مكتمل</SelectItem>
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
                    onClick={fetchHistory}
                  >
                    <SearchCheck className="w-4 h-4" />
                    تحديث
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
                      createContributionHistoryColumns({
                        onView: handleView,
                      }).length
                    }
                    className="h-24 text-center"
                  >
                    لا توجد مساهمات بعد.
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

        {/* Details Dialog */}
        <ContributionDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          contribution={selectedContribution}
        />
      </div>
    </div>
  );
}
