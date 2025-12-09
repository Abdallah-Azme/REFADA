"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Loader2, Mail } from "lucide-react";
import MainHeader from "@/shared/components/main-header";
import {
  ContactMessage,
  AdminMessagesTable,
  useContactMessages,
  useDeleteContactMessage,
  MessageViewDialog,
} from "@/features/messages";
import { DeleteConfirmDialog } from "@/features/marital-status";

export default function ContactMessagesPage() {
  const { data, isLoading, error } = useContactMessages();
  const deleteMutation = useDeleteContactMessage();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const messages = data?.data || [];

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setViewDialogOpen(true);
  };

  const handleDeleteMessage = (id: number) => {
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

  const newMessagesCount =
    messages.filter((m) => m.status === "new").length || 0;

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <MainHeader header="رسائل التواصل">
            <Mail className="text-primary" />
          </MainHeader>
          {newMessagesCount > 0 && (
            <p className="text-sm text-gray-500 mt-1 mr-12">
              لديك {newMessagesCount} رسالة جديدة
            </p>
          )}
        </div>
      </div>

      {/* Table Card */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>جميع الرسائل</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="mr-3 text-gray-600">جاري تحميل الرسائل...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-600">حدث خطأ أثناء تحميل الرسائل</p>
            </div>
          ) : (
            <AdminMessagesTable
              data={messages}
              onView={handleViewMessage}
              onDelete={handleDeleteMessage}
            />
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <MessageViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        message={selectedMessage}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="حذف الرسالة"
        description="هل أنت متأكد من حذف هذه الرسالة؟ هذا الإجراء لا يمكن التراجع عنه."
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
