"use client";

import { ChevronLeft } from "lucide-react";
import LatestActivities from "./latest-activities";
import AnalyticsChart from "./analytics-chart";

export default function Analytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4 px-6   bg-white rounded-md  overflow-hidden">
      <LatestActivities />

      <AnalyticsChart />
    </div>
  );
}
