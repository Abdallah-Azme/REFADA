"use client";

import LatestActivities from "./latest-activities";
import AnalyticsChart from "./analytics-chart";
import { useUserStatistics } from "../hooks/use-statistics";
import { useTranslations, useLocale } from "next-intl";

// Arabic month names mapping
const arabicMonths: Record<string, string> = {
  January: "يناير",
  February: "فبراير",
  March: "مارس",
  April: "أبريل",
  May: "مايو",
  June: "يونيو",
  July: "يوليو",
  August: "أغسطس",
  September: "سبتمبر",
  October: "أكتوبر",
  November: "نوفمبر",
  December: "ديسمبر",
};

// Helper to translate month key based on locale
const translateMonthKey = (monthKey: string, locale: string): string => {
  if (locale === "ar") {
    for (const [en, ar] of Object.entries(arabicMonths)) {
      if (monthKey.includes(en)) {
        return monthKey.replace(en, ar);
      }
    }
  }
  return monthKey;
};

interface AnalyticsProps {
  familyCount?: number;
  projectCount?: number;
  contributionPercentage?: number;
}

export default function Analytics({
  familyCount: propFamilyCount,
  projectCount: propProjectCount,
  contributionPercentage: propContributionPercentage,
}: AnalyticsProps) {
  const t = useTranslations("reportsPage");
  const locale = useLocale();
  const { data: statisticsData } = useUserStatistics();

  // Get the last month from the statistics data
  const lastMonths = statisticsData?.data?.lastMonths || {};
  const monthKeys = Object.keys(lastMonths);

  // Get the most recent month (last key in the object)
  const lastMonthKey = monthKeys[monthKeys.length - 1] || "";
  const lastMonthStats = lastMonths[lastMonthKey];

  // Parse percentage string to number
  const parsePercentage = (str: string): number => {
    return parseInt(str?.replace("%", "") || "0") || 0;
  };

  const familyCount = propFamilyCount ?? (lastMonthStats?.familiesCount || 0);
  const projectCount = propProjectCount ?? (lastMonthStats?.projectsCount || 0);
  const contributionPercentage =
    propContributionPercentage ??
    parsePercentage(lastMonthStats?.contributionsPercentage || "0%");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4 px-6   bg-white rounded-md  overflow-hidden">
      <LatestActivities />

      <AnalyticsChart
        title={
          lastMonthKey
            ? `${t("month_report")} ${translateMonthKey(lastMonthKey, locale)}`
            : undefined
        }
        familyCount={familyCount}
        projectCount={projectCount}
        contributionPercentage={contributionPercentage}
      />
    </div>
  );
}
