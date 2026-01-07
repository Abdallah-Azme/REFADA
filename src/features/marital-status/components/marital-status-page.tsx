"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("marital_status_page");
  const tCommon = useTranslations("common");

  const { data, isLoading, error } = useMaritalStatuses();
  const createMutation = useCreateMaritalStatus();
  const updateMutation = useUpdateMaritalStatus();
  const deleteMutation = useDeleteMaritalStatus();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MaritalStatus | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleSubmit = (values: MaritalStatusFormValues) => {
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

  const handleEdit = (item: MaritalStatus) => {
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

  const columns = createMaritalStatusColumns(
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
    <div className="space-y-6">
      <MainHeader header={t("title")} subheader={t("list_title")}>
        <Heart className="h-6 w-6 text-primary" />
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
            <MaritalStatusTable columns={columns} data={data?.data || []} />
          )}
        </CardContent>
      </Card>

      <MaritalStatusFormDialog
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
