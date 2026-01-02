// Firebase Cloud Messaging Service Worker
// This file must be in the public directory

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

// Initialize Firebase in the service worker
// Configuration for Refad project
firebase.initializeApp({
  apiKey: "AIzaSyBgjHO2oqz-oMrMLFVLsHCZj_1VX1yn0Fw",
  authDomain: "refad-1239c.firebaseapp.com",
  projectId: "refad-1239c",
  storageBucket: "refad-1239c.firebasestorage.app",
  messagingSenderId: "95478141326",
  appId: "1:95478141326:web:8ed06150eb68dd604514df",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received: ", payload);
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/logo.png", // Update path to your logo
    badge: "/badge.png", // Update path to your badge
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Navigate to a specific URL when notification is clicked
  // You can send a 'url' in the data payload of the notification
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there is already a window/tab open with the target URL
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // If not, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
