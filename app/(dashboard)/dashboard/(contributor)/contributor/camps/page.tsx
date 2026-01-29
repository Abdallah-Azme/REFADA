"use client";

import { useState, Suspense } from "react";
import CampProjects from "@/features/campaign/components/camp-projects";
import { usePaginatedCamps } from "@/features/camps/hooks/use-camps";
import { useGovernorates } from "@/features/dashboard/hooks/use-governorates";
import { Loader2, Filter } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

function ContributorCampsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get params from URL
  const pageParam = Number(searchParams.get("page")) || 1;
  const governorateParam = searchParams.get("governorate_id") || undefined;
  const searchNameParam = searchParams.get("name") || undefined;

  const [page, setPage] = useState(pageParam);

  // Sync state with URL when params change
  if (pageParam !== page) {
    setPage(pageParam);
  }

  // Fetch Governorates
  const { data: governoratesResponse } = useGovernorates();
  const governorates = governoratesResponse?.data || [];

  // Fetch Camps
  const {
    data: campsData,
    isLoading,
    isFetching,
    isError,
  } = usePaginatedCamps(page, 12, searchNameParam, governorateParam);

  // Update URL helper
  const updateUrl = (
    newPage: number,
    newGovId?: string,
    newSearchName?: string,
  ) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    if (newGovId && newGovId !== "all") {
      params.set("governorate_id", newGovId);
    } else {
      params.delete("governorate_id");
    }
    if (newSearchName && newSearchName.trim()) {
      params.set("name", newSearchName.trim());
    } else {
      params.delete("name");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl(newPage, governorateParam, searchNameParam);
  };

  const handleGovernorateChange = (value: string) => {
    const govId = value === "all" ? undefined : value;
    setPage(1); // Reset to page 1 on filter change
    updateUrl(1, govId, searchNameParam);
  };

  const handleSearchNameChange = (value: string) => {
    setPage(1);
    updateUrl(1, governorateParam, value);
  };

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
          onClick={() => handlePageChange(1)}
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
            onClick={() => handlePageChange(i)}
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
            onClick={() => handlePageChange(totalPages)}
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
      <section className="container mx-auto px-4 relative">
        {/* Loading Overlay */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-white/50 z-50 flex items-start justify-center pt-20 backdrop-blur-[1px]">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          </div>
        )}
        <CampProjects
          camps={camps}
          dashboard
          selectedGovernorate={governorateParam}
          onGovernorateChange={handleGovernorateChange}
          selectedSearchName={searchNameParam}
          onSearchNameChange={handleSearchNameChange}
        />
      </section>

      {/* Pagination Controls */}
      {meta && meta.last_page > 1 && (
        <div className="container mx-auto px-4 py-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
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
                    handlePageChange(Math.min(meta.last_page, page + 1))
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

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ContributorCampsContent />
    </Suspense>
  );
}
