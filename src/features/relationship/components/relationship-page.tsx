"use client";

import { useTranslations } from "next-intl";
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
import { DeleteConfirmDialog } from "@/features/marital-status/components/delete-confirm-dialog";

export default function RelationshipPage() {
  const t = useTranslations("relationship_page");
  const tCommon = useTranslations("common");

  const { data, isLoading, error } = useRelationships();
  const createMutation = useCreateRelationship();
  const updateMutation = useUpdateRelationship();
  const deleteMutation = useDeleteRelationship();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Relationship | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleSubmit = (values: RelationshipFormValues) => {
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

  const handleEdit = (item: Relationship) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteCallback = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
        },
      });
    }
  };

  const columns = createRelationshipColumns(
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
        <Users2 className="h-6 w-6 text-primary" />
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
            <RelationshipTable columns={columns} data={data?.data || []} />
          )}
        </CardContent>
      </Card>

      <RelationshipFormDialog
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
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={confirmDelete}
        title={t("delete_title")}
        description={t("delete_desc")}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
