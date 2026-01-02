"use client";

import LatestActivities from "./latest-activities";
import AnalyticsChart from "./analytics-chart";
import { useUserStatistics } from "../hooks/use-statistics";
import { useTranslations } from "next-intl";

export default function Analytics() {
  const t = useTranslations("reportsPage");
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4 px-6   bg-white rounded-md  overflow-hidden">
      <LatestActivities />

      <AnalyticsChart
        title={
          lastMonthKey ? `${t("month_report")} ${lastMonthKey}` : undefined
        }
        familyCount={lastMonthStats?.familiesCount || 0}
        projectCount={lastMonthStats?.projectsCount || 0}
        contributionPercentage={parsePercentage(
          lastMonthStats?.contributionsPercentage || "0%"
        )}
      />
    </div>
  );
}
