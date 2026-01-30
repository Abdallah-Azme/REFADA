"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import MainHeader from "@/src/shared/components/main-header";
import {
  FamilyTable,
  createFamilyColumns,
  Family,
  useFamilies,
  useDeleteFamily,
  FamiliesQueryParams,
  DEFAULT_FAMILIES_QUERY,
} from "@/features/families";
import EditFamilyDialog from "@/features/families/components/edit-family-dialog";
import FamilyDetailsDialog from "@/features/families/components/family-details-dialog";
import { DeleteConfirmDialog } from "@/features/marital-status";
import AddFamilyDialog from "@/src/features/dashboard/components/add-family-dialog";
import { useTranslations } from "next-intl";

export default function RepresentativeFamiliesPage() {
  const t = useTranslations("families");

  // Query params state for server-side filtering/pagination
  const [queryParams, setQueryParams] = useState<FamiliesQueryParams>(
    DEFAULT_FAMILIES_QUERY,
  );

  const {
    data: response,
    isLoading,
    error,
    isFetching,
  } = useFamilies(queryParams);
  const deleteMutation = useDeleteFamily();

  const [formOpen, setFormOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewingFamily, setViewingFamily] = useState<Family | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingFamily, setDeletingFamily] = useState<Family | null>(null);

  console.log({ response });
  const families = response?.data ?? [];
  const meta = response?.meta;

  const handleEdit = (family: Family) => {
    setEditingFamily(family);
    setFormOpen(true);
  };

  const handleView = (family: Family) => {
    setViewingFamily(family);
    setViewOpen(true);
  };

  const handleDelete = (family: Family) => {
    setDeletingFamily(family);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingFamily) {
      deleteMutation.mutate(deletingFamily.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setDeletingFamily(null);
        },
      });
    }
  };

  const handleQueryChange = (newParams: FamiliesQueryParams) => {
    setQueryParams(newParams);
  };

  const columns = createFamilyColumns(handleView, handleEdit, handleDelete, t, {
    hideDelete: true,
  });

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <MainHeader header={t("page_title")}>
          <Users className="text-primary" />
        </MainHeader>

        <AddFamilyDialog />
      </div>

      {/* Content */}
      <div className="w-full bg-white rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {t("list_title")}
        </h3>

        {error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-600">{t("error_loading")}</p>
          </div>
        ) : (
          <FamilyTable
            data={families}
            columns={columns}
            showCampFilter={false}
            queryParams={queryParams}
            onQueryChange={handleQueryChange}
            meta={meta}
            isLoading={isLoading || isFetching}
          />
        )}
      </div>

      {/* Dialogs */}
      <EditFamilyDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        family={editingFamily}
        hideCamp={true}
      />

      <FamilyDetailsDialog
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        family={viewingFamily}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title={t("delete_title")}
        description={t("delete_description", {
          name: deletingFamily?.familyName || "",
        })}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
