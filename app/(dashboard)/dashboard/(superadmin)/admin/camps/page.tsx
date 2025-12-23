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
import { useTranslations } from "next-intl";

export default function AdminCampsPage() {
  const t = useTranslations("adminCamps");
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
    console.log("[DEBUG] handleOpenDialog called with camp:", camp);
    if (camp) {
      console.log("[DEBUG] Setting editingCamp to:", camp);
      setEditingCamp(camp);
    } else {
      console.log("[DEBUG] Setting editingCamp to null (new camp mode)");
      setEditingCamp(null);
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: CampFormValues) => {
    console.log("[DEBUG] onSubmit called with data:", data);
    console.log("[DEBUG] editingCamp:", editingCamp);
    console.log("[DEBUG] editingCamp.slug:", editingCamp?.slug);
    if (editingCamp && editingCamp.slug) {
      // Update existing camp
      console.log("[DEBUG] Updating camp with slug:", editingCamp.slug);
      updateCamp.mutate(
        { slug: editingCamp.slug, data },
        {
          onSuccess: () => {
            console.log("[DEBUG] Update successful!");
            setIsDialogOpen(false);
            setEditingCamp(null);
          },
          onError: (error) => {
            console.error("[DEBUG] Update failed with error:", error);
          },
        }
      );
    } else {
      // Create new camp
      console.log("[DEBUG] Creating new camp");
      createCamp.mutate(data, {
        onSuccess: () => {
          console.log("[DEBUG] Create successful!");
          setIsDialogOpen(false);
        },
        onError: (error) => {
          console.error("[DEBUG] Create failed with error:", error);
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
        <MainHeader header={t("pageTitle")}>
          <Tent className="text-primary" />
        </MainHeader>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              {t("addNewCamp")}
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
          {t("campsList")}
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-3 text-gray-600">{t("loadingData")}</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-600">{t("errorLoadingData")}</p>
          </div>
        ) : createCamp.isPending ||
          updateCamp.isPending ||
          deleteCamp.isPending ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-3 text-gray-600">{t("processingRequest")}</span>
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
        title={t("deleteCamp")}
        description={t("deleteConfirmation")}
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
