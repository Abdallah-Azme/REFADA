"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Loader2, Plus, Users2 } from "lucide-react";
import MainHeader from "@/shared/components/main-header";
import {
  useRelationships,
  useCreateRelationship,
  useUpdateRelationship,
  useDeleteRelationship,
} from "../hooks/use-relationship";
import {
  Relationship,
  RelationshipFormValues,
} from "../types/relationship.schema";
import { RelationshipTable } from "./relationship-table";
import { createRelationshipColumns } from "./relationship-columns";
import { RelationshipFormDialog } from "./relationship-form-dialog";
import { DeleteConfirmDialog } from "@/features/marital-status";

export default function RelationshipPage() {
  const { data, isLoading, error } = useRelationships();
  const createMutation = useCreateRelationship();
  const updateMutation = useUpdateRelationship();
  const deleteMutation = useDeleteRelationship();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRelationship, setEditingRelationship] =
    useState<Relationship | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const relationships = data?.data || [];

  const handleOpenDialog = (relationship?: Relationship) => {
    if (relationship) {
      setEditingRelationship(relationship);
    } else {
      setEditingRelationship(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRelationship(null);
  };

  const handleSubmit = (formData: RelationshipFormValues) => {
    if (editingRelationship) {
      updateMutation.mutate(
        { id: editingRelationship.id, data: formData },
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

  const columns = createRelationshipColumns(handleOpenDialog, handleDelete);

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <MainHeader header="إدارة العلاقات">
          <Users2 className="text-primary" />
        </MainHeader>

        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          إضافة علاقة
        </Button>
      </div>

      {/* Table Card */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>قائمة العلاقات</CardTitle>
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
            <RelationshipTable columns={columns} data={relationships} />
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <RelationshipFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingRelationship}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="حذف العلاقة"
        description="هل أنت متأكد من حذف هذه العلاقة؟ هذا الإجراء لا يمكن التراجع عنه."
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
