"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Loader2, MessageSquareWarning } from "lucide-react";
import MainHeader from "@/shared/components/main-header";
import { useComplaints, useDeleteComplaint } from "../hooks/use-complaint";
import { Complaint } from "../types/complaint.schema";
import { ComplaintTable } from "./complaint-table";
import { createComplaintColumns } from "./complaint-columns";
import { ComplaintViewDialog } from "./complaint-view-dialog";
import { DeleteConfirmDialog } from "@/features/marital-status";

export default function ComplaintsPage() {
  const { data, isLoading, error } = useComplaints();
  const deleteMutation = useDeleteComplaint();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingComplaint, setViewingComplaint] = useState<Complaint | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const complaints = data?.data || [];

  const handleView = (complaint: Complaint) => {
    setViewingComplaint(complaint);
    setViewDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeletingId(null);
        },
      });
    }
  };

  const columns = createComplaintColumns(handleView, handleDelete);

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <MainHeader header="إدارة الشكاوى والاقتراحات">
          <MessageSquareWarning className="text-primary" />
        </MainHeader>
      </div>

      {/* Table Card */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>قائمة الشكاوى والاقتراحات</CardTitle>
        </CardHeader>
        <CardContent>
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
            <ComplaintTable columns={columns} data={complaints} />
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <ComplaintViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        complaint={viewingComplaint}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="حذف الشكوى/الاقتراح"
        description="هل أنت متأكد من حذف هذه الشكوى/الاقتراح؟ هذا الإجراء لا يمكن التراجع عنه."
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
