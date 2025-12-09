"use client";

import { useState } from "react";
import { Button } from "@/src/shared/ui/button";
import { Dialog, DialogTrigger } from "@/src/shared/ui/dialog";
import { Plus, Tent, Loader2 } from "lucide-react";
import MainHeader from "@/src/shared/components/main-header";
import {
  CampFormDialog,
  CampsTable,
  Camp,
  CampFormValues,
  useCamps,
} from "@/features/camps";

export default function AdminCampsPage() {
  const { data, isLoading, error } = useCamps();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState<Camp | null>(null);

  const camps = data?.data || [];

  const handleOpenDialog = (camp?: Camp) => {
    if (camp) {
      setEditingCamp(camp);
    } else {
      setEditingCamp(null);
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: CampFormValues) => {
    // TODO: Implement create/update API calls
    console.log("Form data:", data);
    setIsDialogOpen(false);
  };

  const handleDeleteCamp = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الإيواء؟")) {
      // TODO: Implement delete API call
      console.log("Delete camp:", id);
    }
  };

  const handleToggleStatus = (id: string) => {
    // TODO: Implement toggle status API call
    console.log("Toggle status for camp:", id);
  };

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <MainHeader header="إدارة الإيواءات">
          <Tent className="text-primary" />
        </MainHeader>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة إيواء جديد
            </Button>
          </DialogTrigger>
          <CampFormDialog
            initialData={editingCamp}
            onSubmit={onSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </div>

      {/* Admin Camps Table - styled like representative page */}
      <div className="w-full bg-white rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          قائمة الإيواءات
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-3 text-gray-600">جاري تحميل البيانات...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
          </div>
        ) : (
          <CampsTable
            data={camps}
            onEdit={handleOpenDialog}
            onDelete={handleDeleteCamp}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>
    </div>
  );
}
