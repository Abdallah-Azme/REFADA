"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { AlertTriangle } from "lucide-react";

interface CampDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (deleteRelated: boolean) => void;
  isPending?: boolean;
}

export function CampDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: CampDeleteDialogProps) {
  const t = useTranslations("camps");
  const tCommon = useTranslations("common");

  const [deleteRelated, setDeleteRelated] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const expectedText = "حذف كل شيء";
  const isConfirmationValid = deleteRelated
    ? confirmationText.trim() === expectedText
    : true;

  const handleConfirm = () => {
    if (isConfirmationValid) {
      onConfirm(deleteRelated);
      setDeleteRelated(false);
      setConfirmationText("");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setDeleteRelated(false);
      setConfirmationText("");
    }
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("delete_title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("delete_desc")}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start space-x-2 space-x-reverse">
            <Checkbox
              id="delete-related"
              checked={deleteRelated}
              onCheckedChange={(checked) => {
                setDeleteRelated(checked as boolean);
                if (!checked) setConfirmationText("");
              }}
              disabled={isPending}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="delete-related"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {t("delete_related_label")}
              </Label>
            </div>
          </div>

          {deleteRelated && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <p className="text-sm text-red-800 font-medium">
                  {t("delete_related_warning")}
                </p>
              </div>
            </div>
          )}

          {deleteRelated && (
            <div className="space-y-2">
              <Label htmlFor="confirm-text" className="text-sm font-medium">
                {t("confirm_delete_related")}
              </Label>
              <Input
                id="confirm-text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={t("type_to_confirm")}
                disabled={isPending}
                className="text-right"
                dir="rtl"
              />
              {confirmationText && !isConfirmationValid && (
                <p className="text-sm text-red-600">
                  {t("confirmation_text_mismatch")}
                </p>
              )}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {tCommon("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending || !isConfirmationValid}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? tCommon("deleting") : tCommon("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
