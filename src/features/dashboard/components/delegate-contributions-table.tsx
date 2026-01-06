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
  ColumnDef,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

import {
  Loader2,
  RotateCcw,
  SearchCheck,
  Eye,
  CheckCircle,
} from "lucide-react";

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
  getDelegateContributionsApi,
  DelegateContribution,
  ContributorFamily,
  confirmDelegateContributionApi,
  addFamiliesToContributionApi,
  FamilyQuantity,
} from "@/features/contributors/api/contributors.api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  status: z.string().optional(),
});

// ========================================
// COLUMN DEFINITIONS
// ========================================
const createDelegateContributionColumns = (handlers: {
  onView: (item: DelegateContribution) => void;
  onConfirm: (item: DelegateContribution) => void;
}): ColumnDef<DelegateContribution>[] => [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => (
      <div className="text-center font-medium text-gray-500">
        {row.original.id}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.original.status;
      let statusText = status;
      let colorClass = "bg-gray-100 text-gray-700";

      if (status === "pending") {
        statusText = "قيد الانتظار";
        colorClass = "bg-yellow-100 text-yellow-700";
      } else if (status === "approved") {
        statusText = "موافق عليه";
        colorClass = "bg-green-100 text-green-700";
      } else if (status === "rejected") {
        statusText = "مرفوض";
        colorClass = "bg-red-100 text-red-700";
      } else if (status === "completed") {
        statusText = "مكتمل";
        colorClass = "bg-blue-100 text-blue-700";
      }

      return (
        <div className="flex justify-center">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
          >
            {statusText}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "contributorFamilies",
    header: "العائلات المستفيدة",
    cell: ({ row }) => {
      const families = row.original.contributorFamilies;
      if (!families || families.length === 0) {
        return <div className="text-center text-gray-400">-</div>;
      }

      const displayCount = Math.min(families.length, 2);
      const remaining = families.length - displayCount;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center cursor-pointer">
                <div className="text-gray-600">
                  {families.slice(0, displayCount).map((f, i) => (
                    <span key={f.id}>
                      {f.familyName}
                      {i < displayCount - 1 ? "، " : ""}
                    </span>
                  ))}
                  {remaining > 0 && (
                    <span className="text-primary font-medium">
                      {" "}
                      +{remaining} آخرين
                    </span>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <div className="text-right space-y-1">
                {families.map((f) => (
                  <div key={f.id} className="text-sm">
                    <span className="font-medium">{f.familyName}</span>
                    <span className="text-gray-400 text-xs mr-2">
                      ({f.totalMembers} أفراد)
                    </span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "ملاحظات",
    cell: ({ row }) => (
      <div className="text-center text-gray-500 text-sm max-w-[150px] truncate">
        {row.original.notes || "-"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ المساهمة",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="text-center text-gray-600 text-sm">
          {date.toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "الإجراءات",
    cell: ({ row }) => (
      <div className="flex justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={() => handlers.onView(row.original)}
        >
          <Eye className="w-5 h-5" />
        </Button>
        {row.original.status === "pending" && (
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => handlers.onConfirm(row.original)}
          >
            <CheckCircle className="w-5 h-5" />
          </Button>
        )}
      </div>
    ),
  },
];

// ========================================
// DELEGATE CONTRIBUTION DETAILS DIALOG
// ========================================
function DelegateContributionDetailsDialog({
  isOpen,
  onClose,
  contribution,
}: {
  isOpen: boolean;
  onClose: () => void;
  contribution: DelegateContribution | null;
}) {
  if (!contribution) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-right">تفاصيل المساهمة</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-right">
          {/* Contribution Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-1">رقم المساهمة</h4>
              <p className="text-2xl font-bold text-primary">
                #{contribution.id}
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
export default function DelegateContributionsTable() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

  const [data, setData] = useState<DelegateContribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContribution, setSelectedContribution] =
    useState<DelegateContribution | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Confirm dialog state
  const [confirmingContribution, setConfirmingContribution] =
    useState<DelegateContribution | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmedQuantity, setConfirmedQuantity] = useState<string>("");

  // Step 2: Family selection state
  const [confirmStep, setConfirmStep] = useState<1 | 2>(1);
  const [selectedFamilies, setSelectedFamilies] = useState<Map<number, string>>(
    new Map()
  );
  const [isAddingFamilies, setIsAddingFamilies] = useState(false);

  // Fetch contributions
  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    setIsLoading(true);
    try {
      const response = await getDelegateContributionsApi();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch contributions:", error);
      toast.error("فشل في جلب المساهمات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (item: DelegateContribution): void => {
    setSelectedContribution(item);
    setIsDialogOpen(true);
  };

  const handleConfirmClick = (item: DelegateContribution): void => {
    setConfirmingContribution(item);
    setConfirmedQuantity("");
    setConfirmStep(1);
    setSelectedFamilies(new Map());
  };

  const handleConfirmContribution = async () => {
    if (!confirmingContribution) return;

    const quantity = parseInt(confirmedQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("يرجى إدخال كمية صالحة");
      return;
    }

    setIsConfirming(true);
    try {
      const response = await confirmDelegateContributionApi(
        confirmingContribution.id,
        quantity
      );
      if (response.success) {
        toast.success(response.message || "تم تأكيد المساهمة بنجاح");
        // Move to step 2 for family selection
        setConfirmStep(2);
      } else {
        toast.error(response.message || "فشل في تأكيد المساهمة");
      }
    } catch (error: any) {
      console.error("Failed to confirm contribution:", error);
      toast.error(error?.message || "فشل في تأكيد المساهمة");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleToggleFamily = (familyId: number) => {
    const newMap = new Map(selectedFamilies);
    if (newMap.has(familyId)) {
      newMap.delete(familyId);
    } else {
      newMap.set(familyId, "1"); // Default quantity of 1
    }
    setSelectedFamilies(newMap);
  };

  const handleFamilyQuantityChange = (familyId: number, quantity: string) => {
    const newMap = new Map(selectedFamilies);
    newMap.set(familyId, quantity);
    setSelectedFamilies(newMap);
  };

  const handleAddFamilies = async () => {
    if (!confirmingContribution || selectedFamilies.size === 0) {
      toast.error("يرجى اختيار عائلة واحدة على الأقل");
      return;
    }

    const families: FamilyQuantity[] = [];
    for (const [id, qty] of selectedFamilies) {
      const quantity = parseInt(qty);
      if (isNaN(quantity) || quantity <= 0) {
        toast.error("يرجى إدخال كمية صالحة لكل عائلة");
        return;
      }
      families.push({ id, quantity });
    }

    setIsAddingFamilies(true);
    try {
      const response = await addFamiliesToContributionApi(
        confirmingContribution.id,
        families
      );
      if (response.success) {
        toast.success(response.message || "تم إضافة العائلات بنجاح");
        handleCloseConfirmDialog();
        fetchContributions();
      } else {
        toast.error(response.message || "فشل في إضافة العائلات");
      }
    } catch (error: any) {
      console.error("Failed to add families:", error);
      toast.error(error?.message || "فشل في إضافة العائلات");
    } finally {
      setIsAddingFamilies(false);
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmingContribution(null);
    setConfirmedQuantity("");
    setConfirmStep(1);
    setSelectedFamilies(new Map());
  };

  // Filter data based on form values
  const watchedStatus = form.watch("status");

  const filteredData = React.useMemo(() => {
    let filtered = [...data];

    if (watchedStatus && watchedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === watchedStatus);
    }

    return filtered;
  }, [data, watchedStatus]);

  const table = useReactTable<DelegateContribution>({
    data: filteredData,
    columns: createDelegateContributionColumns({
      onView: handleView,
      onConfirm: handleConfirmClick,
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
        <span className="mr-3 text-gray-600">جاري تحميل المساهمات...</span>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg min-h-screen bg" dir="rtl">
      <div className="space-y-4">
        {/* Header with Title and Search */}
        <div className=" mb-2">
          <h2 className="text-2xl font-bold text-gray-800">المساهمات</h2>

          <div className="p-6  ">
            <div className="flex justify-between items-center gap-2">
              {/* FORM */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex items-center gap-3 self-end"
                >
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
                    onClick={fetchContributions}
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
                      createDelegateContributionColumns({
                        onView: handleView,
                        onConfirm: handleConfirmClick,
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
        <DelegateContributionDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          contribution={selectedContribution}
        />

        {/* Confirm Contribution Dialog */}
        <Dialog
          open={!!confirmingContribution}
          onOpenChange={handleCloseConfirmDialog}
        >
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">
                {confirmStep === 1
                  ? "تأكيد استلام المساهمة"
                  : "اختيار العائلات المستفيدة"}
              </DialogTitle>
            </DialogHeader>

            {confirmStep === 1 ? (
              // Step 1: Quantity Input
              <div className="space-y-4 text-right">
                <p className="text-gray-600">
                  هل أنت متأكد من رغبتك في تأكيد استلام المساهمة رقم{" "}
                  <span className="font-semibold text-gray-900">
                    #{confirmingContribution?.id}
                  </span>
                  ؟
                </p>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmed-quantity"
                    className="text-right block"
                  >
                    الكمية المستلمة <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="confirmed-quantity"
                    type="number"
                    placeholder="أدخل الكمية المستلمة"
                    value={confirmedQuantity}
                    onChange={(e) => setConfirmedQuantity(e.target.value)}
                    className="text-right h-12 rounded-xl"
                    min={1}
                  />
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <Button
                    variant="outline"
                    onClick={handleCloseConfirmDialog}
                    disabled={isConfirming}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleConfirmContribution}
                    disabled={isConfirming || !confirmedQuantity}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isConfirming ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                        جاري التأكيد...
                      </>
                    ) : (
                      "التالي"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              // Step 2: Family Selection
              <div className="space-y-4 text-right">
                <p className="text-gray-600">
                  اختر العائلات المستفيدة من هذه المساهمة وحدد الكمية لكل عائلة:
                </p>

                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {confirmingContribution?.contributorFamilies.map((family) => (
                    <div
                      key={family.id}
                      onClick={() => handleToggleFamily(family.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                        selectedFamilies.has(family.id)
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <Checkbox
                        id={`family-${family.id}`}
                        checked={selectedFamilies.has(family.id)}
                        onCheckedChange={() => handleToggleFamily(family.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`family-${family.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {family.familyName}
                        </label>
                        <p className="text-xs text-gray-500">
                          {family.totalMembers} أفراد - {family.camp}
                        </p>
                      </div>
                      {selectedFamilies.has(family.id) && (
                        <Input
                          type="number"
                          placeholder="الكمية"
                          value={selectedFamilies.get(family.id) || ""}
                          onChange={(e) =>
                            handleFamilyQuantityChange(
                              family.id,
                              e.target.value
                            )
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-20 h-9 text-center"
                          min={1}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmStep(1)}
                    disabled={isAddingFamilies}
                  >
                    السابق
                  </Button>
                  <Button
                    onClick={handleAddFamilies}
                    disabled={isAddingFamilies || selectedFamilies.size === 0}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isAddingFamilies ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                        جاري الإضافة...
                      </>
                    ) : (
                      "إضافة العائلات"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
