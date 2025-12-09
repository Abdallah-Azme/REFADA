"use client";

import { useState } from "react";
import { Button } from "@/src/shared/ui/button";
import { Plus, Users, Loader2 } from "lucide-react";
import MainHeader from "@/src/shared/components/main-header";
import {
  FamilyTable,
  createFamilyColumns,
  Family,
  useFamilies,
  useDeleteFamily,
} from "@/features/families";
import { FamilyFormDialog } from "@/features/families/components/family-form-dialog";
import FamilyDetailsDialog from "@/features/families/components/family-details-dialog";
import { DeleteConfirmDialog } from "@/features/marital-status";

export default function AdminFamiliesPage() {
  const { data: response, isLoading, error } = useFamilies();
  const deleteMutation = useDeleteFamily();

  const [formOpen, setFormOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewingFamily, setViewingFamily] = useState<Family | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingFamily, setDeletingFamily] = useState<Family | null>(null);

  const families = response?.data || [];

  const handleCreate = () => {
    setEditingFamily(null);
    setFormOpen(true);
  };

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

  const columns = createFamilyColumns(handleView, handleEdit, handleDelete);

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <MainHeader header="إدارة العائلات">
          <Users className="text-primary" />
        </MainHeader>

        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          إضافة عائلة جديدة
        </Button>
      </div>

      {/* Content */}
      <div className="w-full bg-white rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">قائمة العائلات</h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-3 text-gray-600">جاري تحميل البيانات...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
          </div>
        ) : (
          <FamilyTable data={families} columns={columns} />
        )}
      </div>

      {/* Dialogs */}
      <FamilyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingFamily}
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
