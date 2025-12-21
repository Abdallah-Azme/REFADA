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
        return false;
      }

      this.messaging = getMessaging(app);
      return true;
    } catch (error) {
      return false;
    }
  }

  async requestPermission(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        return await this.getToken();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      if (!this.messaging) {
        await this.initialize();
      }

      if (!this.vapidKey) {
        return null;
      }

      const token = await getToken(this.messaging, {
        vapidKey: this.vapidKey,
      });

      if (token) {
        return token;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  onMessageListener(): Promise<any> {
    return new Promise((resolve) => {
      if (!this.messaging) {
        return;
      }

      onMessage(this.messaging, (payload) => {
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
