"use client";

import { useTranslations } from "next-intl";
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
import { DeleteConfirmDialog } from "@/features/marital-status/components/delete-confirm-dialog";

export default function AdminPositionPage() {
  const t = useTranslations("admin_position_page");
  const tCommon = useTranslations("common");

  const { data, isLoading, error } = useAdminPositions();
  const createMutation = useCreateAdminPosition();
  const updateMutation = useUpdateAdminPosition();
  const deleteMutation = useDeleteAdminPosition();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminPosition | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleSubmit = (values: AdminPositionFormValues) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data: values },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingItem(null);
          },
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    }
  };

  const handleEdit = (item: AdminPosition) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteCallback = (id: number) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => {
          setDeletingId(null);
        },
      });
    }
  };

  const columns = createAdminPositionColumns(
    handleEdit,
    handleDeleteCallback,
    t
  );

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {tCommon("error_loading")}
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-8">
      <MainHeader header={t("title")} subheader={t("list_title")}>
        <Briefcase className="h-6 w-6 text-primary" />
      </MainHeader>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">
            {t("list_title")}
          </CardTitle>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("add")}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <AdminPositionTable columns={columns} data={data?.data || []} />
          )}
        </CardContent>
      </Card>

      <AdminPositionFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingItem(null);
        }}
        initialData={editingItem}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={confirmDelete}
        title={t("delete_title")}
        description={t("delete_desc")}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
