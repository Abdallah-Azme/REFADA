"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Tent } from "lucide-react";
import AdminCampsTable from "@/features/dashboard/components/admin-camps-table";
import {
  Camp,
  dummyCamps,
} from "@/features/dashboard/table-cols/admin-camps-cols";
import MainHeader from "@/features/dashboard/components/main-header";
import CampFormDialog, {
  CampFormValues,
} from "@/features/dashboard/components/camp-form-dialog";

export default function AdminCampsPage() {
  const [camps, setCamps] = useState<Camp[]>(dummyCamps);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState<Camp | null>(null);

  const handleOpenDialog = (camp?: Camp) => {
    if (camp) {
      setEditingCamp(camp);
    } else {
      setEditingCamp(null);
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: CampFormValues) => {
    if (editingCamp) {
      // Update existing camp
      setCamps(
        camps.map((camp) =>
          camp.id === editingCamp.id ? { ...camp, ...data } : camp
        )
      );
    } else {
      // Create new camp
      const newCamp: Camp = {
        id: Date.now().toString(),
        ...data,
        status: "active",
      };
      setCamps([...camps, newCamp]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteCamp = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المخيم؟")) {
      setCamps(camps.filter((camp) => camp.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setCamps(
      camps.map((camp) =>
        camp.id === id
          ? {
              ...camp,
              status: camp.status === "active" ? "inactive" : "active",
            }
          : camp
      )
    );
  };

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <MainHeader header="إدارة المخيمات">
          <Tent className="text-primary" />
        </MainHeader>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة مخيم جديد
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
        <h3 className="text-lg font-bold text-gray-900 mb-4">قائمة المخيمات</h3>
        <AdminCampsTable
          data={camps}
          onEdit={handleOpenDialog}
          onDelete={handleDeleteCamp}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </div>
  );
}
