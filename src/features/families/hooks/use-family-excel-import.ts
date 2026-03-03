import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  uploadFamiliesExcelApi,
  UploadFamiliesPayload,
} from "../api/families.api";
import {
  parseFamiliesExcel,
  downloadFamiliesTemplate,
} from "../services/family-excel-export.service";

// ---------------------------------------------------------------------------
// useFamilyExcelImport
//
// Provides:
//  • handleDownloadTemplate()  – instantly downloads the filled example .xlsx
//  • handleFileUpload(campId)  – opens a file-picker, parses the chosen sheet,
//                                and POSTs to /families/upload
//  • isUploading               – while the API call is in flight
// ---------------------------------------------------------------------------

export function useFamilyExcelImport() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  // ── Mutation ──────────────────────────────────────────────────────────────
  const uploadMutation = useMutation({
    mutationFn: (payload: UploadFamiliesPayload) =>
      uploadFamiliesExcelApi(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      toast.success(response?.message || "تم استيراد العائلات بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "حدث خطأ أثناء استيراد الملف");
    },
  });

  // ── Template download ─────────────────────────────────────────────────────
  const handleDownloadTemplate = () => {
    try {
      downloadFamiliesTemplate();
      toast.success("تم تحميل النموذج بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء تحميل النموذج");
    }
  };

  // ── File upload ───────────────────────────────────────────────────────────
  /**
   * Open a file picker restricted to Excel files.
   * On file selection the workbook is parsed and sent to the API.
   *
   * @param campId – the camp to associate the imported families with
   */
  const handleFileUpload = (campId: number) => {
    // Create a hidden file input (or reuse the existing one)
    if (!fileInputRef.current) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".xlsx,.xls";
      fileInputRef.current = input;
    }

    const input = fileInputRef.current;

    // Remove previous listener to avoid accumulation
    input.onchange = null;

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      const loadingToastId = "excel-upload-loading";

      try {
        toast.loading("جاري قراءة الملف...", { id: loadingToastId });

        const families = await parseFamiliesExcel(file);

        if (families.length === 0) {
          toast.dismiss(loadingToastId);
          toast.warning("لم يتم العثور على بيانات في الملف");
          return;
        }

        toast.loading(`جاري رفع ${families.length} عائلة إلى الخادم...`, {
          id: loadingToastId,
        });

        await uploadMutation.mutateAsync({ camp_id: campId, families });
      } catch (error: any) {
        toast.error(error?.message || "حدث خطأ أثناء معالجة الملف");
      } finally {
        toast.dismiss(loadingToastId);
        setIsUploading(false);
        // Reset the input so the same file can be re-selected if needed
        input.value = "";
      }
    };

    input.click();
  };

  return {
    handleDownloadTemplate,
    handleFileUpload,
    isUploading: isUploading || uploadMutation.isPending,
  };
}
