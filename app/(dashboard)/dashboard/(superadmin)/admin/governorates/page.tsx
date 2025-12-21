"use client";

import { useState } from "react";
import AdminGovernoratesTable from "@/features/dashboard/components/admin-governorates-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import GovernorateFormDialog from "@/features/dashboard/components/governorate-form-dialog";
import {
  Governorate,
  GovernorateFormValues,
} from "@/features/dashboard/types/governorates.schema";
import {
  useCreateGovernorate,
  useUpdateGovernorate,
} from "@/features/dashboard/hooks/use-governorates";

export default function AdminGovernoratesPage() {
  const [open, setOpen] = useState(false);
  const [selectedGovernorate, setSelectedGovernorate] =
    useState<Governorate | null>(null);

  const createMutation = useCreateGovernorate();
  const updateMutation = useUpdateGovernorate();

  const handleAdd = () => {
    setSelectedGovernorate(null);
    setOpen(true);
  };

  const handleEdit = (governorate: Governorate) => {
    setSelectedGovernorate(governorate);
    setOpen(true);
  };

  const handleSubmit = (data: GovernorateFormValues) => {
    if (selectedGovernorate) {
      updateMutation.mutate(
        { id: selectedGovernorate.id, data },
        {
          onSuccess: () => setOpen(false),
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setOpen(false),
      });
    }
  };

  return (
    <section className="p-7 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">إدارة المحافظات</h1>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة محافظة
        </Button>
      </div>

      <AdminGovernoratesTable onEdit={handleEdit} />

      <GovernorateFormDialog
        open={open}
        onOpenChange={setOpen}
        initialData={selectedGovernorate}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
