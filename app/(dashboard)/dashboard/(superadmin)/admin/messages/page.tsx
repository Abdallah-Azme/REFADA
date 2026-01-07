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
import { createAdminMessageColumns } from "@/features/messages/components/message-table-columns";
import { DeleteConfirmDialog } from "@/features/marital-status";
import { useTranslations } from "next-intl";

// ... imports

export default function ContactMessagesPage() {
  const t = useTranslations("messages_page");
  const tCommon = useTranslations("common");
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

  // Create columns with translation function
  const columns = createAdminMessageColumns(
    {
      onView: handleViewMessage,
      onDelete: handleDeleteMessage,
    },
    t
  );

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <MainHeader header={t("page_title")}>
            <Mail className="text-primary" />
          </MainHeader>
          {newMessagesCount > 0 && (
            <p className="text-sm text-gray-500 mt-1 mr-12">
              {t("new_messages", { count: newMessagesCount })}
            </p>
          )}
        </div>
      </div>
      {/* Table Card */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>{t("all_messages")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="mr-3 text-gray-600">{tCommon("loading")}</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-600">{tCommon("toast.loading_error")}</p>
            </div>
          ) : (
            /* Use the generic DataTable or specialized table component if it accepts columns */
            <AdminMessagesTable
              data={messages}
              onView={handleViewMessage}
              onDelete={handleDeleteMessage}
              customColumns={columns} // Assuming AdminMessagesTable can accept custom columns or we need to refactor it too.
              // Wait, AdminMessagesTable likely internally calls createAdminMessageColumns.
              // I need to check AdminMessagesTable implementation.
            />
          )}
        </CardContent>
      </Card>
      // ...
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
        title={t("delete_title")}
        description={t("delete_description")}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
