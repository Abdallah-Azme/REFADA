"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Loader2, Plus, Briefcase } from "lucide-react";
import MainHeader from "@/shared/components/main-header";
import {
  useAdminPositions,
  useCreateAdminPosition,
  useUpdateAdminPosition,
  useDeleteAdminPosition,
} from "../hooks/use-admin-position";
import {
  AdminPosition,
  AdminPositionFormValues,
} from "../types/admin-position.schema";
import { AdminPositionTable } from "./admin-position-table";
import { createAdminPositionColumns } from "./admin-position-columns";
import { AdminPositionFormDialog } from "./admin-position-form-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";

export default function AdminPositionPage() {
  const { data, isLoading, error } = useAdminPositions();
  const createMutation = useCreateAdminPosition();
  const updateMutation = useUpdateAdminPosition();
  const deleteMutation = useDeleteAdminPosition();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<AdminPosition | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const adminPositions = data?.data || [];

  const handleOpenDialog = (position?: AdminPosition) => {
    if (position) {
      setEditingPosition(position);
    } else {
      setEditingPosition(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPosition(null);
  };

  const handleSubmit = (formData: AdminPositionFormValues) => {
    if (editingPosition) {
      updateMutation.mutate(
        { id: editingPosition.id, data: formData },
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

  const columns = createAdminPositionColumns(handleOpenDialog, handleDelete);

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <MainHeader header="إدارة الصفات الإدارية">
          <Briefcase className="text-primary" />
        </MainHeader>

        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          إضافة صفة إدارية
        </Button>
      </div>

      {/* Table Card */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>قائمة الصفات الإدارية</CardTitle>
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
            <AdminPositionTable columns={columns} data={adminPositions} />
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <AdminPositionFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingPosition}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="حذف الصفة الإدارية"
        description="هل أنت متأكد من حذف هذه الصفة الإدارية؟ هذا الإجراء لا يمكن التراجع عنه."
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
