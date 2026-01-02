import { useEffect, useState } from "react";
import { notificationService } from "@/core/firebase/notification-service";
import { Unsubscribe } from "firebase/messaging";

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
          // Ensure initialized (wrapper might handle this but good to be safe)
          // Actually notificationService.onMessageCallback checks this.messaging
          // which is set in initialize. But initialize is called in getToken.
          // If we haven't got a token yet, messaging might be null.
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
