"use client";

import { useEffect, useState } from "react";
import { notificationService } from "@/lib/firebase/notification-service";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";

export default function NotificationButton() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if notifications are already enabled
    if ("Notification" in window) {
      setIsEnabled(Notification.permission === "granted");
    }

    // Initialize Firebase Messaging
    notificationService.initialize();

    // Listen for foreground messages
    notificationService.onMessageListener().then((payload: any) => {
      console.log("Received foreground message:", payload);

      toast(payload.notification?.title || "New Notification", {
        description: payload.notification?.body,
      });
    });
  }, []);

  const handleEnableNotifications = async () => {
    const fcmToken = await notificationService.requestPermission();

    if (fcmToken) {
      setToken(fcmToken);
      setIsEnabled(true);
      toast.success("Notifications enabled successfully!");

      // TODO: Send token to your backend to store it
      console.log("FCM Token to save:", fcmToken);
    } else {
      toast.error("Failed to enable notifications");
    }
  };

  if (!("Notification" in window)) {
    return null; // Don't show button if notifications aren't supported
  }

  return (
    <Button
      variant={isEnabled ? "default" : "outline"}
      size="icon"
      onClick={handleEnableNotifications}
      disabled={isEnabled}
      title={isEnabled ? "Notifications enabled" : "Enable notifications"}
    >
      {isEnabled ? (
        <Bell className="h-5 w-5" />
      ) : (
        <BellOff className="h-5 w-5" />
      )}
    </Button>
  );
}
