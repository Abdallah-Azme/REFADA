"use client";

import {
  RotateCcw,
  SearchCheck,
  Heart,
  Zap,
  CheckCircle,
  Users,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import AnalyticsChart from "./analytics-chart";
import ReportsFormFiltring from "./reports-form-filtring";
import StatsCards from "./stats-cards";
import { useProfile } from "@/features/profile";
import { useCampDetails } from "@/features/camps/hooks/use-camps";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useTranslations } from "next-intl";
import { useUserStatistics } from "../hooks/use-statistics";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function ReportsPage() {
  const t = useTranslations("reportsPage");
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: projectsData, isLoading: projectsLoading } = useProjects();
  const { data: statisticsData, isLoading: statisticsLoading } =
    useUserStatistics();

  // Get user's camp slug from profile
  const campSlug = profileData?.data?.camp?.slug;
  const { data: campData } = useCampDetails(campSlug || null);

  const isLoading = profileLoading || projectsLoading || statisticsLoading;

  // Build dynamic stats from API data
  const userCamp = profileData?.data?.camp;
  const campDetails = campData?.data;
  const projects = projectsData?.data || [];

  // Count projects by status
  const pendingProjects = projects.filter(
    (p) => p.status === "pending" || p.status === "في الانتظار"
  ).length;
  const completedProjects = projects.filter(
    (p) =>
      p.status === "تم التسليم" ||
      p.status === "completed" ||
      p.status === "in_progress"
  ).length;
  const totalProjects = projects.length;

  // Get family count from camp
  const familyCount = campDetails?.familyCount || userCamp?.familyCount || 0;

  // Calculate total contributions (sum of totalReceived from all projects)
  const totalContributions = projects.reduce(
    (sum, p) => sum + (p.totalReceived || 0),
    0
  );

  const dynamicStats = [
    {
      icon: Heart,
      label: t("contributions"),
      value: totalContributions.toLocaleString(),
      subtitle: t("total_contributions"),
      color: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      icon: Zap,
      label: t("current_projects"),
      value: pendingProjects.toString(),
      subtitle: `${t("total_projects")}: ${totalProjects}`,
      subColor: "text-orange-500",
      color: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      icon: CheckCircle,
      label: t("completed_projects"),
      value: completedProjects.toString(),
      subtitle:
        totalProjects > 0
          ? `${Math.round((completedProjects / totalProjects) * 100)}% ${t(
              "of_total"
            )}`
          : "0%",
      subColor: "text-green-500",
      color: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      icon: Users,
      label: t("families_count"),
      value: familyCount.toLocaleString(),
      subtitle: userCamp?.name || t("camp"),
      subColor: "text-blue-500",
      color: "bg-blue-50",
      iconColor: "text-blue-500",
    },
  ];

  const formSchema = z.object({
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    reportType: z.string().optional(),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromDate: "",
      toDate: "",
      reportType: "",
    },
  });

  // Parse statistics data for charts
  const lastMonths = statisticsData?.data?.lastMonths || {};
  const monthKeys = Object.keys(lastMonths);

  // Helper to parse percentage string to number
  const parsePercentage = (str: string): number => {
    return parseInt(str.replace("%", "")) || 0;
  };

  // Get chart data for each month (reversed to show most recent first)
  const chartData = monthKeys.map((monthKey) => {
    const monthStats = lastMonths[monthKey];
    return {
      title: `${t("month_report")} ${monthKey}`,
      familyCount: monthStats?.familiesCount || 0,
      projectCount: monthStats?.projectsCount || 0,
      contributionPercentage: parsePercentage(
        monthStats?.contributionsPercentage || "0%"
      ),
    };
  });

  // Ensure we have 3 charts (pad with empty data if needed)
  while (chartData.length < 3) {
    chartData.push({
      title: t("month_report"),
      familyCount: 0,
      projectCount: 0,
      contributionPercentage: 0,
    });
  }

  if (isLoading) {
    return (
      <div className="w-full gap-6 py-4 px-8 bg-white rounded-lg flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">{t("loading")}</span>
      </div>
    );
  }

  return (
    <div className="w-full  gap-6 py-4 px-8 bg-white rounded-lg  ">
      <div className="py-2  px-4 ">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
          {/* FORM */}
          <ReportsFormFiltring form={form} formSchema={formSchema} />

          <div className="flex gap-1">
            <Button
              className="bg-primary w-1/2 text-white px-6 flex-1 py-2 rounded-xl flex items-center gap-2 text-sm font-medium"
              size="lg"
            >
              <SearchCheck className="w-4 h-4" />
              {t("search")}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="px-6 flex-1 shrink-0 w-1/2 py-2 rounded-xl"
              onClick={() => form.reset()}
            >
              <RotateCcw className="w-4 h-4 text-primary" />
              {t("reset_search")}
            </Button>
          </div>
        </div>
      </div>
      {/* grid of stats */}
      <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-3 my-5">
        <AnalyticsChart
          title={chartData[0].title}
          familyCount={chartData[0].familyCount}
          projectCount={chartData[0].projectCount}
          contributionPercentage={chartData[0].contributionPercentage}
        />
        <AnalyticsChart
          title={chartData[1].title}
          familyCount={chartData[1].familyCount}
          projectCount={chartData[1].projectCount}
          contributionPercentage={chartData[1].contributionPercentage}
        />
        <AnalyticsChart
          title={chartData[2].title}
          familyCount={chartData[2].familyCount}
          projectCount={chartData[2].projectCount}
          contributionPercentage={chartData[2].contributionPercentage}
        />
      </div>

      <StatsCards
        stats={dynamicStats}
        className="bg-[#F7F2F2] p-3 my-2 rounded-lg"
      />
    </div>
  );
}
