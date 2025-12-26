"use client";

import { useProfile } from "@/features/profile";
import { useCampDetails } from "@/features/camps/hooks/use-camps";
import CampsMapSection from "@/components/pages/home/camps-map-section";
import Analytics from "@/features/dashboard/components/analytics";
import CampsData from "@/features/dashboard/components/camps-data";
import MainHeader from "@/features/dashboard/components/main-header";
import StatsCards from "@/features/dashboard/components/stats-cards";
import { Tent, Heart, Zap, CheckCircle, Users, Loader2 } from "lucide-react";

export default function Page() {
  const { data: profileData, isLoading: profileLoading } = useProfile();

  // Get user's camp slug from profile
  const campSlug = profileData?.data?.camp?.slug;
  const { data: campData, isLoading: campLoading } = useCampDetails(
    campSlug || null
  );

  const isLoading = profileLoading || campLoading;

  // Build dynamic stats from API data
  const userCamp = profileData?.data?.camp;
  const campDetails = campData?.data;
  const projects = campDetails?.projects || [];

  // Count projects by status
  const pendingProjects = projects.filter(
    (p: any) => p.status === "pending" || p.status === "في الانتظار"
  ).length;
  const completedProjects = projects.filter(
    (p: any) =>
      p.status === "تم التسليم" ||
      p.status === "completed" ||
      p.status === "in_progress"
  ).length;
  const totalProjects = projects.length;

  // Get stats from camp
  const familyCount = campDetails?.familyCount || userCamp?.familyCount || 0;

  // Calculate total contributions (sum of totalReceived from all projects)
  const totalContributions = projects.reduce(
    (sum: number, p: any) => sum + (p.totalReceived || 0),
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
      <div className="w-full gap-6 p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">جاري التحميل...</span>
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
        <div className="w-full lg:w-1/2">
          <h2 className="text-[#333333] font-bold text-lg mb-2">الموقع </h2>
          <CampsMapSection secondary dashboard />
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
