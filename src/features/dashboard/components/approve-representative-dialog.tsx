import { PendingUser } from "@/features/representatives/types/pending-users.schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface ApproveRepresentativeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: PendingUser | null;
  selectedCampId: string;
  onCampChange: (id: string) => void;
  camps: any[];
  onConfirm: () => void;
  isPending: boolean;
}

export function ApproveRepresentativeDialog({
  open,
  onOpenChange,
  user: approvingUser,
  selectedCampId,
  onCampChange: setSelectedCampId,
  camps,
  onConfirm: handleConfirmApprove,
  isPending: approveMutationIsPending,
}: ApproveRepresentativeDialogProps) {
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("representatives.approve_title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600">
            {t("representatives.approve_description", {
              name: approvingUser?.name || "",
            })}
          </p>

          {/* User Data Preview */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
            <div>
              <label className="text-xs text-gray-500">
                {t("representatives.name")}
              </label>
              <p className="text-sm font-medium">
                {approvingUser?.name || "-"}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">
                {t("representatives.email")}
              </label>
              <p className="text-sm font-medium">
                {approvingUser?.email || "-"}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">
                {t("representatives.phone")}
              </label>
              <p className="text-sm font-medium">
                {approvingUser?.phone || "-"}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">
                {t("representatives.national_id")}
              </label>
              <p className="text-sm font-medium">
                {approvingUser?.idNumber || "-"}
              </p>
            </div>
            {approvingUser?.adminPositionName && (
              <div className="col-span-2">
                <label className="text-xs text-gray-500">
                  {t("representatives.admin_position")}
                </label>
                <p className="text-sm font-medium">
                  {approvingUser.adminPositionName}
                </p>
              </div>
            )}
            {approvingUser?.licenseNumber && (
              <div className="col-span-2">
                <label className="text-xs text-gray-500">
                  {t("representatives.license_number")}
                </label>
                <p className="text-sm font-medium">
                  {approvingUser.licenseNumber}
                </p>
              </div>
            )}
          </div>

          {/* Camp Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("representatives.select_camp")}
            </label>
            <Select value={selectedCampId} onValueChange={setSelectedCampId}>
              <SelectTrigger>
                <SelectValue
                  placeholder={t("representatives.select_camp_placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {camps.map((camp) => {
                  const campName =
                    typeof camp.name === "string"
                      ? camp.name
                      : camp.name?.ar || camp.name?.en || "";
                  return (
                    <SelectItem key={camp.id} value={camp.id.toString()}>
                      {campName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={approveMutationIsPending}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirmApprove}
            disabled={!selectedCampId || approveMutationIsPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {approveMutationIsPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                {t("common.loading")}
              </>
            ) : (
              t("representatives.approve")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
