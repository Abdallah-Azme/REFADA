"use client";

import { useProfile } from "@/features/profile";
import { useCampDetails } from "@/features/camps/hooks/use-camps";
import { useProjects } from "@/features/projects/hooks/use-projects";
import Analytics from "@/features/dashboard/components/analytics";
import ProjectsTable from "@/features/dashboard/components/projects-table";
import StatsCards from "@/features/dashboard/components/stats-cards";
import { Heart, Zap, CheckCircle, Users, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: projectsData, isLoading: projectsLoading } = useProjects();

  // Get user's camp slug from profile
  const campSlug = profileData?.data?.camp?.slug;
  const { data: campData } = useCampDetails(campSlug || null);

  console.log("campData", campData);
  const isLoading = profileLoading || projectsLoading;

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

  // Get family count from camp - use statistics object first (most accurate)
  const familyCount =
    campDetails?.statistics?.familyCount ||
    campDetails?.families?.length ||
    campDetails?.familyCount ||
    userCamp?.familyCount ||
    0;

  // Calculate total contributions (sum of totalReceived from all projects)
  const totalContributions = projects.reduce(
    (sum, p) => sum + (p.totalReceived || 0),
    0
  );

  const dynamicStats = [
    {
      icon: Heart,
      label: "المساهمات",
      value: totalContributions.toLocaleString("ar-EG"),
      subtitle: "مجموع المساهمات المنتهية",
      color: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      icon: Zap,
      label: "عدد المشاريع الحالية",
      value: pendingProjects.toString(),
      subtitle: `إجمالي المشاريع: ${totalProjects}`,
      subColor: "text-orange-500",
      color: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      icon: CheckCircle,
      label: "عدد المشاريع المنفذة",
      value: completedProjects.toString(),
      subtitle:
        totalProjects > 0
          ? `${Math.round(
              (completedProjects / totalProjects) * 100
            )}% من الإجمالي`
          : "0%",
      subColor: "text-green-500",
      color: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      icon: Users,
      label: "عدد العائلات",
      value: familyCount.toLocaleString("ar-EG"),
      subtitle: userCamp?.name || "المخيم",
      subColor: "text-blue-500",
      color: "bg-blue-50",
      iconColor: "text-blue-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">جاري التحميل...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <StatsCards stats={dynamicStats} showTitle={false} />
      <Analytics />
      <ProjectsTable hideApproveDelete />
    </div>
  );
}
