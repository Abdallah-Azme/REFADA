"use client";

import { useState } from "react";
import { usePaginatedCamps } from "@/features/camps/hooks/use-camps";
import CampsPageClient from "@/components/pages/camps/camps-page-client";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Page() {
  const [page, setPage] = useState(1);
  const {
    data: campsData,
    isLoading,
    isFetching,
    isError,
  } = usePaginatedCamps(page, 12); // 12 camps per page for grid layout

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 relative">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mr-3 text-gray-600">جاري تحميل الإيواءات...</span>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="container mx-auto px-4 relative">
        <div className="text-center py-20">
          <p className="text-red-500">حدث خطأ أثناء تحميل البيانات</p>
        </div>
      </section>
    );
  }

  const camps = campsData?.data || [];
  const meta = campsData?.meta;

  const renderPaginationItems = () => {
    if (!meta) return null;
    const totalPages = meta.last_page;
    const currentPage = meta.current_page;
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          isActive={currentPage === 1}
          onClick={() => setPage(1)}
          className="cursor-pointer"
        >
          1
        </PaginationLink>
      </PaginationItem>,
    );

    // Show dots after first page if we are far from it
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => setPage(i)}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    // Show dots before last page if we are far from it
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Always show last page if different from first
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => setPage(totalPages)}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <div>
      <div className="relative">
        {/* Loading Overlay */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-white/50 z-50 flex items-start justify-center pt-20 backdrop-blur-[1px]">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          </div>
        )}
        <CampsPageClient camps={camps} />
      </div>

      {/* Pagination Controls */}
      {meta && meta.last_page > 1 && (
        <div className="container mx-auto px-4 py-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={`gap-1 px-2.5 cursor-pointer ${
                    page === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                  size="default"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span>السابق</span>
                </PaginationLink>
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationLink
                  onClick={() =>
                    setPage((p) => Math.min(meta.last_page, p + 1))
                  }
                  className={`gap-1 px-2.5 cursor-pointer ${
                    page === meta.last_page
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                  size="default"
                >
                  <span>التالي</span>
                  <ChevronLeft className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
