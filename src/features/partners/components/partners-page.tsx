"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Loader2, Plus, Users } from "lucide-react";
import MainHeader from "@/shared/components/main-header";
import { Button } from "@/shared/ui/button";
import {
  usePartners,
  useCreatePartner,
  useUpdatePartner,
  useDeletePartner,
  usePartner,
} from "../hooks/use-partners";
import { Partner, PartnerFormValues } from "../types/partner.schema";
import { PartnerTable } from "./partner-table";
import { createPartnerColumns } from "./partner-columns";
import { PartnerViewDialog } from "./partner-view-dialog";
import { PartnerFormDialog } from "./partner-form-dialog";
import { DeleteConfirmDialog } from "@/features/marital-status";
import { useTranslations } from "next-intl";

export default function PartnersPage() {
  const t = useTranslations("partners_page");
  const tCommon = useTranslations("common");
  const { data, isLoading, error } = usePartners();
  const createMutation = useCreatePartner();
  const updateMutation = useUpdatePartner();
  const deleteMutation = useDeletePartner();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingPartner, setViewingPartner] = useState<Partner | null>(null);

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch single partner for editing
  const { data: editingData } = usePartner(editingId as number);

  const partners = data?.data || [];

  const handleView = (partner: Partner) => {
    setViewingPartner(partner);
    setViewDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setEditingId(partner.id);
    setFormDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeletingId(null);
        },
      });
    }
  };

  const handleSubmitForm = (values: PartnerFormValues) => {
    if (editingId) {
      updateMutation.mutate(
        { id: editingId, data: values },
        {
          onSuccess: () => {
            setFormDialogOpen(false);
            setEditingId(null);
          },
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          setFormDialogOpen(false);
        },
      });
    }
  };

  const handleFormDialogChange = (open: boolean) => {
    setFormDialogOpen(open);
    if (!open) {
      setEditingId(null);
    }
  };

  // We need to pass translation function to columns creator to translate headers
  const columns = createPartnerColumns(handleView, handleEdit, handleDelete, t);

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <MainHeader header={t("page_title")}>
          <Users className="text-primary" />
        </MainHeader>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 ml-2" />
          {t("add_partner")}
        </Button>
      </div>

      {/* Table Card */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>{t("list_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="mr-3 text-gray-600">{tCommon("loading")}</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-600">{tCommon("error_loading")}</p>
            </div>
          ) : (
            <PartnerTable columns={columns} data={partners} />
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <PartnerViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        partner={viewingPartner}
      />

      {/* Form Dialog (Create/Edit) */}
      <PartnerFormDialog
        open={formDialogOpen}
        onOpenChange={handleFormDialogChange}
        onSubmit={handleSubmitForm}
        initialData={editingId ? editingData?.data : undefined}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={t("delete_dialog.title")}
        description={t("delete_dialog.description")}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
