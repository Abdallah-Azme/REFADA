"use client";

import { useProfile } from "@/features/profile";
import { useCampDetails } from "@/features/camps/hooks/use-camps";
import { useDelegateContributions } from "@/features/contributors/hooks/use-delegate-contributions";
import CampsMapSection from "@/components/pages/home/camps-map-section";
import Analytics from "@/features/dashboard/components/analytics";
import CampsData from "@/features/dashboard/components/camps-data";
import MainHeader from "@/features/dashboard/components/main-header";
import StatsCards from "@/features/dashboard/components/stats-cards";
import { useTranslations } from "next-intl";
import { Tent, Heart, Zap, CheckCircle, Users, Loader2 } from "lucide-react";

export default function Page() {
  const t = useTranslations("reportsPage");
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: contributionsData, isLoading: contributionsLoading } =
    useDelegateContributions();

  // Get user's camp slug from profile
  const campSlug = profileData?.data?.camp?.slug;
  const { data: campData, isLoading: campLoading } = useCampDetails(
    campSlug || null,
  );

  console.log({ campData });
  const isLoading = profileLoading || campLoading || contributionsLoading;

  // Build dynamic stats from API data
  const userCamp = profileData?.data?.camp;
  const campDetails = campData?.data;
  const projects = campDetails?.projects || [];
  const contributions = contributionsData?.data || [];

  // Count projects by status
  const pendingProjects = projects.filter(
    (p: any) =>
      (p.status === "pending" || p.status === "في الانتظار") && !p.isApproved,
  ).length;
  const completedProjects = projects.filter(
    (p: any) =>
      p.isApproved ||
      p.status === "تم التسليم" ||
      p.status === "completed" ||
      p.status === "in_progress",
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
  console.log({ projects });
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
              "of_total",
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

  if (isLoading) {
    return (
      <div className="w-full gap-6 p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">{t("loading")}</span>
      </div>
    );
  }

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      <MainHeader header={userCamp?.name || "إيواء"}>
        <Tent className="text-primary" />
      </MainHeader>

      <CampsData />

      <div className="flex flex-col lg:flex-row w-full gap-8">
        {/* Stats cards - left side */}
        <div className="w-full lg:w-1/2">
          <StatsCards
            stats={dynamicStats}
            secondary={true}
            className="grid grid-cols-2 gap-3"
            itemClassName=""
          />
        </div>

        {/* Map - right side */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-auto">
          <h2 className="text-[#333333] font-bold text-lg mb-2">
            {t("location")}
          </h2>
          <CampsMapSection
            secondary
            dashboard
            camps={campData?.data ? [campData.data] : []}
          />
        </div>
      </div>

      <Analytics
        familyCount={familyCount}
        projectCount={totalProjects}
        contributionPercentage={
          totalProjects > 0
            ? Math.round((completedProjects / totalProjects) * 100)
            : 0
        }
      />
    </div>
  );
}
