"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Loader2, Plus, Activity } from "lucide-react";
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
import { DeleteConfirmDialog } from "@/features/marital-status";

export default function MedicalConditionPage() {
  const { data, isLoading, error } = useMedicalConditions();
  const createMutation = useCreateMedicalCondition();
  const updateMutation = useUpdateMedicalCondition();
  const deleteMutation = useDeleteMedicalCondition();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCondition, setEditingCondition] =
    useState<MedicalCondition | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

  const columns = createMedicalConditionColumns(handleOpenDialog, handleDelete);

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <MainHeader header="إدارة الحالات الطبية">
          <Activity className="text-primary" />
        </MainHeader>

        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          إضافة حالة طبية
        </Button>
      </div>

      {/* Table Card */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>قائمة الحالات الطبية</CardTitle>
        </CardHeader>
        <CardContent>
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
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="حذف الحالة الطبية"
        description="هل أنت متأكد من حذف هذه الحالة الطبية؟ هذا الإجراء لا يمكن التراجع عنه."
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
