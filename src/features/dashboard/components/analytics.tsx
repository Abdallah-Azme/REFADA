"use client";

import LatestActivities from "./latest-activities";
import AnalyticsChart from "./analytics-chart";

interface AnalyticsProps {
  familyCount?: number;
  projectCount?: number;
  contributionPercentage?: number;
}

export default function Analytics({
  familyCount = 0,
  projectCount = 0,
  contributionPercentage = 0,
}: AnalyticsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4 px-6   bg-white rounded-md  overflow-hidden">
      <LatestActivities />

      <AnalyticsChart
        familyCount={familyCount}
        projectCount={projectCount}
        contributionPercentage={contributionPercentage}
      />
    </div>
  );
}
