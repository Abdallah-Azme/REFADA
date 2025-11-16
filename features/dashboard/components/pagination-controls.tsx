import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Project } from "./current-projects-table";

export default function PaginationControls<T>({ table }: { table: Table<T> }) {
  return (
    <div className="flex items-center gap-6 lg:gap-8">
      {/* Rows per page selector */}
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">الصفوف لكل صفحة</p>
        <select
          value={`${table.getState().pagination.pageSize}`}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="h-8 w-[70px] rounded-md border border-gray-300 bg-transparent px-2 py-1 text-sm"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>

      {/* Page number display */}
      <div className="flex w-[100px] items-center justify-center text-sm font-medium">
        صفحة {table.getState().pagination.pageIndex + 1} من{" "}
        {table.getPageCount()}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        {/* First page button */}
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">الذهاب للصفحة الأولى</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>

        {/* Previous page button */}
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">الصفحة السابقة</span>
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Next page button */}
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">الصفحة التالية</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Last page button */}
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">الذهاب للصفحة الأخيرة</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
