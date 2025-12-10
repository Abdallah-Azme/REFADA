"use client";

import { useState } from "react";
import { Button } from "@/src/shared/ui/button";
import { Dialog, DialogTrigger } from "@/src/shared/ui/dialog";
import { Plus, Tent, Loader2 } from "lucide-react";
import MainHeader from "@/src/shared/components/main-header";
import {
  CampFormDialog,
  CampsTable,
  Camp,
  CampFormValues,
  useCamps,
  useCreateCamp,
  useUpdateCamp,
  useDeleteCamp,
  CampDetailsDialog,
  useCampDetails,
} from "@/features/camps";
import { DeleteConfirmDialog } from "@/features/marital-status";

export default function AdminCampsPage() {
  const { data, isLoading, error } = useCamps();
  const createCamp = useCreateCamp();
  const updateCamp = useUpdateCamp();
  const deleteCamp = useDeleteCamp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState<Camp | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCamp, setDeletingCamp] = useState<Camp | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingSlug, setViewingSlug] = useState<string | null>(null);

  const { data: campDetails, isLoading: isLoadingDetails } =
    useCampDetails(viewingSlug);

  const camps = data?.data || [];

  const handleOpenDialog = (camp?: Camp) => {
    if (camp) {
      setEditingCamp(camp);
    } else {
      setEditingCamp(null);
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: CampFormValues) => {
    if (editingCamp && editingCamp.slug) {
      // Update existing camp
      updateCamp.mutate(
        { slug: editingCamp.slug, data },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingCamp(null);
          },
        }
      );
    } else {
      // Create new camp
      createCamp.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    }
  };

  const handleDeleteCamp = (slug: string) => {
    const camp = camps.find((c) => c.slug === slug);
    if (camp) {
      setDeletingCamp(camp);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingCamp && deletingCamp.slug) {
      deleteCamp.mutate(deletingCamp.slug, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeletingCamp(null);
        },
      });
    }
  };

  const handleToggleStatus = (slug: string) => {
    // TODO: Implement toggle status API call
    console.log("Toggle status for camp:", slug);
  };

  const handleViewCamp = (camp: Camp) => {
    if (camp.slug) {
      setViewingSlug(camp.slug);
      setViewDialogOpen(true);
    }
  };

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <MainHeader header="إدارة الإيواءات">
          <Tent className="text-primary" />
        </MainHeader>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة إيواء جديد
            </Button>
          </DialogTrigger>
          <CampFormDialog
            initialData={editingCamp}
            onSubmit={onSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </div>

      {/* Admin Camps Table - styled like representative page */}
      <div className="w-full bg-white rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          قائمة الإيواءات
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-3 text-gray-600">جاري تحميل البيانات...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
          </div>
        ) : createCamp.isPending ||
          updateCamp.isPending ||
          deleteCamp.isPending ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-3 text-gray-600">جاري معالجة الطلب...</span>
          </div>
        ) : (
          <CampsTable
            data={camps}
            onEdit={handleOpenDialog}
            onDelete={handleDeleteCamp}
            onToggleStatus={handleToggleStatus}
            onView={handleViewCamp}
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="حذف الإيواء"
        description="هل أنت متأكد من حذف هذا الإيواء؟ هذا الإجراء لا يمكن التراجع عنه."
        isPending={deleteCamp.isPending}
      />

      {/* View Details Dialog */}
      <CampDetailsDialog
        open={viewDialogOpen}
        onOpenChange={(open) => {
          setViewDialogOpen(open);
          if (!open) setViewingSlug(null);
        }}
        camp={campDetails?.data || null}
        isLoading={isLoadingDetails}
      />
    </div>
  );
}
