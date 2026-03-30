import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getFamiliesApi } from "../api/families.api";
import { Family } from "../types/family.schema";
import { FamiliesQueryParams } from "../types/families-query.types";
import {
  formatFamiliesWithoutChildren,
  formatFamiliesWithAllMembers,
  downloadStyledExcel,
} from "../services/family-excel-export.service";
import { ExportMode } from "../components/export-type-dialog";

// ---------------------------------------------------------------------------
// The /families endpoint already returns `members` inside each family object.
// So the entire export only needs paginated GET /families calls — NO per-family
// member requests at all. This reduces N+1 API calls to just a handful of pages.
// ---------------------------------------------------------------------------

const EXPORT_PAGE_SIZE = 500; // families per page request

interface UseFamilyExcelExportOptions {
  queryParams?: FamiliesQueryParams;
  selectedFamilies?: Family[];
}

export function useFamilyExcelExport({
  queryParams = {},
  selectedFamilies = [],
}: UseFamilyExcelExportOptions) {
  const [isExporting, setIsExporting] = useState(false);
  const t = useTranslations("families");

  // -------------------------------------------------------------------------
  // Fetch ALL families (all pages) — members are already embedded in each row.
  // Pages are fetched in parallel after we know last_page from page 1.
  // -------------------------------------------------------------------------
  const fetchAllFamiliesWithMembers = async (): Promise<Family[]> => {
    const base = new URLSearchParams();
    base.set("per_page", String(EXPORT_PAGE_SIZE));
    base.set("page", "1");

    // Forward active filters
    const params = queryParams as Record<string, any>;
    if (params.search) base.set("search", params.search);
    if (params.national_id) base.set("national_id", params.national_id);
    if (params.camp_id) base.set("camp_id", String(params.camp_id));
    if (params.medical_condition)
      base.set("medical_condition", params.medical_condition);
    if (params.marital_status)
      base.set("marital_status", params.marital_status);
    if (params.age_group) base.set("age_group", params.age_group);

    // Page 1 tells us how many pages exist
    const first = await getFamiliesApi(base.toString());
    const all: Family[] = [...(first?.data ?? [])];
    const lastPage = first?.meta?.last_page ?? 1;

    if (lastPage > 1) {
      // Fetch remaining pages in parallel — each page is one inexpensive request
      const pagePromises = Array.from({ length: lastPage - 1 }, (_, i) => {
        const p = new URLSearchParams(base);
        p.set("page", String(i + 2));
        return getFamiliesApi(p.toString());
      });

      toast.loading(`جاري تحميل الصفحات... 1 / ${lastPage}`, {
        id: "export-pages",
      });

      // Collect as they arrive and update progress
      let pagesLoaded = 1;
      const responses = await Promise.all(
        pagePromises.map((p) =>
          p.then((r) => {
            pagesLoaded++;
            toast.loading(
              `جاري تحميل الصفحات... ${pagesLoaded} / ${lastPage}`,
              { id: "export-pages" },
            );
            return r;
          }),
        ),
      );

      toast.dismiss("export-pages");
      responses.forEach((r) => r?.data && all.push(...r.data));
    }

    return all;
  };

  // -------------------------------------------------------------------------
  // Main export entry point
  // -------------------------------------------------------------------------
  const handleExport = async (mode: ExportMode) => {
    try {
      setIsExporting(true);

      // ---- Step 1: Get families (members already included) ----
      let families: Family[];

      if (selectedFamilies.length > 0) {
        // Selected rows already have members embedded — use them directly
        families = selectedFamilies;
      } else {
        toast.loading(t("toast.loading_all_families"), {
          id: "export-loading",
        });
        families = await fetchAllFamiliesWithMembers();
        toast.dismiss("export-loading");
      }

      if (families.length === 0) {
        toast.warning(t("toast.no_families_to_export"));
        return;
      }

      // ---- Step 2: Format & download (pure in-memory, instant) ----
      const date = new Date().toISOString().split("T")[0];

      if (mode === "without_members") {
        const rows = formatFamiliesWithoutChildren(families);
        downloadStyledExcel(
          rows,
          `families_without_members_${date}`,
          "العائلات",
        );
      } else {
        const rows = formatFamiliesWithAllMembers(families);
        if (rows.length === 0) {
          toast.warning("لا يوجد أفراد لتصديرهم (العائلات تحتوي على زوج وزوجة فقط)");
          return;
        }
        downloadStyledExcel(rows, `families_with_members_${date}`, "الافراد");
      }

      toast.success(
        t("toast.export_success_count", { count: families.length }),
      );
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(t("toast.export_error"));
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExport, isExporting };
}
