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
} from "lucide-react";
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
import { useCamps } from "@/features/camps";
import { Button } from "@/src/shared/ui/button";
import { BulkDeleteDialog } from "./bulk-delete-dialog";

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
  // Server-side pagination props
  queryParams: FamiliesQueryParams;
  onQueryChange: (params: FamiliesQueryParams) => void;
  meta?: PaginationMeta;
  isLoading?: boolean;
}

export function FamilyTable({
  data,
  columns,
  onSelectionChange,
  showCampFilter = true,
  queryParams,
  onQueryChange,
  meta,
  isLoading = false,
}: FamilyTableProps) {
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

  // Debounce search inputs
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (queryParams.search || "")) {
        onQueryChange({
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
        onQueryChange({
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
    pageCount: meta?.last_page ?? -1,
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

  // Notify parent of selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, table]);

  // Bulk delete dialog state
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);

  // Get selected family IDs
  const selectedFamilyIds = React.useMemo(() => {
    return table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id);
  }, [table, rowSelection]);

  const handleBulkDeleteSuccess = () => {
    setRowSelection({});
  };

  // Fetch camps for the filter
  const { data: campsData } = useCamps();
  const camps = campsData?.data || [];

  // Fetch medical conditions from API
  const { data: medicalConditionsData } = useMedicalConditions();
  const medicalConditions = medicalConditionsData?.data || [];

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
    onQueryChange({ ...queryParams, page: newPage });
  };

  const handlePerPageChange = (newPerPage: number) => {
    onQueryChange({ ...queryParams, per_page: newPerPage, page: 1 });
  };

  // Filter handlers
  const handleCampChange = (value: string) => {
    const campId = value === "all" ? undefined : value;
    onQueryChange({ ...queryParams, camp_id: campId, page: 1 });
  };

  const handleMedicalConditionChange = (value: string) => {
    const condition = value === "all" ? undefined : value;
    onQueryChange({ ...queryParams, medical_condition: condition, page: 1 });
  };

  const handleAgeGroupChange = (value: string) => {
    const ageGroup = value === "all" ? undefined : value;
    onQueryChange({ ...queryParams, age_group: ageGroup, page: 1 });
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
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder={t("columns.camp")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tCommon("all")}</SelectItem>
                  {camps.map((camp) => {
                    const displayName =
                      typeof camp.name === "string"
                        ? camp.name
                        : camp.name?.ar || camp.name?.en || "";
                    return (
                      <SelectItem key={camp.id} value={camp.id.toString()}>
                        {displayName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Filter by Medical Conditions */}
          {hasMedicalConditionsColumn && (
            <div className="space-y-2 w-full sm:min-w-[200px] sm:w-auto">
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
        </div>
      </div>

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
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-gray-600">
            {t("pagination.showing")}{" "}
            {(meta.current_page - 1) * meta.per_page + 1} -{" "}
            {Math.min(meta.current_page * meta.per_page, meta.total)}{" "}
            {t("pagination.of")} {meta.total}
          </div>

          <div className="flex items-center gap-4">
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
