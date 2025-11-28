# Firebase Cloud Messaging Setup Guide

This project uses Firebase Cloud Messaging (FCM) for push notifications.

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### 2. Add a Web App to Your Firebase Project

1. In the Firebase Console, click the web icon (</>) to add a web app
2. Register your app with a nickname
3. Copy the Firebase configuration object

### 3. Enable Cloud Messaging

1. In Firebase Console, go to **Project Settings** > **Cloud Messaging**
2. Under **Web Push certificates**, click **Generate key pair**
3. Copy the VAPID key

### 4. Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key_here
```

### 5. Update Service Worker

Edit `public/firebase-messaging-sw.js` and replace the placeholder values with your actual Firebase config:

```javascript
firebase.initializeApp({
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID",
});
```

### 6. Register Service Worker

The service worker is automatically registered when the notification service initializes.

## Usage

### Enable Notifications

Use the `NotificationButton` component in your app:

```tsx
import NotificationButton from "@/components/notification-button";

export default function Header() {
  return (
    <header>
      {/* Other header content */}
      <NotificationButton />
    </header>
  );
}
```

### Send Notifications from Backend

Save the FCM token when a user enables notifications, then use it to send notifications:

```javascript
// Example using Firebase Admin SDK (Node.js backend)
const admin = require("firebase-admin");

await admin.messaging().send({
  token: userFcmToken,
  notification: {
    title: "New Message",
    body: "You have a new message!",
  },
  data: {
    url: "/dashboard/messages",
  },
});
```

### Listen for Foreground Messages

The notification service automatically listens for messages when the app is in the foreground and shows a toast notification.

## Files Created

- `lib/firebase/config.ts` - Firebase configuration
- `lib/firebase/notification-service.ts` - Notification service class
- `public/firebase-messaging-sw.js` - Service worker for background notifications
- `components/notification-button.tsx` - UI component to enable notifications
- `FIREBASE_ENV_SETUP.md` - This setup guide

## Testing

1. Enable notifications using the notification button
2. Copy the FCM token from the console
3. Use Firebase Console > Cloud Messaging > Send test message
4. Paste the token and send a test notification

## Troubleshooting

- **Service worker not registering**: Make sure the file is in the `public` directory
- **No token received**: Check browser console for errors and verify VAPID key
- **Notifications not showing**: Check browser notification permissions
- **CORS errors**: Ensure your domain is authorized in Firebase Console

## Security Notes

- Never commit `.env.local` to version control
- Keep your VAPID key secret
- Validate tokens on your backend before sending notifications
- Implement proper authentication for notification endpoints
