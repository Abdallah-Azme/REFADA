"use client";

import { useState } from "react";
import { Button } from "@/src/shared/ui/button";
import { Plus, Users, Loader2, Download } from "lucide-react";
import MainHeader from "@/src/shared/components/main-header";
import {
  FamilyTable,
  createFamilyColumns,
  Family,
  useFamilies,
  useDeleteFamily,
} from "@/features/families";
import EditFamilyDialog from "@/features/families/components/edit-family-dialog";
import FamilyDetailsDialog from "@/features/families/components/family-details-dialog";
import { DeleteConfirmDialog } from "@/features/marital-status";
import AddFamilyDialog from "@/src/features/dashboard/components/add-family-dialog";
import { exportToExcel, formatFamiliesForExport } from "@/src/lib/export-utils";

import { useTranslations } from "next-intl";

export default function AdminFamiliesPage() {
  const t = useTranslations("families");
  const { data: response, isLoading, error } = useFamilies();
  const deleteMutation = useDeleteFamily();

  // State
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  const [viewingFamily, setViewingFamily] = useState<Family | null>(null);
  const [deletingFamily, setDeletingFamily] = useState<Family | null>(null);
  const [selectedFamilies, setSelectedFamilies] = useState<Family[]>([]);

  // Extract families data
  const families = response?.data || [];

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

  const handleExportToExcel = () => {
    // Export selected families if any are selected, otherwise export all
    const familiesToExport =
      selectedFamilies.length > 0 ? selectedFamilies : families;
    const formattedData = formatFamiliesForExport(familiesToExport);
    const filename =
      selectedFamilies.length > 0
        ? `families_export_${selectedFamilies.length}_selected`
        : "families_export_all";
    exportToExcel(formattedData, filename, "Families");
  };

  const columns = createFamilyColumns(handleView, handleEdit, handleDelete, t);

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <MainHeader header={t("page_title")}>
          <Users className="text-primary" />
        </MainHeader>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportToExcel}
            disabled={families.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {selectedFamilies.length > 0
              ? `${t("export_to_excel")} (${selectedFamilies.length})`
              : t("export_to_excel")}
          </Button>
          <AddFamilyDialog />
        </div>
      </div>

      {/* Content */}
      <div className="w-full bg-white rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {t("list_title")}
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-3 text-gray-600">{t("loading_data")}</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-600">{t("error_loading")}</p>
          </div>
        ) : (
          <FamilyTable
            data={families}
            columns={columns}
            onSelectionChange={setSelectedFamilies}
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
    </div>
  );
}
