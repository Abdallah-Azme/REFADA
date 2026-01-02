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
import useFcmToken from "../../../hooks/use-fcm-token";
import { useEffect, useState } from "react";

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
  const { token, notificationPermissionStatus, requestPermission, messages } =
    useFcmToken();

  // Combine static and dynamic notifications for demo, or replace entirely
  // For now I will append dynamic messages to the top
  const dynamicNotifications: NotificationItemProps[] = messages.map(
    (msg: any, idx: number) => ({
      type: "info", // Default type
      title: msg.notification?.title || "New Message",
      description: msg.notification?.body,
      actions: [], // You can parse data to add actions if needed
    })
  );

  const initialNotifications: NotificationItemProps[] = [
    {
      type: "error",
      title: "تم رفض المساهمة الأخيرة لعدم اكتمال البيانات…",
      description: "تم رفض مساهمة لمشروع عوائد النتن",
      actions: [{ label: "مراجعة" }, { label: "رفض", variant: "secondary" }],
    },
    {
      type: "info",
      title: "تم تحديث عدد العائلات المسجلة في إيواء جر…",
      description: "تم تحديث مساهمة مشروع عوائد النتن",
      actions: [{ label: "تأكيد" }, { label: "رفض", variant: "secondary" }],
    },
    {
      type: "success",
      title: "تم تنفيذ 80% من مشروع (إيواء النازحين) في إيواء البريح",
    },
  ];

  const allNotifications = [...dynamicNotifications, ...initialNotifications];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-gray-700" />
          {allNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {allNotifications.length}
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="center"
        className="w-[380px] p-0 rounded-xl"
      >
        {/* Header */}
        <div className="px-5 py-4 font-semibold text-lg flex justify-between items-center">
          <span>الإشعارات</span>
          {notificationPermissionStatus !== "granted" && (
            <Button
              variant="outline"
              size="sm"
              onClick={requestPermission}
              className="text-xs"
            >
              تفعيل الإشعارات
            </Button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[450px] overflow-y-auto px-4 py-3 space-y-2">
          {allNotifications.map((item, idx) => (
            <NotificationItem key={idx} {...item} />
          ))}
          {token && (
            <div className="text-[10px] text-gray-400 break-all p-2 bg-gray-50 rounded mt-2">
              Token: {token.slice(0, 20)}...
            </div>
          )}
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
