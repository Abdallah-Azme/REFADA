"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/shared/ui/dialog";
import { Button } from "@/src/shared/ui/button";
import { FileSpreadsheet, Users, User, Loader2 } from "lucide-react";

export type ExportMode = "without_members" | "with_members";

interface ExportTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mode: ExportMode) => Promise<void>;
  isExporting: boolean;
}

export function ExportTypeDialog({
  isOpen,
  onClose,
  onConfirm,
  isExporting,
}: ExportTypeDialogProps) {
  const t = useTranslations("families.export_dialog");
  const tFamilies = useTranslations("families");

  const [selectedMode, setSelectedMode] = React.useState<ExportMode | null>(
    null,
  );

  const handleConfirm = async () => {
    if (!selectedMode) return;
    await onConfirm(selectedMode);
  };

  // Reset selection when dialog closes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedMode(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-gray-500 mt-1">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          {/* Option 1: Without members (head + wife only) */}
          <button
            type="button"
            onClick={() => setSelectedMode("without_members")}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 text-right transition-all duration-200 ${
              selectedMode === "without_members"
                ? "border-green-500 bg-green-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full shrink-0 ${
                selectedMode === "without_members"
                  ? "bg-green-100"
                  : "bg-gray-100"
              }`}
            >
              <User
                className={`w-6 h-6 ${
                  selectedMode === "without_members"
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              />
            </div>
            <div className="flex-1">
              <h3
                className={`font-semibold text-base ${
                  selectedMode === "without_members"
                    ? "text-green-700"
                    : "text-gray-800"
                }`}
              >
                {t("without_members_title")}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {t("without_members_desc")}
              </p>
            </div>
            {selectedMode === "without_members" && (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-1">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>

          {/* Option 2: With all members */}
          <button
            type="button"
            onClick={() => setSelectedMode("with_members")}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 text-right transition-all duration-200 ${
              selectedMode === "with_members"
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full shrink-0 ${
                selectedMode === "with_members" ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <Users
                className={`w-6 h-6 ${
                  selectedMode === "with_members"
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              />
            </div>
            <div className="flex-1">
              <h3
                className={`font-semibold text-base ${
                  selectedMode === "with_members"
                    ? "text-blue-700"
                    : "text-gray-800"
                }`}
              >
                {t("with_members_title")}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {t("with_members_desc")}
              </p>
            </div>
            {selectedMode === "with_members" && (
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-1">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        </div>

        <DialogFooter className="flex flex-row-reverse gap-2 sm:flex-row-reverse">
          <Button
            onClick={handleConfirm}
            disabled={!selectedMode || isExporting}
            className={`gap-2 min-w-[120px] ${
              selectedMode === "with_members"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {tFamilies("exporting")}
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-4 w-4" />
                {t("export_btn")}
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            {t("cancel_btn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
