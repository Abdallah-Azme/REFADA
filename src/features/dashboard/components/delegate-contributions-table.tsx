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

import { Eye, Loader2, RotateCcw, SearchCheck, Users } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import ContributionFamiliesDialog from "@/features/contributor/components/contribution-families-dialog";

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
    onViewFamilies: (item: DelegateContribution) => void;
  },
  t: (key: string) => string,
): ColumnDef<DelegateContribution>[] => [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => <div className="text-center">{row.original.id}</div>,
  },
  {
    accessorKey: "project.name",
    id: "projectName",
    header: t("project_name"),
    cell: ({ row }) => (
      <div className="text-center text-gray-700 font-medium max-w-[200px] truncate">
        {row.original.project?.name || "-"}
      </div>
    ),
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
        0,
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

      // Disable all action buttons if status is "approved" or "completed"
      const isApprovedOrCompleted =
        contribution.status === "approved" ||
        contribution.status === "completed";

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handlers.setConfirmingContribution(contribution);
              handlers.setConfirmStep(1); // Set to Quantity step
            }}
            disabled={contribution.alreadyConfirmed || isApprovedOrCompleted}
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
            disabled={isApprovedOrCompleted}
          >
            👥 {t("families_benefited")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handlers.setConfirmingContribution(contribution);
              handlers.setConfirmStep(3); // 3 for Finish Confirmation
            }}
            disabled={isApprovedOrCompleted}
            className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
            title={t("finish")}
          >
            ✅ {t("finish")}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlers.onViewFamilies(contribution)}
            title={t("families_benefited")}
          >
            <Users className="h-4 w-4 text-primary" />
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
    new Map(),
  );

  // View Families state
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [selectedHistoryFamilies, setSelectedHistoryFamilies] = useState<any[]>(
    [],
  );
  const [selectedHistoryMembers, setSelectedHistoryMembers] = useState<any[]>(
    [],
  );
  const [selectedHistoryProjectName, setSelectedHistoryProjectName] =
    useState("");
  const [selectedMembers, setSelectedMembers] = useState<Map<number, string>>(
    new Map(),
  );

  const [isAddingFamilies, setIsAddingFamilies] = useState(false);
  const [campFamilies, setCampFamilies] = useState<CampFamily[]>([]);
  const [isLoadingCampFamilies, setIsLoadingCampFamilies] = useState(false);

  const t = useTranslations("contributions");
  const tCommon = useTranslations("common");

  // Fetch camp families when stepping into family selection (Step 2)
  useEffect(() => {
    if (confirmStep === 2 && campFamilies.length === 0) {
      if (confirmingContribution) {
        fetchCampFamilies(confirmingContribution.id);
      } else {
        fetchCampFamilies();
      }
    }
  }, [confirmStep, campFamilies.length, confirmingContribution]);

  const fetchCampFamilies = async (contributionId?: number) => {
    setIsLoadingCampFamilies(true);
    try {
      // Use the new endpoint that includes addedByContributor flag
      if (contributionId) {
        const response =
          await getDelegateFamiliesForContributionApi(contributionId);

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
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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

  const handleViewFamilies = (item: DelegateContribution): void => {
    setSelectedHistoryFamilies(item.contributorFamilies || []);
    // Try to get members if they are returned by API
    const members = (item as any).contributorMembers || [];
    setSelectedHistoryMembers(members);
    setSelectedHistoryProjectName(item.project?.name || "");
    setIsHistoryDialogOpen(true);
  };

  // Wrapper for existing handleAddFamilies to work with new dialog
  const handleAddFamiliesWrapper = async (
    selectedFamiliesMap: Map<number, string>,
    selectedMembersMap: Map<number, string> = new Map(),
  ) => {
    if (!confirmingContribution) return;

    setIsAddingFamilies(true);
    try {
      // Filter out families that hasBenefit (already received) OR addedByContributor (already in contribution)
      const familiesData = Array.from(selectedFamiliesMap.entries())
        .filter(([familyId]) => {
          const family = campFamilies.find((f) => f.id === familyId);
          // Only filter out if they already have benefit OR were added by contributor
          return !family?.hasBenefit && !family?.addedByContributor;
        })
        .map(([familyId, quantity]) => ({
          id: familyId,
          quantity: parseInt(quantity) || 1,
        }));

      // Prepare members data
      const membersData = Array.from(selectedMembersMap.entries())
        .filter(([memberId]) => {
          // Find member in campFamilies
          for (const family of campFamilies) {
            const member = family.members?.find((m) => m.id === memberId);
            if (member) {
              // Filter out if hasBenefit OR addedByContributor
              return !member.hasBenefit && !member.addedByContributor;
            }
          }
          return true; // Should not happen if data is consistent
        })
        .map(([memberId, quantity]) => ({
          id: memberId,
          quantity: parseInt(quantity) || 1,
        }));

      // If all selected families were already added, just close the dialog
      if (familiesData.length === 0 && membersData.length === 0) {
        // Check if there was ANY selection at all (even if filtered out)
        if (selectedFamiliesMap.size > 0 || selectedMembersMap.size > 0) {
          // User selected something but it was filtered out => it's already added.
          // We treat this as success.
          toast.success(t("add_families_success"));
          handleCloseConfirmDialog();
          fetchContributions();
          return;
        } else {
          // User selected nothing
          toast.info(t("no_new_selection"));
          return;
        }
      }

      const response = await addFamiliesToContributionApi(
        confirmingContribution.id,
        familiesData,
        membersData,
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
    setSelectedMembers(new Map());
    setCampFamilies([]); // Clear families to force fetch on step 2
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
        quantity,
      );
      if (response.success) {
        toast.success(response.message || t("confirm_success"));
        // Update local state to mark this contribution as already confirmed
        setData((prevData) =>
          prevData.map((item) =>
            item.id === confirmingContribution.id
              ? { ...item, alreadyConfirmed: true }
              : item,
          ),
        );
        // Fetch families with contribution ID to get addedByContributor and hasBenefit flags
        await fetchCampFamilies(confirmingContribution.id);
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

  const handleCompleteContribution = async () => {
    if (!confirmingContribution) return;

    setIsConfirming(true);
    try {
      const response = await completeDelegateContributionApi(
        confirmingContribution.id,
      );
      if (response.success) {
        toast.success(response.message || t("complete_success"));
        // Update local state to mark this contribution as completed
        setData((prevData) =>
          prevData.map((item) =>
            item.id === confirmingContribution.id
              ? { ...item, status: "completed" }
              : item,
          ),
        );
        handleCloseConfirmDialog();
      } else {
        toast.error(response.message || t("complete_error"));
      }
    } catch (error: any) {
      console.error("Failed to complete contribution:", error);
      toast.error(error?.message || t("complete_error"));
    } finally {
      setIsConfirming(false);
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
    columns: createDelegateContributionColumns(
      {
        onView: handleView,
        onConfirm: handleConfirmClick,
        setConfirmingContribution,
        setConfirmStep,
        fetchCampFamilies,
        onViewFamilies: handleViewFamilies,
      },
      t,
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          {t("contributions")}
        </h2>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="p-4 border-b flex items-center gap-4">
          <Input
            placeholder={t("search_placeholder")}
            value={
              (table.getColumn("projectName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("projectName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <Table>
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
                            header.getContext(),
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
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("no_results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4 px-4 border-t">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} {t("of")}{" "}
            {table.getFilteredRowModel().rows.length} {t("row_selected")}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {t("prev")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {t("next")}
            </Button>
          </div>
        </div>
      </div>

      {/* View Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("contribution_details")}</DialogTitle>
          </DialogHeader>
          {selectedContribution && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">
                    {t("project_name")}
                  </h4>
                  <p>{selectedContribution.project?.name || "-"}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">
                    {t("contributor_name")}
                  </h4>
                  <p>{selectedContribution.contributor?.name || "-"}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">
                    {t("quantity")}
                  </h4>
                  <p>{selectedContribution.quantity}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">
                    {t("date")}
                  </h4>
                  <p>
                    {new Date(
                      selectedContribution.createdAt,
                    ).toLocaleDateString("ar-EG")}
                  </p>
                </div>
                <div className="col-span-2">
                  <h4 className="font-semibold text-sm text-gray-500">
                    {t("notes")}
                  </h4>
                  <p>{selectedContribution.notes || t("no_notes")}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Contribution Dialog */}
      {/* Confirm Contribution Dialog (Steps 1 & 3) */}
      <Dialog
        open={
          !!confirmingContribution && (confirmStep === 1 || confirmStep === 3)
        }
        onOpenChange={(open) => {
          if (!open) handleCloseConfirmDialog();
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {confirmStep === 1
                ? t("confirm_receipt")
                : t("finish_confirm_title")}
            </DialogTitle>
            <DialogDescription>
              {confirmStep === 1
                ? t("confirm_receipt_desc")
                : t("finish_confirm_desc")}
            </DialogDescription>
          </DialogHeader>

          {confirmingContribution && (
            <>
              {confirmStep === 1 ? (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="confirmedQuantity">
                      {t("received_quantity")}
                    </Label>
                    <Input
                      id="confirmedQuantity"
                      type="number"
                      value={confirmedQuantity}
                      onChange={(e) => setConfirmedQuantity(e.target.value)}
                      placeholder={t("enter_received_quantity")}
                    />
                  </div>
                </div>
              ) : (
                /* Step 3: Finish Confirmation */
                <div className="py-4">
                  <p className="text-center text-muted-foreground">
                    {t("finish_confirm_desc")}
                  </p>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseConfirmDialog}>
                  {t("cancel")}
                </Button>
                {confirmStep === 1 ? (
                  <Button onClick={handleConfirmContribution}>
                    {t("next")}
                  </Button>
                ) : (
                  <Button
                    onClick={handleCompleteContribution}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {t("finish")}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Family Selection Dialog (Step 2) */}
      {confirmingContribution && confirmStep === 2 && (
        <FamilySelectionDialog
          isOpen={true}
          onClose={handleCloseConfirmDialog}
          onConfirm={handleAddFamiliesWrapper}
          families={campFamilies}
          isLoading={isLoadingCampFamilies}
          initialSelection={selectedFamilies}
          initialMemberSelection={selectedMembers}
        />
      )}

      <ContributionFamiliesDialog
        isOpen={isHistoryDialogOpen}
        onClose={() => setIsHistoryDialogOpen(false)}
        families={selectedHistoryFamilies}
        members={selectedHistoryMembers}
        projectName={selectedHistoryProjectName}
      />
    </div>
  );
}
