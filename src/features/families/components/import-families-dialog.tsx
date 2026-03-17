"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCampNamesList } from "@/features/camps";
import { useFamilyExcelImport } from "../hooks/use-family-excel-import";
import { Upload, Loader2, FileSpreadsheet, Search } from "lucide-react";

interface ImportFamiliesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportFamiliesDialog({
  isOpen,
  onClose,
}: ImportFamiliesDialogProps) {
  const [selectedCampId, setSelectedCampId] = useState<string>("");
  const [campSearchInput, setCampSearchInput] = useState("");

  const { data: campsData } = useCampNamesList();
  const camps = (campsData?.data || []) as any[];

  const { handleFileUpload, isUploading } = useFamilyExcelImport();

  // Filter camps based on search input
  const filteredCamps = useMemo(() => {
    if (!campSearchInput.trim()) return camps;

    const searchLower = campSearchInput.toLowerCase();
    return camps.filter((camp) => {
      const displayName =
        typeof camp.name === "string"
          ? camp.name
          : camp.name?.ar || camp.name?.en || "";
      return displayName.toLowerCase().includes(searchLower);
    });
  }, [camps, campSearchInput]);

  const handleUploadClick = () => {
    if (!selectedCampId) return;
    handleFileUpload(Number(selectedCampId));
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedCampId("");
      setCampSearchInput("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md rounded-xl" dir="rtl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <DialogTitle className="text-lg font-semibold">
            استيراد العائلات من Excel
          </DialogTitle>
        </div>

        <DialogDescription className="text-sm text-gray-500 mb-4">
          اختر المخيم ثم ارفع ملف Excel بصيغة النموذج المعتمد. يجب أن يحتوي
          الملف على ورقتين: <strong>العائلات</strong> و<strong>الأفراد</strong>.
        </DialogDescription>

        {/* Camp selector */}
        <div className="space-y-2 mb-5">
          <label className="text-sm font-medium text-gray-700">
            اختر المخيم <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedCampId}
            onValueChange={setSelectedCampId}
            onOpenChange={(open) => {
              if (!open) setCampSearchInput("");
            }}
          >
            <SelectTrigger className="w-full h-11">
              <SelectValue placeholder="اختر المخيم..." />
            </SelectTrigger>
            <SelectContent>
              {/* Search Input */}
              <div className="px-2 pb-2 border-b sticky top-0 bg-white z-10">
                <div className="relative">
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث عن مخيم..."
                    value={campSearchInput}
                    onChange={(e) => setCampSearchInput(e.target.value)}
                    className="pr-10 h-9"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {filteredCamps.length > 0 ? (
                filteredCamps.map((camp: any) => {
                  const displayName =
                    typeof camp.name === "string"
                      ? camp.name
                      : camp.name?.ar || camp.name?.en || `مخيم ${camp.id}`;
                  return (
                    <SelectItem key={camp.id} value={camp.id.toString()}>
                      {displayName}
                    </SelectItem>
                  );
                })
              ) : (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                  لا توجد نتائج
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Info note */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-5 leading-relaxed">
          <strong>ملاحظة:</strong> تأكد من استخدام النموذج الصحيح. يمكنك تحميل
          النموذج عبر زر «تحميل النموذج» في الصفحة الرئيسية.
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            إلغاء
          </Button>
          <Button
            onClick={handleUploadClick}
            disabled={!selectedCampId || isUploading}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 h-11"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الرفع...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                اختر الملف وارفع
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
