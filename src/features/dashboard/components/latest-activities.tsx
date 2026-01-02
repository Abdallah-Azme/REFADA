"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import React from "react";
import CardTitle from "./card-title";
import { useMyActivities } from "../hooks/use-activities";
import { Activity } from "../types/activities.schema";
import { useTranslations, useLocale } from "next-intl";

// Get icon based on activity type
function getActivityIcon(activity: Activity) {
  const description = activity.description;

  // Check for create/add actions
  if (
    description.includes("تم إنشاء") ||
    description.includes("تم إضافة") ||
    description.includes("created") ||
    description.includes("added")
  ) {
    return {
      bg: "bg-green-100",
      color: "text-green-600",
      icon: "✓",
    };
  }

  // Check for update actions
  if (description.includes("تم تحديث") || description.includes("updated")) {
    return {
      bg: "bg-blue-100",
      color: "text-blue-600",
      icon: "⊙",
    };
  }

  // Check for delete actions
  if (description.includes("تم حذف") || description.includes("deleted")) {
    return {
      bg: "bg-red-100",
      color: "text-red-600",
      icon: "✕",
    };
  }

  // Default - informational
  return {
    bg: "bg-yellow-100",
    color: "text-yellow-600",
    icon: "!",
  };
}

// Format date to relative time or readable format
// Server returns UTC time without timezone indicator, so we treat it as UTC
function formatActivityDate(
  dateString: string,
  locale: string,
  t: (key: string, values?: Record<string, string | number>) => string
) {
  // Server returns format "2026-01-02 12:03:25" which is UTC but without 'Z'
  // Add 'Z' to force UTC interpretation, or replace space with 'T' for ISO format
  const utcDateString = dateString.replace(" ", "T") + "Z";
  const date = new Date(utcDateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return t("time_now");
  if (diffMins < 60) return t("time_minutes_ago", { count: diffMins });
  if (diffHours < 24) return t("time_hours_ago", { count: diffHours });
  if (diffDays < 7) return t("time_days_ago", { count: diffDays });

  return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function LatestActivities({
  className,
}: {
  className?: string;
}) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const { data, isLoading, isError } = useMyActivities();
  const activities = data?.data || [];

  // Show only latest 5 activities
  const latestActivities = activities.slice(0, 5);

  return (
    <div className={cn("lg:col-span-1", className)}>
      <CardTitle title={t("latest_activities")} />

      <div className="space-y-3">
        {isLoading && (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center p-6 text-red-500 text-sm">
            {t("activities_loading_error")}
          </div>
        )}

        {!isLoading && !isError && latestActivities.length === 0 && (
          <div className="flex items-center justify-center p-6 text-gray-500 text-sm">
            {t("no_activities")}
          </div>
        )}

        {!isLoading &&
          !isError &&
          latestActivities.map((activity) => {
            const iconStyle = getActivityIcon(activity);
            return (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg border border-[#E4E4E4]"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      iconStyle.bg
                    )}
                  >
                    <span className={cn("text-sm", iconStyle.color)}>
                      {iconStyle.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatActivityDate(activity.created_at, locale, t)}
                    </p>
                  </div>
                </div>
                {locale === "ar" ? (
                  <ChevronLeft className="w-4 h-4 text-gray-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
