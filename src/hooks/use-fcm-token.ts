import { useEffect, useState } from "react";
import { notificationService } from "@/core/firebase/notification-service";
import { Unsubscribe } from "firebase/messaging";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Send FCM token to backend so they can send push notifications
async function sendTokenToBackend(fcmToken: string): Promise<boolean> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (typeof window !== "undefined") {
      const authToken = localStorage.getItem("auth_token");
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }
    }

    const response = await fetch(`${API_BASE_URL}/user/fcm-token`, {
      method: "POST",
      headers,
      body: JSON.stringify({ fcm_token: fcmToken }),
    });

    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to send FCM token to backend:", error);
    return false;
  }
}

const useFcmToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<NotificationPermission | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
          if (Notification.permission === "granted") {
            const currentToken = await notificationService.getToken();
            if (currentToken) {
              setToken(currentToken);
              // Send token to backend
              await sendTokenToBackend(currentToken);
            }
          }
          setNotificationPermissionStatus(Notification.permission);
        }
      } catch (error) {
        console.error("An error occurred while retrieving token:", error);
      }
    };

    retrieveToken();
  }, []);

  const requestPermission = async () => {
    try {
      if (typeof window !== "undefined" && "Notification" in window) {
        const permission = await Notification.requestPermission();
        setNotificationPermissionStatus(permission);

        if (permission === "granted") {
          const newToken = await notificationService.getToken();
          if (newToken) {
            setToken(newToken);
            // Send token to backend
            await sendTokenToBackend(newToken);
          }
        }
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
    }
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const setupListener = async () => {
      try {
        if (typeof window !== "undefined") {
          await notificationService.initialize();
        }

        unsubscribe = notificationService.onMessageCallback((payload) => {
          setMessages((prev) => [payload, ...prev]);
        });
      } catch (error) {}
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { token, notificationPermissionStatus, requestPermission, messages };
};

export default useFcmToken;
