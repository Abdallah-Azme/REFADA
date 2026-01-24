"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
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
import PaginationControls from "@/features/dashboard/components/pagination-controls";
import { Search, Trash2 } from "lucide-react";
import { Family } from "../types/family.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/ui/select";
import { useMedicalConditions } from "@/features/medical-condition/hooks/use-medical-condition";
import { Button } from "@/src/shared/ui/button";
import { BulkDeleteDialog } from "./bulk-delete-dialog";

interface FamilyTableProps {
  data: Family[];
  columns: ColumnDef<Family>[];
  onSelectionChange?: (selectedRows: Family[]) => void;
  showCampFilter?: boolean;
}

export function FamilyTable({
  data,
  columns,
  onSelectionChange,
  showCampFilter = true,
}: FamilyTableProps) {
  const t = useTranslations("families_page");
  const tCommon = useTranslations("common");
  // console.log("data", data, { columns });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Pagination state
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
    // Clear row selection after successful delete
    setRowSelection({});
  };

  // Derive unique camps for the filter
  const uniqueCamps = React.useMemo(() => {
    // Filter out undefined, null or empty strings if necessary
    const camps = data
      .map((family) => family.camp)
      .filter((camp): camp is string => !!camp && camp !== "undefined");
    return Array.from(new Set(camps));
  }, [data]);

  // Fetch medical conditions from API
  const { data: medicalConditionsData } = useMedicalConditions();
  const medicalConditions = medicalConditionsData?.data || [];

  // Use translations for age groups
  const tAge = useTranslations("contributions.age_groups");

  // Static age group options (same as contribute-dialog)
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

  // Check for column existence safely to avoid console errors
  const hasCampColumn = table.getAllColumns().some((col) => col.id === "camp");
  const hasMedicalConditionsColumn = table
    .getAllColumns()
    .some((col) => col.id === "medicalConditions");
  const hasAgeGroupsColumn = table
    .getAllColumns()
    .some((col) => col.id === "ageGroups");

  return (
    <div className="w-full">
      <div className="flex gap-4 py-4 items-center bg-white p-4 rounded-t-lg border-b">
        {/* Search by National ID */}
        <div className="space-y-2 min-w-[200px]">
          <label className="text-sm font-medium text-gray-700">
            {t("columns.nationalId")}
          </label>
          <div className="relative w-full">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("columns.nationalId")}
              value={
                (table.getColumn("nationalId")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("nationalId")
                  ?.setFilterValue(event.target.value)
              }
              className="pr-10 h-11"
            />
          </div>
        </div>

        {/* Search by family name */}
        <div className="space-y-2 min-w-[200px]">
          <label className="text-sm font-medium text-gray-700">
            {t("columns.familyName")}
          </label>
          <div className="relative w-full">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("columns.familyName") + "..."}
              value={
                (table.getColumn("familyName")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("familyName")
                  ?.setFilterValue(event.target.value)
              }
              className="pr-10 h-11"
            />
          </div>
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap gap-4">
          {/* Filter by Camp - only show for admin */}
          {showCampFilter && hasCampColumn && (
            <div className="space-y-2 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700">
                {t("columns.camp")}
              </label>
              <Select
                value={
                  (table.getColumn("camp")?.getFilterValue() as string) || "all"
                }
                onValueChange={(value) =>
                  table
                    .getColumn("camp")
                    ?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={t("columns.camp")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tCommon("all")}</SelectItem>
                  {uniqueCamps.map((camp) => (
                    <SelectItem key={camp} value={camp}>
                      {camp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Filter by Medical Conditions */}
          {hasMedicalConditionsColumn && (
            <div className="space-y-2 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700">
                {t("filters.medicalConditions")}
              </label>
              <Select
                value={
                  (table
                    .getColumn("medicalConditions")
                    ?.getFilterValue() as string) || "all"
                }
                onValueChange={(value) =>
                  table
                    .getColumn("medicalConditions")
                    ?.setFilterValue(value === "all" ? "" : value)
                }
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
            <div className="space-y-2 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700">
                {t("filters.ageGroups")}
              </label>
              <Select
                value={
                  (table.getColumn("ageGroups")?.getFilterValue() as string) ||
                  "all"
                }
                onValueChange={(value) =>
                  table
                    .getColumn("ageGroups")
                    ?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="h-11">
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
      <div className="rounded-md border bg-white">
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <PaginationControls table={table} />
      </div>

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
