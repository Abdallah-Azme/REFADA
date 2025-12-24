"use client";

import { useState } from "react";
import { Loader2, Users } from "lucide-react";
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
import { useTranslations } from "next-intl";

export default function RepresentativeFamiliesPage() {
  const t = useTranslations("families");
  const { data: response, isLoading, error } = useFamilies();
  const deleteMutation = useDeleteFamily();

  const [formOpen, setFormOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewingFamily, setViewingFamily] = useState<Family | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingFamily, setDeletingFamily] = useState<Family | null>(null);

  const families = response?.data ?? [];

  const handleEdit = (family: Family) => {
    setEditingFamily(family);
    setFormOpen(true);
  };

  const handleView = (family: Family) => {
    setViewingFamily(family);
    setViewOpen(true);
  };

  const handleDelete = (family: Family) => {
    setDeletingFamily(family);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingFamily) {
      deleteMutation.mutate(deletingFamily.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setDeletingFamily(null);
        },
      });
    }
  };

  const columns = createFamilyColumns(handleView, handleEdit, handleDelete, {
    hideDelete: true,
  });

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <MainHeader header={t("page_title")}>
          <Users className="text-primary" />
        </MainHeader>

        <AddFamilyDialog />
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
          <FamilyTable data={families} columns={columns} />
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
        title="حذف العائلة"
        description={`هل أنت متأكد من حذف عائلة "${deletingFamily?.familyName}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
