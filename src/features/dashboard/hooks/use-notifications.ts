import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Types based on API response
export interface NotificationUser {
  id: number;
  name: string;
  role: string;
}

export interface BackendNotification {
  id: number;
  type: string;
  notificationTitle: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  timeAgo: string;
  user: NotificationUser;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: BackendNotification[];
  meta: {
    total: number;
    unread_count: number;
  };
}

async function getNotifications(): Promise<NotificationsResponse> {
  const locale =
    typeof window !== "undefined" ? document.documentElement.lang : "ar";

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Accept-Language": locale || "ar",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}/notifications`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
}

async function markNotificationAsRead(notificationId: number): Promise<void> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(
    `${API_BASE_URL}/notifications/${notificationId}/read`,
    {
      method: "POST",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
