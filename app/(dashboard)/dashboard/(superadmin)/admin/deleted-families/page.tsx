"use client";

import { Loader2, Trash2, Users } from "lucide-react";
import MainHeader from "@/src/shared/components/main-header";
import {
  FamilyTable,
  useDeletedFamilies,
  Family,
  useForceDeleteFamily,
  useForceDeleteAllFamilies,
  useRestoreFamily,
} from "@/features/families";
import { createDeletedFamilyColumns } from "@/features/families/components/deleted-family-columns";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { ForceDeleteDialog } from "@/features/families/components/force-delete-dialog";
import { Button } from "@/src/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/dialog";

export default function DeletedFamiliesPage() {
  const t = useTranslations("families_page");
  const tCommon = useTranslations("common");
  const { data: response, isLoading, error } = useDeletedFamilies();
  const { mutate: forceDelete, isPending: isDeleting } = useForceDeleteFamily();
  const { mutate: forceDeleteAll, isPending: isDeletingAll } =
    useForceDeleteAllFamilies();
  const { mutate: restoreFamily, isPending: isRestoring } = useRestoreFamily();
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
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
      <Dialog
        open={isDeleteAllDialogOpen}
        onOpenChange={setIsDeleteAllDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("force_delete_all.title")}</DialogTitle>
            <DialogDescription>
              {t("force_delete_all.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteAllDialogOpen(false)}
              disabled={isDeletingAll}
            >
              {tCommon("dialog.logout_cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                forceDeleteAll(undefined, {
                  onSuccess: () => setIsDeleteAllDialogOpen(false),
                });
              }}
              disabled={isDeletingAll || families.length === 0}
            >
              {isDeletingAll
                ? tCommon("deleting")
                : t("force_delete_all.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Header */}
      <div className="flex items-center justify-between">
        <MainHeader header={t("deleted_families_page.title")}>
          <Users className="text-primary" />
        </MainHeader>
        <Button
          variant="destructive"
          onClick={() => setIsDeleteAllDialogOpen(true)}
          disabled={isLoading || families.length === 0 || isDeletingAll}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {t("force_delete_all.button")}
        </Button>
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
