"use client";

import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Loader2 } from "lucide-react";
import NotificationItem from "./notification-item";
import useFcmToken from "../../../hooks/use-fcm-token";
import {
  useNotifications,
  BackendNotification,
} from "../hooks/use-notifications";

// Map backend notification type to UI type
function getNotificationType(
  notification: BackendNotification,
): "error" | "info" | "success" {
  // You can customize this based on notification.type
  if (notification.type === "error" || notification.type === "rejection") {
    return "error";
  }
  if (notification.type === "success" || notification.type === "approval") {
    return "success";
  }
  return "info";
}

export default function Notification() {
  const { notificationPermissionStatus, requestPermission, messages } =
    useFcmToken();

  const { data: notificationsData, isLoading } = useNotifications();

  // FCM real-time messages (foreground)
  const fcmNotifications = messages.map((msg: any) => ({
    type: "info" as const,
    title: msg.notification?.title || "إشعار جديد",
    description: msg.notification?.body,
    timeAgo: "الآن",
  }));

  // Backend notifications
  const backendNotifications = (notificationsData?.data || []).map(
    (notification) => ({
      type: getNotificationType(notification),
      title: notification.notificationTitle,
      description: notification.message,
      timeAgo: notification.timeAgo,
      isRead: notification.isRead,
    }),
  );

  // Combine: FCM first (newest), then backend
  const allNotifications = [...fcmNotifications, ...backendNotifications];
  const unreadCount =
    notificationsData?.meta?.unread_count || fcmNotifications.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="center"
        className="w-[380px] p-0 rounded-xl"
        onWheel={(e) => e.stopPropagation()}
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : allNotifications.length > 0 ? (
            allNotifications.map((item, idx) => (
              <NotificationItem key={idx} {...item} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              لا توجد إشعارات
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
