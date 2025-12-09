"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { ContactMessage } from "../types/message.schema";
import { Badge } from "@/shared/ui/badge";
import {
  Calendar,
  Mail,
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { messageService } from "../services/message.service";

interface MessageViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: ContactMessage | null;
}

export function MessageViewDialog({
  open,
  onOpenChange,
  message,
}: MessageViewDialogProps) {
  if (!message) return null;

  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const status = message.status || "new";
  const statusLabel = messageService.getStatusLabel(status);
  const statusVariant = messageService.getStatusVariant(status);
  const StatusIcon =
    status === "new" ? Clock : status === "read" ? Eye : CheckCircle;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            تفاصيل الرسالة
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info Card */}
          <Card className="bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <User className="h-5 w-5" />
                  معلومات المرسل
                </h3>
                <Badge
                  variant={statusVariant}
                  className="flex items-center gap-1"
                >
                  <StatusIcon className="h-3 w-3" />
                  {statusLabel}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">الاسم</p>
                    <p className="font-semibold text-gray-900">
                      {message.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      البريد الإلكتروني
                    </p>
                    <p className="font-semibold text-gray-900 text-sm break-all">
                      {message.email}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject Card */}
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">الموضوع</p>
                  <p className="font-semibold text-lg text-gray-900">
                    {message.subject || "لا يوجد موضوع"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Card */}
          <Card className="border-2 border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                <div className="h-1 w-8 bg-primary rounded-full"></div>
                محتوى الرسالة
              </h3>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {message.message}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Date Footer */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500">تاريخ الإرسال</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(message.createdAt)}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              #{message.id}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
