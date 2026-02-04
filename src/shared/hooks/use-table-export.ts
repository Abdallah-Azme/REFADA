import { useState } from "react";
import { toast } from "sonner";
import {
  exportToExcel,
  exportToExcelWithPagination,
  PaginatedResponse,
} from "@/src/lib/export-utils";

/**
 * Options for the table export hook
 */
export interface UseTableExportOptions<T> {
  /**
   * Function to fetch all data with filters
   * Should accept URLSearchParams string and return paginated response
   */
  fetchAllData: (params: string) => Promise<PaginatedResponse<T>>;

  /**
   * Function to format data for Excel export
   * Transforms raw API data into Excel-friendly format
   */
  formatData: (data: T[]) => any[];

  /**
   * Current filter/query parameters from the table
   */
  queryParams?: Record<string, any>;

  /**
   * Entity name for file naming (e.g., "families", "projects")
   */
  entityName: string;

  /**
   * Optional custom sheet name
   */
  sheetName?: string;

  /**
   * Translation function for messages
   */
  t?: (key: string) => string;
}

/**
 * Progress information for export
 */
export interface ExportProgress {
  current: number;
  total: number;
}

/**
 * Reusable hook for table export functionality
 * Handles both selected rows export and full data export with pagination
 *
 * @example
 * ```tsx
 * const { exportData, isExporting, progress } = useTableExport({
 *   fetchAllData: getFamiliesApi,
 *   formatData: formatFamiliesForExport,
 *   queryParams: { camp_id: 1, search: "test" },
 *   entityName: "families",
 *   t: useTranslations("families_page")
 * });
 *
 * // Export selected rows
 * <Button onClick={() => exportData(selectedRows)}>Export Selected</Button>
 *
 * // Export all filtered data
 * <Button onClick={() => exportData()}>Export All</Button>
 * ```
 */
export function useTableExport<T>({
  fetchAllData,
  formatData,
  queryParams = {},
  entityName,
  sheetName,
  t,
}: UseTableExportOptions<T>) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);

  /**
   * Export data to Excel
   * @param selectedRows - Optional array of selected rows. If provided, only these will be exported.
   *                       If not provided, all filtered data will be fetched and exported.
   */
  const exportData = async (selectedRows?: T[]) => {
    try {
      setIsExporting(true);
      setProgress(null);

      const loadingMessage = t?.("export.loading") || "Preparing export...";
      toast.info(loadingMessage);

      let dataToExport: T[] = [];

      if (selectedRows && selectedRows.length > 0) {
        // Export selected rows only
        dataToExport = selectedRows;
      } else {
        // Fetch all filtered data with pagination
        const baseParams = new URLSearchParams();

        // Add all query parameters to the request
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            baseParams.append(key, String(value));
          }
        });

        // Fetch all data with progress tracking
        const response = await fetchAllData(baseParams.toString());
        dataToExport = response.data || [];
      }

      if (dataToExport.length === 0) {
        const noDataMessage = t?.("export.no_data") || "No data to export";
        toast.warning(noDataMessage);
        return;
      }

      // Format data for Excel
      const formattedData = formatData(dataToExport);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const selectionSuffix =
        selectedRows && selectedRows.length > 0
          ? `_selected_${selectedRows.length}`
          : "_all";
      const filename = `${entityName}_export${selectionSuffix}_${timestamp}`;

      // Export to Excel
      const finalSheetName = sheetName || entityName;
      exportToExcel(formattedData, filename, finalSheetName);

      const successMessage =
        t?.("export.success") ||
        `Successfully exported ${dataToExport.length} records`;
      toast.success(successMessage);
    } catch (error) {
      console.error("Export failed:", error);
      const errorMessage =
        t?.("export.error") || "Export failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsExporting(false);
      setProgress(null);
    }
  };

  /**
   * Export data with pagination support and progress tracking
   * Use this for large datasets that require multiple API calls
   */
  const exportDataWithPagination = async (selectedRows?: T[]) => {
    try {
      setIsExporting(true);
      setProgress(null);

      const loadingMessage = t?.("export.loading") || "Preparing export...";
      toast.info(loadingMessage);

      if (selectedRows && selectedRows.length > 0) {
        // Export selected rows only (no pagination needed)
        const formattedData = formatData(selectedRows);
        const timestamp = new Date().toISOString().split("T")[0];
        const filename = `${entityName}_export_selected_${selectedRows.length}_${timestamp}`;
        const finalSheetName = sheetName || entityName;

        exportToExcel(formattedData, filename, finalSheetName);

        const successMessage =
          t?.("export.success") ||
          `Successfully exported ${selectedRows.length} records`;
        toast.success(successMessage);
      } else {
        // Fetch all filtered data with pagination
        const baseParams = new URLSearchParams();

        // Add all query parameters to the request
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            baseParams.append(key, String(value));
          }
        });

        const timestamp = new Date().toISOString().split("T")[0];
        const filename = `${entityName}_export_all_${timestamp}`;
        const finalSheetName = sheetName || entityName;

        // Export with pagination and progress tracking
        await exportToExcelWithPagination(
          fetchAllData,
          formatData,
          baseParams,
          filename,
          finalSheetName,
          (current, total) => {
            setProgress({ current, total });
            if (total > 1) {
              toast.info(`Exporting page ${current} of ${total}...`);
            }
          },
        );

        const successMessage =
          t?.("export.success") || "Export completed successfully";
        toast.success(successMessage);
      }
    } catch (error) {
      console.error("Export failed:", error);
      const errorMessage =
        t?.("export.error") || "Export failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsExporting(false);
      setProgress(null);
    }
  };

  return {
    exportData,
    exportDataWithPagination,
    isExporting,
    progress,
  };
}
