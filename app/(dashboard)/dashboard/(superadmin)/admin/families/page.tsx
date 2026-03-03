"use client";

import { useState } from "react";
import { Button } from "@/src/shared/ui/button";
import {
  Users,
  Loader2,
  FileSpreadsheet,
  Download,
  Upload,
} from "lucide-react";
import MainHeader from "@/src/shared/components/main-header";
import {
  FamilyTable,
  createFamilyColumns,
  Family,
  useFamilies,
  useDeleteFamily,
  FamiliesQueryParams,
  DEFAULT_FAMILIES_QUERY,
} from "@/features/families";
import EditFamilyDialog from "@/features/families/components/edit-family-dialog";
import FamilyDetailsDialog from "@/features/families/components/family-details-dialog";
import { DeleteConfirmDialog } from "@/features/marital-status";
import AddFamilyDialog from "@/src/features/dashboard/components/add-family-dialog";
import {
  ExportTypeDialog,
  ExportMode,
} from "@/features/families/components/export-type-dialog";
import { useFamilyExcelExport } from "@/features/families/hooks/use-family-excel-export";
import { useFamilyExcelImport } from "@/features/families/hooks/use-family-excel-import";
import { ImportFamiliesDialog } from "@/features/families/components/import-families-dialog";
import { useTranslations } from "next-intl";

export default function AdminFamiliesPage() {
  const t = useTranslations("families");

  // Query params state for server-side filtering/pagination
  const [queryParams, setQueryParams] = useState<FamiliesQueryParams>(
    DEFAULT_FAMILIES_QUERY,
  );

  const {
    data: response,
    isLoading,
    error,
    isFetching,
  } = useFamilies(queryParams);

  const deleteMutation = useDeleteFamily();

  // State
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  const [viewingFamily, setViewingFamily] = useState<Family | null>(null);
  const [deletingFamily, setDeletingFamily] = useState<Family | null>(null);
  const [selectedFamilies, setSelectedFamilies] = useState<Family[]>([]);

  // Excel export hook
  const { handleExport, isExporting } = useFamilyExcelExport({
    queryParams,
    selectedFamilies,
  });

  // Excel import hook
  const { handleDownloadTemplate } = useFamilyExcelImport();

  // Extract families data and meta
  const families = response?.data || [];
  const meta = response?.meta;

  // Handlers
  const handleView = (family: Family) => {
    setViewingFamily(family);
    setViewOpen(true);
  };

  const handleEdit = (family: Family) => {
    setEditingFamily(family);
    setFormOpen(true);
  };

  const handleDelete = (family: Family) => {
    setDeletingFamily(family);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingFamily?.id) {
      deleteMutation.mutate(deletingFamily.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setDeletingFamily(null);
        },
      });
    }
  };

  const handleQueryChange = (newParams: FamiliesQueryParams) => {
    setQueryParams(newParams);
  };

  const handleExportDialogConfirm = async (mode: ExportMode) => {
    await handleExport(mode);
    setExportDialogOpen(false);
  };

  const columns = createFamilyColumns(handleView, handleEdit, handleDelete, t);

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <MainHeader header={t("page_title")}>
          <Users className="text-primary" />
        </MainHeader>

        <div className="flex flex-col sm:flex-row gap-2">
          {/* ── Download Template ─────────────────────────────────────── */}
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 border-purple-200"
          >
            <Download className="h-4 w-4" />
            تحميل النموذج
          </Button>

          {/* ── Upload Excel ──────────────────────────────────────────── */}
          <Button
            variant="outline"
            onClick={() => setImportDialogOpen(true)}
            className="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200"
          >
            <Upload className="h-4 w-4" />
            استيراد Excel
          </Button>

          {/* ── Export ───────────────────────────────────────────────── */}
          <Button
            variant="outline"
            onClick={() => setExportDialogOpen(true)}
            disabled={families.length === 0 || isExporting}
            className="flex items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("exporting") || "جاري التصدير..."}
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-4 w-4" />
                {selectedFamilies.length > 0
                  ? `تصدير إلى Excel (${selectedFamilies.length})`
                  : "تصدير إلى Excel"}
              </>
            )}
          </Button>

          <AddFamilyDialog />
        </div>
      </div>

      {/* Content */}
      <div className="w-full bg-white rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {t("list_title")}
        </h3>

        {error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-600">{t("error_loading")}</p>
          </div>
        ) : (
          <FamilyTable
            data={families}
            columns={columns}
            onSelectionChange={setSelectedFamilies}
            queryParams={queryParams}
            onQueryChange={handleQueryChange}
            meta={meta}
            isLoading={isLoading || isFetching}
          />
        )}
      </div>

      {/* Dialogs */}
      <EditFamilyDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        family={editingFamily}
      />

      <FamilyDetailsDialog
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        family={viewingFamily}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title={t("delete_title")}
        description={t("delete_description", {
          name: deletingFamily?.familyName || "",
        })}
        isPending={deleteMutation.isPending}
      />

      {/* Excel Export Type Dialog */}
      <ExportTypeDialog
        isOpen={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        onConfirm={handleExportDialogConfirm}
        isExporting={isExporting}
      />

      {/* Excel Import Dialog */}
      <ImportFamiliesDialog
        isOpen={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
      />
    </div>
  );
}
