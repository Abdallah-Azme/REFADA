import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/dialog";
import { Button } from "@/src/shared/ui/button";
import { useTranslations } from "next-intl";

interface ForceDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  familyName?: string;
  isDeleting?: boolean;
}

export function ForceDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  familyName,
  isDeleting,
}: ForceDeleteDialogProps) {
  const t = useTranslations("families_page");
  const tCommon = useTranslations("common");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("force_delete.title")}</DialogTitle>
          <DialogDescription>
            {t("force_delete.description", { name: familyName || "" })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {tCommon("dialog.logout_cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? tCommon("loading") : t("force_delete.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
