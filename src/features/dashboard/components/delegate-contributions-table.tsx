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
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import FamilySelectionDialog from "./family-selection-dialog";

import { Eye, Loader2, RotateCcw, SearchCheck } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CampFamily,
  DelegateContribution,
  FamilyQuantity,
  addFamiliesToContributionApi,
  completeDelegateContributionApi,
  confirmDelegateContributionApi,
  getDelegateContributionsApi,
  getDelegateFamiliesForContributionApi,
  getRepresentativeCampFamiliesApi,
} from "@/features/contributors/api/contributors.api";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import PaginationControls from "./pagination-controls";

const formSchema = z.object({
  status: z.string().optional(),
});

// ========================================
// COLUMN DEFINITIONS
// ========================================
const createDelegateContributionColumns = (
  handlers: {
    onView: (item: DelegateContribution) => void;
    onConfirm: (item: DelegateContribution) => void;
    setConfirmingContribution: (item: DelegateContribution | null) => void;
    setConfirmStep: (step: number) => void;
    fetchCampFamilies: (contributionId?: number) => void;
  },
  t: (key: string) => string
): ColumnDef<DelegateContribution>[] => [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => <div className="text-center">{row.original.id}</div>,
  },
  {
    accessorKey: "status",
    header: t("status"),
    cell: ({ row }) => {
      const status = row.original.status;
      let statusText = status;
      let colorClass = "bg-gray-100 text-gray-700";

      if (status === "pending") {
        statusText = t("status_pending");
        colorClass = "bg-yellow-100 text-yellow-700";
      } else if (status === "approved") {
        statusText = t("status_approved");
        colorClass = "bg-green-100 text-green-700";
      } else if (status === "rejected") {
        statusText = t("status_rejected");
        colorClass = "bg-red-100 text-red-700";
      } else if (status === "completed") {
        statusText = t("status_completed");
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
    header: t("families_benefited"),
    cell: ({ row }) => {
      const families = row.original.contributorFamilies;
      if (!families || families.length === 0) {
        return <div className="text-center text-gray-400">-</div>;
      }

      // Calculate total quantity from all families
      const totalQuantity = families.reduce(
        (sum, f) => sum + (f.quantity || 0),
        0
      );

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center cursor-pointer">
                <div className="text-gray-600 font-semibold">
                  {totalQuantity}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <div className="text-right space-y-1">
                {families.map((f) => (
                  <div key={f.id} className="text-sm">
                    <span className="font-medium">{f.familyName}</span>
                    <span className="text-gray-400 text-xs mr-2">
                      ({f.quantity || 0} وحدة)
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
    header: t("notes"),
    cell: ({ row }) => (
      <div className="text-center text-gray-500 text-sm max-w-[150px] truncate">
        {row.original.notes || "-"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: t("contribution_date"),
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
    header: t("actions"),
    id: "actions",
    cell: ({ row }) => {
      const contribution = row.original;

      // Disable "Families" if quantity is not confirmed (pending status usually implies not confirmed yet)
      // Adjust logic based on real "confirmed" status if available
      const isQuantityConfirmed = contribution.status !== "pending";

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handlers.setConfirmingContribution(contribution);
              handlers.setConfirmStep(1); // Set to Quantity step
            }}
            disabled={contribution.alreadyConfirmed}
            title={t("received_quantity")}
          >
            📋{" "}
            {contribution.alreadyConfirmed
              ? t("quantity_matched")
              : t("match_quantity")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handlers.setConfirmingContribution(contribution);
              handlers.setConfirmStep(2); // Set to Families step (opens family dialog)
              handlers.fetchCampFamilies(contribution.id);
            }}
            // Enable only if quantity is confirmed, or if specifically requested to allow independent flow
            // User said "button be disabled after [quantity entered] the second one be the select family" which implies sequential
            // But also "select family it will be a table...". Let's enable it always for now for testing or if status is not pending.
            // Actually, user said "first one enter quantity ... and then the button be disabled after ... the second one be the select family"
            // Stick to enabling Families button always for flexibility unless explicitly restricted.
          >
            👥 {t("families_benefited")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Placeholder for finish action
              // Could open a confirmation dialog or just trigger an API
              // For now, simpler to just treat it as a final confirmation step if needed
              // But user asked for a button named 'complete it' or 'finish it'
              // Let's add a simple alert/toast for now as backend is missing
              // Or we could reuse the confirmation dialog with a new step?
              // Let's try to add a 3rd step in the dialog to confirm finish?
              // Or just a separate confirmation alert.
              // Let's stick to the pattern: open a dialog or call a handler.
              handlers.setConfirmingContribution(contribution);
              handlers.setConfirmStep(3); // 3 for Finish Confirmation
            }}
            className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
            title={t("finish")}
          >
            ✅ {t("finish")}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlers.onView(contribution)}
            title={t("view_details")}
          >
            <Eye className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      );
    },
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
  const t = useTranslations("contributions");
  if (!contribution) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-right">
            {t("contribution_details")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-right">
          {/* Contribution Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-1">
                {t("contribution_number")}
              </h4>
              <p className="text-2xl font-bold text-primary">
                #{contribution.id}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-1">
                {t("status")}
              </h4>
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
                  ? t("status_pending")
                  : contribution.status === "approved"
                  ? t("status_approved")
                  : contribution.status === "rejected"
                  ? t("status_rejected")
                  : contribution.status === "completed"
                  ? t("status_completed")
                  : contribution.status}
              </p>
            </div>
          </div>

          {/* Families */}
          {contribution.contributorFamilies.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                {t("families_benefited")} (
                {contribution.contributorFamilies.length})
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
                        ({family.totalMembers} {t("individuals")})
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
              <h4 className="font-semibold text-gray-800 mb-1">{t("notes")}</h4>
              <p className="text-gray-600">{contribution.notes}</p>
            </div>
          )}

          {/* Date */}
          <div className="text-sm text-gray-500 text-center">
            {t("contribution_date")}:{" "}
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

  console.log({ data });

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
  const [confirmStep, setConfirmStep] = useState<number>(1);
  const [selectedFamilies, setSelectedFamilies] = useState<Map<number, string>>(
    new Map()
  );
  const [isAddingFamilies, setIsAddingFamilies] = useState(false);
  const [campFamilies, setCampFamilies] = useState<CampFamily[]>([]);
  const [isLoadingCampFamilies, setIsLoadingCampFamilies] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const t = useTranslations("contributions");
  const tCommon = useTranslations("common");

  // Fetch camp families when stepping into family selection (Step 2)
  useEffect(() => {
    if (confirmStep === 2 && campFamilies.length === 0) {
      fetchCampFamilies();
    }
  }, [confirmStep, campFamilies.length]);

  const fetchCampFamilies = async (contributionId?: number) => {
    setIsLoadingCampFamilies(true);
    try {
      // Use the new endpoint that includes addedByContributor flag
      if (contributionId) {
        const response = await getDelegateFamiliesForContributionApi(
          contributionId
        );
        if (response.success) {
          // Sort families: suggested (addedByContributor) first
          const sortedFamilies = [...response.data.families].sort((a, b) => {
            if (a.addedByContributor && !b.addedByContributor) return -1;
            if (!a.addedByContributor && b.addedByContributor) return 1;
            return 0;
          });
          setCampFamilies(sortedFamilies);
        }
      } else {
        const response = await getRepresentativeCampFamiliesApi();
        if (response.success) {
          setCampFamilies(response.data.families);
        }
      }
    } catch (error) {
      console.error("Failed to fetch camp families:", error);
      toast.error(t("fetch_families_error"));
    } finally {
      setIsLoadingCampFamilies(false);
    }
  };

  // Display families directly from campFamilies (already sorted)
  const displayFamilies = React.useMemo(() => {
    return campFamilies.map((f) => ({
      ...f,
      addedByContributor: f.addedByContributor || false,
    }));
  }, [campFamilies]);

  // Fetch contributions
  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    setIsLoading(true);
    try {
      const response = await getDelegateContributionsApi();
      if (response.success) {
        // Sort by id descending (latest first) or createdAt
        const sortedData = [...response.data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setData(sortedData);
      }
    } catch (error) {
      console.error("Failed to fetch contributions:", error);
      toast.error(t("fetch_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (item: DelegateContribution): void => {
    setSelectedContribution(item);
    setIsDialogOpen(true);
  };

  // Wrapper for existing handleAddFamilies to work with new dialog
  const handleAddFamiliesWrapper = async (selected: Map<number, string>) => {
    if (!confirmingContribution) return;

    setIsAddingFamilies(true);
    try {
      // Filter out families that are already addedByContributor or hasBenefit (they're already true on backend)
      const familiesData = Array.from(selected.entries())
        .filter(([familyId]) => {
          const family = campFamilies.find((f) => f.id === familyId);
          return !family?.addedByContributor && !family?.hasBenefit;
        })
        .map(([familyId, quantity]) => ({
          id: familyId,
          quantity: parseInt(quantity) || 1,
        }));

      // If all selected families were already added, just close the dialog
      if (familiesData.length === 0) {
        toast.success(t("add_families_success"));
        handleCloseConfirmDialog();
        return;
      }

      const response = await addFamiliesToContributionApi(
        confirmingContribution.id,
        familiesData
      );

      if (response.success) {
        toast.success(t("add_families_success"));
        handleCloseConfirmDialog();
        fetchContributions();
      } else {
        toast.error(response.message || t("add_families_error"));
      }
    } catch (error) {
      console.error("Error adding families:", error);
      toast.error(t("add_families_error"));
    } finally {
      setIsAddingFamilies(false);
    }
  };

  const handleConfirmClick = (contribution: DelegateContribution) => {
    setConfirmingContribution(contribution);
    setConfirmedQuantity("");
    setConfirmStep(1);
    setSelectedFamilies(new Map());
  };

  const handleConfirmContribution = async () => {
    if (!confirmingContribution) return;

    const quantity = parseInt(confirmedQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error(t("invalid_quantity"));
      return;
    }

    setIsConfirming(true);
    try {
      const response = await confirmDelegateContributionApi(
        confirmingContribution.id,
        quantity
      );
      if (response.success) {
        toast.success(response.message || t("confirm_success"));
        // Move to step 2 for family selection
        setConfirmStep(2);
      } else {
        toast.error(response.message || t("confirm_error"));
      }
    } catch (error: any) {
      console.error("Failed to confirm contribution:", error);
      toast.error(error?.message || t("confirm_error"));
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
      toast.error(t("select_family"));
      return;
    }

    const families: FamilyQuantity[] = [];
    for (const [id, qty] of selectedFamilies) {
      const quantity = parseInt(qty);
      if (isNaN(quantity) || quantity <= 0) {
        toast.error(t("invalid_family_quantity"));
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
        toast.success(response.message || t("add_families_success"));
        handleCloseConfirmDialog();
        fetchContributions();
      } else {
        toast.error(response.message || t("add_families_error"));
      }
    } catch (error: any) {
      console.error("Failed to add families:", error);
      toast.error(error?.message || t("add_families_error"));
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

  const handleCompleteContribution = async () => {
    if (!confirmingContribution) return;

    setIsCompleting(true);
    try {
      const response = await completeDelegateContributionApi(
        confirmingContribution.id
      );
      if (response.success) {
        toast.success(response.message || t("finish_confirm_title"));
        handleCloseConfirmDialog();
        fetchContributions();
      } else {
        toast.error(response.message || t("confirm_error"));
      }
    } catch (error: any) {
      console.error("Failed to complete contribution:", error);
      toast.error(error?.message || t("confirm_error"));
    } finally {
      setIsCompleting(false);
    }
  };

  // Filter data based on form values
  const watchedStatus = form.watch("status");

  console.log({ watchedStatus });
  const filteredData = React.useMemo(() => {
    let filtered = [...data];

    if (watchedStatus && watchedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === watchedStatus);
    }

    return filtered;
  }, [data, watchedStatus]);

  console.log({ displayFamilies });
  const table = useReactTable<DelegateContribution>({
    data: filteredData,
    columns: createDelegateContributionColumns(
      {
        onView: handleView,
        onConfirm: handleConfirmClick,
        setConfirmingContribution,
        setConfirmStep,
        fetchCampFamilies,
      },
      t
    ),
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
        <span className="mr-3 text-gray-600">{t("loading")}</span>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg min-h-screen bg">
      <div className="space-y-4">
        {/* Header with Title and Search */}
        <div className=" mb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("page_title")}
          </h2>

          <div className="p-6  ">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              {/* FORM */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full sm:w-auto"
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
                            <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700">
                              <SelectValue placeholder={t("filter_status")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                {t("filter_all")}
                              </SelectItem>
                              <SelectItem value="pending">
                                {t("status_pending")}
                              </SelectItem>
                              <SelectItem value="approved">
                                {t("status_approved")}
                              </SelectItem>
                              <SelectItem value="rejected">
                                {t("status_rejected")}
                              </SelectItem>
                              <SelectItem value="completed">
                                {t("status_completed")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  className="bg-primary text-white px-6 flex-1 sm:flex-none py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
                  size="lg"
                  onClick={fetchContributions}
                >
                  <SearchCheck className="w-4 h-4" />
                  {t("update")}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 flex-1 sm:flex-none py-2 rounded-xl shrink-0"
                  onClick={() => form.reset()}
                >
                  <RotateCcw className="w-4 h-4 text-primary" />
                  {t("reset")}
                </Button>
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
                      createDelegateContributionColumns(
                        {
                          onView: handleView,
                          onConfirm: handleConfirmClick,
                          setConfirmingContribution,
                          setConfirmStep,
                          fetchCampFamilies,
                        },
                        t
                      ).length
                    }
                    className="h-24 text-center"
                  >
                    {tCommon("no_results")}
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

        {/* Confirm Contribution Dialog - Step 1 Only (Quantity) */}
        {/* Confirm Contribution Dialog */}
        <Dialog
          open={!!confirmingContribution}
          onOpenChange={(open) => {
            if (!open) handleCloseConfirmDialog();
          }}
        >
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">
                {confirmStep === 3
                  ? t("finish_confirm_title")
                  : t("confirm_receipt_title")}
              </DialogTitle>
            </DialogHeader>

            {confirmStep === 1 ? (
              // Step 1: Quantity
              <div className="space-y-4 text-right">
                <p className="text-gray-600">
                  {t("confirm_receipt_desc")}{" "}
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
                    {t("received_quantity")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="confirmed-quantity"
                    type="number"
                    placeholder={t("received_quantity_placeholder")}
                    value={confirmedQuantity}
                    onChange={(e) => setConfirmedQuantity(e.target.value)}
                    className="text-right"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={handleCloseConfirmDialog}
                    disabled={isConfirming}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    onClick={handleConfirmContribution}
                    disabled={!confirmedQuantity || isConfirming}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    {isConfirming ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        {t("confirming")}
                      </>
                    ) : (
                      t("confirm_receipt")
                    )}
                  </Button>
                </div>
              </div>
            ) : confirmStep === 2 ? (
              // Step 2: Family Selection Active (Placeholder)
              <div className="py-8 text-center text-gray-500">
                {t("families_selection_active")}
              </div>
            ) : (
              // Step 3: Finish Confirmation
              <div className="space-y-4 text-right">
                <p className="text-gray-600">{t("finish_confirm_desc")}</p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={handleCloseConfirmDialog}>
                    {tCommon("cancel")}
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success(t("finish_confirm_title"));
                      handleCloseConfirmDialog();
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {t("finish")}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Family Selection Dialog */}
        <FamilySelectionDialog
          isOpen={confirmStep === 2}
          onClose={handleCloseConfirmDialog}
          onConfirm={(selected) => {
            setSelectedFamilies(selected);
            handleAddFamiliesWrapper(selected);
          }}
          families={displayFamilies}
          isLoading={isLoadingCampFamilies}
          initialSelection={selectedFamilies}
        />
      </div>
    </div>
  );
}
