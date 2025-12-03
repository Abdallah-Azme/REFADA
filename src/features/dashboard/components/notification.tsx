"use client";

import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, CheckCircle, Info } from "lucide-react";
import NotificationItem from "./notification-item";

type NotificationType = "error" | "info" | "success";

interface ActionButton {
  label: string;
  variant?: "primary" | "secondary";
}

interface NotificationItemProps {
  type: NotificationType;
  title: string;
  description?: string;
  actions?: ActionButton[];
}

export default function Notification() {
  const notifications: NotificationItemProps[] = [
    {
      type: "error",
      title: "تم رفض المساهمة الأخيرة لعدم اكتمال البيانات…",
      description: "تم رفض مساهمة لمشروع عوائد النتن",
      actions: [{ label: "مراجعة" }, { label: "رفض", variant: "secondary" }],
    },
    {
      type: "info",
      title: "تم تحديث عدد العائلات المسجلة في مخيم جر…",
      description: "تم تحديث مساهمة مشروع عوائد النتن",
      actions: [{ label: "تأكيد" }, { label: "رفض", variant: "secondary" }],
    },
    {
      type: "success",
      title: "تم تنفيذ 80% من مشروع (إيواء النازحين) في مخيم البريح",
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="center"
        className="w-[380px]   p-0 rounded-xl"
      >
        {/* Header */}
        <div className="px-5 py-4 font-semibold text-lg">الإشعارات</div>

        {/* List */}
        <div className="max-h-[450px] overflow-y-auto px-4 py-3 space-y-2">
          {notifications.map((item, idx) => (
            <NotificationItem key={idx} {...item} />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-3 border-t bg-[#F9F9FA]">
          <Button
            variant={"ghost"}
            className="text-[#1A76D1] text-sm font-medium"
          >
            كل الإشعارات
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
