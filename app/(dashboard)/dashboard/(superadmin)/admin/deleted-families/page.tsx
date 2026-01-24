"use client";

import { Loader2, Users } from "lucide-react";
import MainHeader from "@/src/shared/components/main-header";
import {
  FamilyTable,
  useDeletedFamilies,
  Family,
  useForceDeleteFamily,
  useRestoreFamily,
} from "@/features/families";
import { createDeletedFamilyColumns } from "@/features/families/components/deleted-family-columns";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { ForceDeleteDialog } from "@/features/families/components/force-delete-dialog";

export default function DeletedFamiliesPage() {
  const t = useTranslations("families_page");
  const { data: response, isLoading, error } = useDeletedFamilies();
  const { mutate: forceDelete, isPending: isDeleting } = useForceDeleteFamily();
  const { mutate: restoreFamily, isPending: isRestoring } = useRestoreFamily();
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);

  // Extract deleted families data
  const families = response?.data || [];

  const columns = createDeletedFamilyColumns(
    t,
    (family) => {
      setSelectedFamily(family as unknown as Family);
    },
    (family) => {
      restoreFamily(family.id);
    },
  ) as unknown as ColumnDef<Family>[];

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      <ForceDeleteDialog
        isOpen={!!selectedFamily}
        onClose={() => setSelectedFamily(null)}
        onConfirm={() => {
          if (selectedFamily) {
            forceDelete(selectedFamily.id);
            setSelectedFamily(null);
          }
        }}
        familyName={selectedFamily?.familyName}
        isDeleting={isDeleting}
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <MainHeader header={t("deleted_families_page.title")}>
          <Users className="text-primary" />
        </MainHeader>
      </div>

      {/* Content */}
      <div className="w-full bg-white rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {t("deleted_families_page.list_title")}
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-3 text-gray-600">{t("loading_data")}</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-600">{t("error_loading")}</p>
          </div>
        ) : (
          <FamilyTable
            data={families}
            columns={columns}
            // Passing empty handler since selection isn't needed for now,
            // or we can allow it but there are no bulk actions for deleted yet.
            onSelectionChange={() => {}}
          />
        )}
      </div>
    </div>
  );
}
