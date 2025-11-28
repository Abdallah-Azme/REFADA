import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import { app } from "./config";

class NotificationService {
  private messaging: any = null;
  private vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

  async initialize() {
    try {
      const supported = await isSupported();
      if (!supported) {
        console.log("Firebase Messaging is not supported in this browser");
        return false;
      }

      this.messaging = getMessaging(app);
      return true;
    } catch (error) {
      console.error("Error initializing Firebase Messaging:", error);
      return false;
    }
  }

  async requestPermission(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        console.log("Notification permission granted");
        return await this.getToken();
      } else {
        console.log("Notification permission denied");
        return null;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      if (!this.messaging) {
        await this.initialize();
      }

      if (!this.vapidKey) {
        console.error("VAPID key is not configured");
        return null;
      }

      const token = await getToken(this.messaging, {
        vapidKey: this.vapidKey,
      });

      if (token) {
        console.log("FCM Token:", token);
        return token;
      } else {
        console.log("No registration token available");
        return null;
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
  }

  onMessageListener(): Promise<any> {
    return new Promise((resolve) => {
      if (!this.messaging) {
        console.error("Messaging not initialized");
        return;
      }

      onMessage(this.messaging, (payload) => {
        console.log("Message received in foreground:", payload);
        resolve(payload);
      });
    });
  }

  async showNotification(title: string, options?: NotificationOptions) {
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, options);
      } catch (error) {
        console.error("Error showing notification:", error);
      }
    }
  }
}

export const notificationService = new NotificationService();
