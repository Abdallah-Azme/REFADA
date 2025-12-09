"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Loader2, Plus, Heart } from "lucide-react";
import MainHeader from "@/shared/components/main-header";
import {
  useMaritalStatuses,
  useCreateMaritalStatus,
  useUpdateMaritalStatus,
  useDeleteMaritalStatus,
} from "../hooks/use-marital-status";
import {
  MaritalStatus,
  MaritalStatusFormValues,
} from "../types/marital-status.schema";
import { MaritalStatusTable } from "./marital-status-table";
import { createMaritalStatusColumns } from "./marital-status-columns";
import { MaritalStatusFormDialog } from "./marital-status-form-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";

export default function MaritalStatusPage() {
  const { data, isLoading, error } = useMaritalStatuses();
  const createMutation = useCreateMaritalStatus();
  const updateMutation = useUpdateMaritalStatus();
  const deleteMutation = useDeleteMaritalStatus();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<MaritalStatus | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const maritalStatuses = data?.data || [];

  const handleOpenDialog = (status?: MaritalStatus) => {
    if (status) {
      setEditingStatus(status);
    } else {
      setEditingStatus(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingStatus(null);
  };

  const handleSubmit = (formData: MaritalStatusFormValues) => {
    if (editingStatus) {
      updateMutation.mutate(
        { id: editingStatus.id, data: formData },
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

  const columns = createMaritalStatusColumns(handleOpenDialog, handleDelete);

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <MainHeader header="إدارة الحالات الاجتماعية">
          <Heart className="text-primary" />
        </MainHeader>

        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          إضافة حالة اجتماعية
        </Button>
      </div>

      {/* Table Card */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>قائمة الحالات الاجتماعية</CardTitle>
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
            <MaritalStatusTable columns={columns} data={maritalStatuses} />
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <MaritalStatusFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingStatus}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="حذف الحالة الاجتماعية"
        description="هل أنت متأكد من حذف هذه الحالة الاجتماعية؟ هذا الإجراء لا يمكن التراجع عنه."
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
