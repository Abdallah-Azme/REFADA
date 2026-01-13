"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Loader2, Plus } from "lucide-react";
import MainHeader from "@/shared/components/main-header";
import {
  useMedicalConditions,
  useCreateMedicalCondition,
  useUpdateMedicalCondition,
  useDeleteMedicalCondition,
} from "../hooks/use-medical-condition";
import {
  MedicalCondition,
  MedicalConditionFormValues,
} from "../types/medical-condition.schema";
import { MedicalConditionTable } from "./medical-condition-table";
import { createMedicalConditionColumns } from "./medical-condition-columns";
import { MedicalConditionFormDialog } from "./medical-condition-form-dialog";
import { DeleteConfirmDialog } from "@/features/marital-status/components/delete-confirm-dialog";

export default function MedicalConditionPage() {
  const t = useTranslations("medical_condition_page");
  const tCommon = useTranslations("common");

  const { data, isLoading, error } = useMedicalConditions();
  const createMutation = useCreateMedicalCondition();
  const updateMutation = useUpdateMedicalCondition();
  const deleteMutation = useDeleteMedicalCondition();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCondition, setEditingCondition] =
    useState<MedicalCondition | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Safely access data
  const medicalConditions = data?.data || [];

  const handleOpenDialog = (condition?: MedicalCondition) => {
    if (condition) {
      setEditingCondition(condition);
    } else {
      setEditingCondition(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCondition(null);
  };

  const handleSubmit = (formData: MedicalConditionFormValues) => {
    if (editingCondition) {
      updateMutation.mutate(
        { id: editingCondition.id, data: formData },
        {
          onSuccess: () => {
            handleCloseDialog();
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          handleCloseDialog();
        },
      });
    }
  };

  const handleEdit = (condition: MedicalCondition) => {
    handleOpenDialog(condition);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => {
          setDeletingId(null);
        },
      });
    }
  };

  const columns = createMedicalConditionColumns(handleEdit, handleDelete, t);

  return (
    <div className="space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <MainHeader header={t("title")} subheader={t("list_title")}>
          {/* Activity icon removed or imported from lucide if needed, using Plus for now or generic icon */}
        </MainHeader>

        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          {t("add")}
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
              <p className="text-red-600">{tCommon("toast.loading_error")}</p>
            </div>
          ) : (
            <MedicalConditionTable columns={columns} data={medicalConditions} />
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <MedicalConditionFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingCondition}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title={t("delete_title")}
        description={t("delete_desc")}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
