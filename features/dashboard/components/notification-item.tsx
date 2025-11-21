"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, CheckCircle, Info } from "lucide-react";

type NotificationType = "error" | "info" | "success";

interface ActionButton {
  label: string;
  variant?: "primary" | "secondary";
}

interface NotificationItemProps {
  type: NotificationType;
  title: string;
  description?: string;
  actions?: ActionButton[];
}

export default function NotificationItem({
  type,
  title,
  description,
  actions,
}: NotificationItemProps) {
  const iconMap = {
    error: <AlertTriangle className="w-5 h-5 text-red-500 mt-[2px]" />,
    info: <Info className="w-5 h-5 text-sky-500 mt-[2px]" />,
    success: <CheckCircle className="w-5 h-5 text-green-500 mt-[2px]" />,
  };

  return (
    <div className="p-2 rounded-xl   bg-white ">
      <div className="flex items-start gap-3">
        {iconMap[type]}
        <div className="flex-1">
          <p className="font-medium text-sm text-black">{title}</p>

          {description && (
            <p className="text-black/40 text-xs mt-1">{description}</p>
          )}

          {actions && actions.length > 0 && (
            <div className="flex gap-3 mt-3">
              {actions.map((action, idx) => (
                <Button
                  key={idx}
                  className={`px-5 py-1.5 min-w-20 text-xs rounded-md ${
                    action.variant === "secondary"
                      ? "bg-secondary text-primary hover:text-white"
                      : "bg-primary text-white"
                  }`}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
