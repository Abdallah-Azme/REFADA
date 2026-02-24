import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import { createPendingDelegatesColumns } from "../table-cols/admin-representatives-cols";
import { PendingUser } from "@/features/representatives/types/pending-users.schema";

interface UseAdminRepresentativesTableProps {
  data: PendingUser[];
  onApprove: (user: PendingUser) => void;
  onReject: (user: PendingUser) => void;
  onDelete: (user: PendingUser) => void;
  onChangePassword: (user: PendingUser) => void;
  t: any;
  campFilter?: string;
  setCampFilter?: (value: string) => void;
  validDelegateNames?: string[] | null;
}

export const useAdminRepresentativesTable = ({
  data,
  onApprove,
  onReject,
  onDelete,
  onChangePassword,
  t,
  campFilter: providedCampFilter,
  setCampFilter: providedSetCampFilter,
  validDelegateNames,
}: UseAdminRepresentativesTableProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Filter state
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Use passed state or local state for backward compatibility if needed
  const [localCampFilter, setLocalCampFilter] = React.useState("all");
  const campFilter =
    providedCampFilter !== undefined ? providedCampFilter : localCampFilter;
  const setCampFilter = providedSetCampFilter || setLocalCampFilter;

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Update filters when controls change
  React.useEffect(() => {
    setColumnFilters((prev) => {
      const next = prev.filter(
        (filter) => filter.id !== "status" && filter.id !== "campName",
      );
      if (statusFilter !== "all") {
        next.push({ id: "status", value: statusFilter });
      }
      if (campFilter !== "all") {
        next.push({ id: "campName", value: campFilter });
      }
      return next;
    });
  }, [statusFilter, campFilter]);

  const table = useReactTable<PendingUser>({
    data,
    columns: createPendingDelegatesColumns(
      {
        onApprove,
        onReject,
        onDelete,
        onChangePassword,
      },
      t,
      validDelegateNames,
    ),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      globalFilter,
    },
    // Custom global filter function
    globalFilterFn: (row, columnId, filterValue) => {
      let search = filterValue.toLowerCase().trim();

      if (!search) return true;

      // Remove common prefix if present for better matching
      const prefixesToRemove = ["المخيم ", "مخيم "];
      for (const prefix of prefixesToRemove) {
        if (search.startsWith(prefix)) {
          search = search.substring(prefix.length).trim();
          break;
        }
      }

      const name = (row.getValue("name") as string)?.toLowerCase() || "";
      const email = (row.getValue("email") as string)?.toLowerCase() || "";
      const phone = (row.getValue("phone") as string)?.toLowerCase() || "";
      const idNumber =
        (row.getValue("idNumber") as string)?.toLowerCase() || "";
      const campName =
        (row.getValue("campName") as string)?.toLowerCase() || "";

      return (
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        idNumber.includes(search) ||
        campName.includes(search) ||
        (search && campName && search.includes(campName))
      );
    },
  });

  return {
    table,
    globalFilter,
    setGlobalFilter,
    statusFilter,
    setStatusFilter,
    campFilter,
    setCampFilter,
  };
};
