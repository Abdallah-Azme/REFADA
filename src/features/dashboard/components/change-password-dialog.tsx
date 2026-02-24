import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PendingUser } from "@/features/representatives/types/pending-users.schema";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: PendingUser | null;
  onConfirm: (password: string, confirmPassword: string) => void;
  isPending: boolean;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  isPending,
}: ChangePasswordDialogProps) {
  const t = useTranslations();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setNewPassword("");
      setConfirmPassword("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [open]);

  const handleConfirm = () => {
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      onConfirm(newPassword, confirmPassword);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("representatives.change_password_title")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600">
            {t("representatives.change_password_description", {
              name: user?.name || "",
            })}
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("representatives.new_password")}
            </label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("representatives.new_password_placeholder")}
                className="pe-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("representatives.confirm_new_password")}
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("representatives.confirm_password_placeholder")}
                className="pe-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          {newPassword &&
            confirmPassword &&
            newPassword !== confirmPassword && (
              <p className="text-sm text-red-500">
                {t("representatives.passwords_not_match")}
              </p>
            )}
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              !newPassword ||
              !confirmPassword ||
              newPassword !== confirmPassword ||
              isPending
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                {t("common.loading")}
              </>
            ) : (
              t("representatives.save_password")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
