"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Mail, Loader2 } from "lucide-react";
import { Label } from "@/shared/ui/label";
import RichTextEditor from "@/components/rich-text-editor";
import {
  ContactMessage,
  AdminMessagesTable,
  useContactMessages,
} from "@/features/messages";

const replySchema = z.object({
  replyText: z.string().min(10, "الرد يجب أن يكون 10 أحرف على الأقل"),
});

type ReplyFormValues = z.infer<typeof replySchema>;

export default function ContactMessagesPage() {
  const { data, isLoading, error } = useContactMessages();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const messages = data?.data || [];

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      replyText: "",
    },
  });

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
    form.reset({ replyText: "" });
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الرسالة؟")) {
      // TODO: Implement delete API call
      console.log("Delete message:", id);
    }
  };

  const onSubmitReply = (data: ReplyFormValues) => {
    if (!selectedMessage) return;

    // Here you would typically send the reply via email
    console.log("Sending reply to:", selectedMessage.email);
    console.log("Reply:", data.replyText);

    form.reset();
    setIsDialogOpen(false);
    alert("تم إرسال الرد بنجاح!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const newMessagesCount =
    messages.filter((m) => m.status === "new").length || 0;

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
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmitReply)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="replyText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الرد على الرسالة</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              content={field.value}
                              onChange={field.onChange}
                              placeholder="اكتب ردك هنا..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        إغلاق
                      </Button>
                      <Button type="submit">
                        <Mail className="h-4 w-4 mr-2" />
                        إرسال الرد
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
