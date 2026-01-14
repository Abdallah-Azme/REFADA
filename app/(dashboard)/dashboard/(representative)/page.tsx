"use client";

import { useProfile } from "@/features/profile";
import { useTranslations } from "next-intl";
import { useCampDetails } from "@/features/camps/hooks/use-camps";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useDelegateContributions } from "@/features/contributors/hooks/use-delegate-contributions";
import Analytics from "@/features/dashboard/components/analytics";
import ProjectsTable from "@/features/dashboard/components/projects-table";
import StatsCards from "@/features/dashboard/components/stats-cards";
import { Heart, Zap, CheckCircle, Users, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const t = useTranslations("admin.representative_dashboard");
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: projectsData, isLoading: projectsLoading } = useProjects();
  const { data: contributionsData, isLoading: contributionsLoading } =
    useDelegateContributions();

  // Get user's camp slug from profile
  const campSlug = profileData?.data?.camp?.slug;
   const { data: campData } = useCampDetails(campSlug || null);

 
  const isLoading = profileLoading || projectsLoading || contributionsLoading;

  // Build dynamic stats from API data
  const userCamp = profileData?.data?.camp;
  const campDetails = campData?.data;
  const projects = projectsData?.data || [];
  const contributions = contributionsData?.data || [];

 
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

  // Get family count from camp - use statistics object first (most accurate)
  const familyCount =
    campDetails?.statistics?.familyCount ||
    campDetails?.families?.length ||
    campDetails?.familyCount ||
    userCamp?.familyCount ||
    0;

  // Get total contributions count from the contributions API
  const totalContributions = contributions.length;

  const dynamicStats = [
    {
      icon: Heart,
      label: t("contributions"),
      value: totalContributions.toLocaleString("ar-EG"),
      subtitle: t("completed_contributions_total"),
      color: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      icon: Zap,
      label: t("current_projects_count"),
      value: pendingProjects.toString(),
      subtitle: t("total_projects", { count: totalProjects }),
      subColor: "text-orange-500",
      color: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      icon: CheckCircle,
      label: t("executed_projects_count"),
      value: completedProjects.toString(),
      subtitle:
        totalProjects > 0
          ? t("of_total", {
              percentage: Math.round((completedProjects / totalProjects) * 100),
            })
          : "0%",
      subColor: "text-green-500",
      color: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      icon: Users,
      label: t("families_count"),
      value: familyCount.toLocaleString("ar-EG"),
      subtitle: userCamp?.name || t("camp"),
      subColor: "text-blue-500",
      color: "bg-blue-50",
      iconColor: "text-blue-500",
    },
  ];

 
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">{t("loading")}</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <StatsCards
        title={t("stats_header")}
        stats={dynamicStats}
        showTitle={true}
      />
      <Analytics />
      <ProjectsTable hideApproveDelete />
    </div>
  );
}
