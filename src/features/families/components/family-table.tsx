"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { Input } from "@/src/shared/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/shared/ui/table";
import {
  Search,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { getFamiliesApi, getFamilyMembersApi } from "../api/families.api";
import { Family } from "../types/family.schema";
import { FamiliesQueryParams } from "../types/families-query.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/ui/select";
import { useMedicalConditions } from "@/features/medical-condition/hooks/use-medical-condition";
import { useCampNames } from "@/features/camps";
import { useMaritalStatuses } from "@/features/marital-status";
import { Button } from "@/src/shared/ui/button";
import { BulkDeleteDialog } from "./bulk-delete-dialog";
import {
  exportToExcel,
  formatFamiliesWithMembersForExport,
  formatFamiliesForExport,
} from "@/src/lib/export-utils";
import { useTableExport } from "@/src/shared/hooks/use-table-export";

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface FamilyTableProps {
  data: Family[];
  columns: ColumnDef<Family>[];
  onSelectionChange?: (selectedRows: Family[]) => void;
  showCampFilter?: boolean;
  showFilters?: boolean; // Hide filters for pages that don't support server-side filtering
  // Server-side pagination props (optional for simple table usage)
  queryParams?: FamiliesQueryParams;
  onQueryChange?: (params: FamiliesQueryParams) => void;
  meta?: PaginationMeta;
  isLoading?: boolean;
}

// Default empty query params for when not using server-side pagination
const defaultQueryParams: FamiliesQueryParams = {};

export function FamilyTable({
  data,
  columns,
  onSelectionChange,
  showCampFilter = true,
  showFilters,
  queryParams = defaultQueryParams,
  onQueryChange,
  meta,
  isLoading = false,
}: FamilyTableProps) {
  // If showFilters is not explicitly set, default to showing filters only when onQueryChange is provided
  const shouldShowFilters = showFilters ?? !!onQueryChange;
  const t = useTranslations("families_page");
  const tCommon = useTranslations("common");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Local state for debounced search inputs
  const [searchInput, setSearchInput] = React.useState(
    queryParams.search || "",
  );
  const [nationalIdInput, setNationalIdInput] = React.useState(
    queryParams.national_id || "",
  );
  const [campSearchInput, setCampSearchInput] = React.useState("");

  // Debounce search inputs
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (queryParams.search || "")) {
        onQueryChange?.({
          ...queryParams,
          search: searchInput || undefined,
          page: 1,
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (nationalIdInput !== (queryParams.national_id || "")) {
        onQueryChange?.({
          ...queryParams,
          national_id: nationalIdInput || undefined,
          page: 1,
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [nationalIdInput]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true, // Server-side pagination
    manualFiltering: true, // Server-side filtering
    enableRowSelection: true,
    // @ts-ignore
    autoResetRowSelection: false, // Don't reset selection when data (page) changes
    pageCount: meta?.last_page ?? -1,
    getRowId: (row) => row.id.toString(), // Use family ID as row ID
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: (meta?.current_page ?? 1) - 1,
        pageSize: meta?.per_page ?? 10,
      },
    },
  });

  // Persistent selection map to store selected items across pages
  // We need this because table.getSelectedRowModel() only returns rows from the current data
  const [selectedFamiliesMap, setSelectedFamiliesMap] = React.useState<
    Record<string, Family>
  >({});

  // Sync rowSelection and data with selectedFamiliesMap
  React.useEffect(() => {
    const newMap = { ...selectedFamiliesMap };
    let hasChanges = false;

    // 1. Remove items that are no longer in rowSelection
    Object.keys(newMap).forEach((id) => {
      // @ts-ignore - rowSelection is typed as {} by default in the component state
      if (!rowSelection[id]) {
        delete newMap[id];
        hasChanges = true;
      }
    });

    // 2. Add newly selected items from current data
    // We iterate through available data to find the full objects for selected IDs
    data.forEach((family) => {
      const id = family.id.toString();
      // @ts-ignore
      if (rowSelection[id] && !newMap[id]) {
        newMap[id] = family;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setSelectedFamiliesMap(newMap);
    }
  }, [rowSelection, data, selectedFamiliesMap]);

  // Derive selected families list from the map
  const selectedFamilies = React.useMemo(
    () => Object.values(selectedFamiliesMap),
    [selectedFamiliesMap],
  );
  const selectedCount = selectedFamilies.length;

  // Notify parent of selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedFamilies);
    }
  }, [selectedFamilies, onSelectionChange]);

  // Bulk delete dialog state
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);

  // Get selected family IDs for bulk operations
  const selectedFamilyIds = selectedFamilies.map((f) => f.id);

  const handleBulkDeleteSuccess = () => {
    setRowSelection({});
  };

  // Fetch camps for the filter
  const { data: campsData } = useCampNames();
  const camps = campsData?.data || [];

  // Filter camps based on search input
  const filteredCamps = React.useMemo(() => {
    if (!campSearchInput.trim()) return camps;

    const searchLower = campSearchInput.toLowerCase();
    return camps.filter((camp) => {
      const displayName =
        typeof camp.name === "string"
          ? camp.name
          : camp.name?.ar || camp.name?.en || "";
      return displayName.toLowerCase().includes(searchLower);
    });
  }, [camps, campSearchInput]);

  // Fetch medical conditions from API
  const { data: medicalConditionsData } = useMedicalConditions();
  const medicalConditions = medicalConditionsData?.data || [];

  // Fetch marital statuses from API
  const { data: maritalStatusesData } = useMaritalStatuses();
  const maritalStatuses = maritalStatusesData?.data || [];

  // Use translations for age groups
  const tAge = useTranslations("contributions.age_groups");

  // Static age group options
  const ageGroupOptions = React.useMemo(
    () => [
      { id: "newborns", name: tAge("newborns") },
      { id: "infants", name: tAge("infants") },
      { id: "veryEarlyChildhood", name: tAge("veryEarlyChildhood") },
      { id: "toddlers", name: tAge("toddlers") },
      { id: "earlyChildhood", name: tAge("earlyChildhood") },
      { id: "children", name: tAge("children") },
      { id: "adolescents", name: tAge("adolescents") },
      { id: "youth", name: tAge("youth") },
      { id: "youngAdults", name: tAge("youngAdults") },
      { id: "middleAgeAdults", name: tAge("middleAgeAdults") },
      { id: "lateMiddleAge", name: tAge("lateMiddleAge") },
      { id: "seniors", name: tAge("seniors") },
    ],
    [tAge],
  );

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    onQueryChange?.({ ...queryParams, page: newPage });
  };

  const handlePerPageChange = (newPerPage: number) => {
    onQueryChange?.({ ...queryParams, per_page: newPerPage, page: 1 });
  };

  // Filter handlers
  const handleCampChange = (value: string) => {
    const campId = value === "all" ? undefined : value;
    onQueryChange?.({ ...queryParams, camp_id: campId, page: 1 });
  };

  const handleMedicalConditionChange = (value: string) => {
    const condition = value === "all" ? undefined : value;
    onQueryChange?.({ ...queryParams, medical_condition: condition, page: 1 });
  };

  const handleMaritalStatusChange = (value: string) => {
    const status = value === "all" ? undefined : value;
    onQueryChange?.({ ...queryParams, marital_status: status, page: 1 });
  };

  const handleAgeGroupChange = (value: string) => {
    const ageGroup = value === "all" ? undefined : value;
    onQueryChange?.({ ...queryParams, age_group: ageGroup, page: 1 });
  };

  // Export to Excel handlers
  const [isExporting, setIsExporting] = React.useState(false);
  const [isExportingAll, setIsExportingAll] = React.useState(false);

  // Export selected rows only (current page)
  const handleExportSelected = async () => {
    if (selectedFamilies.length === 0) {
      toast.error(
        t("export.no_selection") || "الرجاء تحديد البيانات المراد تصديرها",
      );
      return;
    }

    try {
      setIsExporting(true);
      toast.info(t("export.loading"));

      // Fetch members for each selected family
      const familiesWithMembers = await Promise.all(
        selectedFamilies.map(async (family: Family) => {
          if (family.members && family.members.length > 0) {
            return { family, members: family.members };
          }
          try {
            const membersResponse = await getFamilyMembersApi(family.id);
            return { family, members: membersResponse.data || [] };
          } catch (error) {
            console.error(
              `Error fetching members for family ${family.id}:`,
              error,
            );
            return { family, members: [] };
          }
        }),
      );

      const formattedData =
        formatFamiliesWithMembersForExport(familiesWithMembers);
      const filename = `families_selected_${selectedFamilies.length}_${new Date().toISOString().split("T")[0]}`;

      exportToExcel(formattedData, filename, "Families With Members");
      toast.success(t("export.success") || "تم تصدير البيانات بنجاح");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(tCommon("error_occurred"));
    } finally {
      setIsExporting(false);
    }
  };

  // Export ALL data (all pages)
  const handleExportAll = async () => {
    try {
      setIsExportingAll(true);
      toast.info(t("export.loading_all") || "جاري تحميل جميع البيانات...");

      let familiesToExport: Family[] = [];
      const exportParams = new URLSearchParams();

      // Start with first page to get total count
      exportParams.append("per_page", "1000");
      exportParams.append("page", "1");

      if (queryParams.search) exportParams.append("search", queryParams.search);
      if (queryParams.national_id)
        exportParams.append("national_id", queryParams.national_id);
      if (queryParams.camp_id)
        exportParams.append("camp_id", String(queryParams.camp_id));
      if (queryParams.medical_condition)
        exportParams.append("medical_condition", queryParams.medical_condition);
      if (queryParams.marital_status)
        exportParams.append("marital_status", queryParams.marital_status);
      if (queryParams.age_group)
        exportParams.append("age_group", queryParams.age_group);

      // Fetch first page
      const firstResponse = await getFamiliesApi(exportParams.toString());
      if (firstResponse && firstResponse.data) {
        familiesToExport.push(...firstResponse.data);

        // If there are more pages, fetch them
        if (firstResponse.meta && firstResponse.meta.last_page > 1) {
          const totalPages = firstResponse.meta.last_page;
          toast.info(`جاري تحميل ${totalPages} صفحات...`);

          // Fetch remaining pages
          const pagePromises = [];
          for (let page = 2; page <= totalPages; page++) {
            const pageParams = new URLSearchParams(exportParams);
            pageParams.set("page", page.toString());
            pagePromises.push(getFamiliesApi(pageParams.toString()));
          }

          const responses = await Promise.all(pagePromises);
          responses.forEach((response) => {
            if (response && response.data) {
              familiesToExport.push(...response.data);
            }
          });
        }
      }

      if (familiesToExport.length === 0) {
        toast.error(t("export.no_data") || "لا توجد بيانات للتصدير");
        return;
      }

      // Fetch members for each family
      const familiesWithMembers = await Promise.all(
        familiesToExport.map(async (family) => {
          if (family.members && family.members.length > 0) {
            return { family, members: family.members };
          }
          try {
            const membersResponse = await getFamilyMembersApi(family.id);
            return { family, members: membersResponse.data || [] };
          } catch (error) {
            console.error(
              `Error fetching members for family ${family.id}:`,
              error,
            );
            return { family, members: [] };
          }
        }),
      );

      const formattedData =
        formatFamiliesWithMembersForExport(familiesWithMembers);
      const filename = `families_all_${familiesToExport.length}_${new Date().toISOString().split("T")[0]}`;

      exportToExcel(formattedData, filename, "Families With Members");
      toast.success(
        `${t("export.success") || "تم تصدير"} ${familiesToExport.length} عائلة بنجاح`,
      );
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(tCommon("error_occurred"));
    } finally {
      setIsExportingAll(false);
    }
  };

  // Legacy handler - kept for backwards compatibility
  const handleExportExcel = async () => {
    if (selectedFamilies.length > 0) {
      await handleExportSelected();
    } else {
      await handleExportAll();
    }
  };

  // Check for column existence safely
  const hasCampColumn = table.getAllColumns().some((col) => col.id === "camp");
  const hasMedicalConditionsColumn = table
    .getAllColumns()
    .some((col) => col.id === "medicalConditions");
  const hasAgeGroupsColumn = table
    .getAllColumns()
    .some((col) => col.id === "ageGroups");

  return (
    <div className="w-full">
      {shouldShowFilters && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 py-4 items-start sm:items-center bg-white p-4 rounded-t-lg border-b">
          {/* Search by National ID */}
          <div className="space-y-2 w-full sm:min-w-[200px] sm:w-auto">
            <label className="text-sm font-medium text-gray-700">
              {t("columns.nationalId")}
            </label>
            <div className="relative w-full">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("columns.nationalId")}
                value={nationalIdInput}
                onChange={(e) => setNationalIdInput(e.target.value)}
                className="pr-10 h-11 w-full"
              />
            </div>
          </div>

          {/* Search by family name */}
          <div className="space-y-2 w-full sm:min-w-[200px] sm:w-auto">
            <label className="text-sm font-medium text-gray-700">
              {t("columns.familyName")}
            </label>
            <div className="relative w-full">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("columns.familyName") + "..."}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pr-10 h-11 w-full"
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            {/* Filter by Camp - only show for admin */}
            {showCampFilter && hasCampColumn && (
              <div className="space-y-2 w-full sm:min-w-[200px] sm:w-auto">
                <label className="text-sm font-medium text-gray-700">
                  {t("columns.camp")}
                </label>
                <Select
                  value={queryParams.camp_id?.toString() || "all"}
                  onValueChange={handleCampChange}
                  onOpenChange={(open) => {
                    if (!open) setCampSearchInput("");
                  }}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder={t("columns.camp")} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Search Input */}
                    <div className="px-2 pb-2 border-b sticky top-0 bg-white z-10">
                      <div className="relative">
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={t("columns.camp") + "..."}
                          value={campSearchInput}
                          onChange={(e) => setCampSearchInput(e.target.value)}
                          className="pr-10 h-9"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    <SelectItem value="all">{tCommon("all")}</SelectItem>
                    {filteredCamps.length > 0 ? (
                      filteredCamps.map((camp) => {
                        const displayName =
                          typeof camp.name === "string"
                            ? camp.name
                            : camp.name?.ar || camp.name?.en || "";
                        return (
                          <SelectItem key={camp.id} value={camp.id.toString()}>
                            {displayName}
                          </SelectItem>
                        );
                      })
                    ) : (
                      <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                        لا توجد نتائج
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Filter by Medical Conditions */}
            {hasMedicalConditionsColumn && (
              <div className="space-y-2 w-full sm:min-w-[250px] sm:w-auto">
                <label className="text-sm font-medium text-gray-700">
                  {t("filters.medicalConditions")}
                </label>
                <Select
                  value={queryParams.medical_condition || "all"}
                  onValueChange={handleMedicalConditionChange}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder={t("filters.medicalConditions")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{tCommon("all")}</SelectItem>
                    {medicalConditions.map((condition) => (
                      <SelectItem key={condition.id} value={condition.name}>
                        {condition.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Filter by Marital Status */}
            <div className="space-y-2 w-full sm:min-w-[200px] sm:w-auto">
              <label className="text-sm font-medium text-gray-700">
                {t("columns.maritalStatus")}
              </label>
              <Select
                value={queryParams.marital_status || "all"}
                onValueChange={handleMaritalStatusChange}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder={t("columns.maritalStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tCommon("all")}</SelectItem>
                  {maritalStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.name}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter by Age Groups */}
            {hasAgeGroupsColumn && (
              <div className="space-y-2 w-full sm:min-w-[200px] sm:w-auto">
                <label className="text-sm font-medium text-gray-700">
                  {t("filters.ageGroups")}
                </label>
                <Select
                  value={queryParams.age_group || "all"}
                  onValueChange={handleAgeGroupChange}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder={t("filters.ageGroups")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{tCommon("all")}</SelectItem>
                    {ageGroupOptions.map((ageGroup) => (
                      <SelectItem key={ageGroup.id} value={ageGroup.id}>
                        {ageGroup.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Bulk Delete Button */}
            {selectedFamilyIds.length > 0 && (
              <div className="flex items-end">
                <Button
                  variant="destructive"
                  size="default"
                  onClick={() => setIsBulkDeleteOpen(true)}
                  className="h-11"
                >
                  <Trash2 className="h-4 w-4 me-2" />
                  {t("bulk_delete.button")} ({selectedFamilyIds.length})
                </Button>
              </div>
            )}

            {/* Export Selected Button - always visible, disabled when no selection */}
            <div className="flex items-end">
              <Button
                variant="outline"
                size="default"
                onClick={handleExportSelected}
                disabled={isExporting || selectedCount === 0}
                className="h-11 gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4" />
                )}
                {t("export_selected") || "تصدير المحدد"}
                {selectedCount > 0 ? ` (${selectedCount})` : ""}
              </Button>
            </div>

            {/* Export All Button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                size="default"
                onClick={handleExportAll}
                disabled={isExportingAll}
                className="h-11 gap-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
              >
                {isExportingAll ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4" />
                )}
                {t("export_all") || "تصدير الكل"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-md border bg-white relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-right">
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
                    <TableCell key={cell.id} className="text-right">
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
                  {tCommon("no_results" as any)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Server-Side Pagination Controls */}
      {meta && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
          <div className="text-sm text-gray-600 text-center sm:text-start">
            {t("pagination.showing")}{" "}
            {(meta.current_page - 1) * meta.per_page + 1} -{" "}
            {Math.min(meta.current_page * meta.per_page, meta.total)}{" "}
            {t("pagination.of")} {meta.total}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
            {/* Per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {t("pagination.per_page")}:
              </span>
              <Select
                value={meta.per_page.toString()}
                onValueChange={(value) => handlePerPageChange(Number(value))}
              >
                <SelectTrigger className="w-[80px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.current_page - 1)}
                disabled={meta.current_page <= 1 || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <span className="text-sm text-gray-600">
                {t("pagination.page")} {meta.current_page} {t("pagination.of")}{" "}
                {meta.last_page}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.current_page + 1)}
                disabled={meta.current_page >= meta.last_page || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Dialog */}
      <BulkDeleteDialog
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        selectedFamilyIds={selectedFamilyIds}
        onSuccess={handleBulkDeleteSuccess}
      />
    </div>
  );
}
