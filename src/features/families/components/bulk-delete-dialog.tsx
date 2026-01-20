"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";
import { useBulkDeleteFamilies } from "../hooks/use-families";
import { useTranslations } from "next-intl";

interface BulkDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFamilyIds: number[];
  onSuccess?: () => void;
}

export function BulkDeleteDialog({
  isOpen,
  onClose,
  selectedFamilyIds,
  onSuccess,
}: BulkDeleteDialogProps) {
  const t = useTranslations("families_page.bulk_delete");
  const [deleteReason, setDeleteReason] = useState("");
  const bulkDeleteMutation = useBulkDeleteFamilies();

  const handleConfirm = async () => {
    if (!deleteReason.trim()) return;

    await bulkDeleteMutation.mutateAsync({
      familyIds: selectedFamilyIds,
      deleteReason: deleteReason.trim(),
    });

    setDeleteReason("");
    onClose();
    onSuccess?.();
  };

  const handleClose = () => {
    setDeleteReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>
            {t("description", { count: selectedFamilyIds.length })}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="delete-reason">{t("reason_label")}</Label>
            <Textarea
              id="delete-reason"
              placeholder={t("reason_placeholder")}
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={bulkDeleteMutation.isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!deleteReason.trim() || bulkDeleteMutation.isPending}
          >
            {bulkDeleteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("deleting")}
              </>
            ) : (
              t("confirm")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
