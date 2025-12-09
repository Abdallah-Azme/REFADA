import { ContactMessage } from "../types/message.schema";

export const messageService = {
  /**
   * Formats date for display in Arabic
   */
  formatDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  },

  /**
   * Gets status label in Arabic
   */
  getStatusLabel(status: "new" | "read" | "replied"): string {
    const labels = {
      new: "جديدة",
      read: "مقروءة",
      replied: "تم الرد",
    };
    return labels[status];
  },

  /**
   * Gets status badge variant
   */
  getStatusVariant(
    status: "new" | "read" | "replied"
  ): "default" | "secondary" {
    return status === "read" ? "secondary" : "default";
  },

  /**
   * Gets status badge color class
   */
  getStatusColor(status: "new" | "read" | "replied"): string {
    const colors = {
      new: "bg-blue-500",
      read: "",
      replied: "bg-green-500",
    };
    return colors[status];
  },

  /**
   * Checks if message is new
   */
  isNew(message: ContactMessage): boolean {
    return message.status === "new";
  },

  /**
   * Marks message as read
   */
  markAsRead(message: ContactMessage): ContactMessage {
    return {
      ...message,
      status: "read",
    };
  },

  /**
   * Marks message as replied
   */
  markAsReplied(message: ContactMessage): ContactMessage {
    return {
      ...message,
      status: "replied",
    };
  },
};
