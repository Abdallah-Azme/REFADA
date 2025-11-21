"use client";

import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PaginationControls<T>({ table }: { table: Table<T> }) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <div className="flex w-fit gap-3 items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm">
      {/* ----- Rows per page ----- */}
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-600 font-medium">الصفوف لكل صفحة</p>

        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="h-9 w-[80px] bg-white">
            <SelectValue />
          </SelectTrigger>

          <SelectContent align="end">
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ----- Page indicator ----- */}
      <div className="text-sm font-medium text-gray-700">
        صفحة {pageIndex + 1} من {pageCount}
      </div>

      {/* ----- Controls ----- */}
      <div className="flex items-center gap-2">
        {/* First */}
        <Button
          variant="outline"
          size="icon"
          className="hidden lg:flex h-9 w-9"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>

        {/* Prev */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Last */}
        <Button
          variant="outline"
          size="icon"
          className="hidden lg:flex h-9 w-9"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
