"use client";

import { useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  PaginationState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import PaginationControls from "@/src/features/dashboard/components/pagination-controls";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Search, CalendarIcon, X } from "lucide-react";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ActivityTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Filter data by date range
  const filteredData = useMemo(() => {
    if (!dateRange.from && !dateRange.to) return data;

    return data.filter((item: any) => {
      const itemDate = new Date(item.created_at);
      if (dateRange.from && dateRange.to) {
        return isWithinInterval(itemDate, {
          start: startOfDay(dateRange.from),
          end: endOfDay(dateRange.to),
        });
      }
      if (dateRange.from) {
        return itemDate >= startOfDay(dateRange.from);
      }
      if (dateRange.to) {
        return itemDate <= endOfDay(dateRange.to);
      }
      return true;
    });
  }, [data, dateRange]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
  });

  const clearDateFilter = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  const clearAllFilters = () => {
    setGlobalFilter("");
    setDateRange({ from: undefined, to: undefined });
  };

  const hasActiveFilters = globalFilter || dateRange.from || dateRange.to;

  return (
    <div className="space-y-4">
      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Text Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="ابحث في النشاطات..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pr-9"
          />
        </div>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-right font-normal min-w-[280px]",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="ml-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy", { locale: ar })} -{" "}
                    {format(dateRange.to, "dd/MM/yyyy", { locale: ar })}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yyyy", { locale: ar })
                )
              ) : (
                <span>اختر نطاق التاريخ</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) =>
                setDateRange({ from: range?.from, to: range?.to })
              }
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="destructive"
            size="sm"
            onClick={clearAllFilters}
            className="h-9 px-3"
          >
            <X className="h-4 w-4 ml-1" />
            مسح الكل
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-right">
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  لا توجد نشاطات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center px-2">
        <PaginationControls table={table} />
      </div>
    </div>
  );
}
