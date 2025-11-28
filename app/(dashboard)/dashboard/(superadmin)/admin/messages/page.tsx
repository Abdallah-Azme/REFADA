"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AdminMessagesTable from "@/features/dashboard/components/admin-messages-table";
import {
  ContactMessage,
  dummyMessages,
} from "@/features/dashboard/table-cols/admin-messages-cols";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(dummyMessages);

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);

    // Mark as read if it's new
    if (message.status === "new") {
      setMessages(
        messages.map((m) =>
          m.id === message.id ? { ...m, status: "read" } : m
        )
      );
    }
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الرسالة؟")) {
      setMessages(messages.filter((m) => m.id !== id));
    }
  };

  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;

    // Here you would typically send the reply via email
    console.log("Sending reply to:", selectedMessage.email);
    console.log("Reply:", replyText);

    // Update message status
    setMessages(
      messages.map((m) =>
        m.id === selectedMessage.id ? { ...m, status: "replied" } : m
      )
    );

    setReplyText("");
    setIsDialogOpen(false);
    alert("تم إرسال الرد بنجاح!");
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const newMessagesCount = messages.filter((m) => m.status === "new").length;

  return (
    <section className="p-7 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">رسائل التواصل</h1>
          {newMessagesCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              لديك {newMessagesCount} رسالة جديدة
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>جميع الرسائل</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminMessagesTable
            data={messages}
            onView={handleViewMessage}
            onDelete={handleDeleteMessage}
          />
        </CardContent>
      </Card>

      {/* Message Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل الرسالة</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">الاسم</Label>
                  <p className="mt-1">{selectedMessage.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">
                    البريد الإلكتروني
                  </Label>
                  <p className="mt-1">{selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <Label className="text-sm font-semibold">رقم الهاتف</Label>
                    <p className="mt-1">{selectedMessage.phone}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-semibold">التاريخ</Label>
                  <p className="mt-1">
                    {formatDate(selectedMessage.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">الموضوع</Label>
                <p className="mt-1">{selectedMessage.subject}</p>
              </div>

              <div>
                <Label className="text-sm font-semibold">الرسالة</Label>
                <div className="mt-1 p-4 bg-gray-50 rounded-md">
                  <p className="whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label htmlFor="reply">الرد على الرسالة</Label>
                <Textarea
                  id="reply"
                  placeholder="اكتب ردك هنا..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="mt-2 min-h-[120px]"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    إغلاق
                  </Button>
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    إرسال الرد
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
