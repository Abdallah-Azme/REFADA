"use client";

import { useProfile } from "@/features/profile";
import CampsDetails from "./camps-details";
import EditCampFormData from "./edit-camp-form-data";
import { Loader2 } from "lucide-react";
import { useCampDetails } from "@/features/camps/hooks/use-camps";
import { useRepresentativeCampFamilies } from "@/features/contributors/hooks/use-camp-families";
import { useTranslations } from "next-intl";

export interface CampsStats {
  label: string;
  value: string;
}

export default function CampsData() {
  const t = useTranslations("camps_data");
  const { data: profileData, isLoading: profileLoading } = useProfile();

  const campSlug = profileData?.data?.camp?.slug;
  const { data: campData, isLoading: campLoading } = useCampDetails(
    campSlug || null,
  );

  const isLoading = profileLoading || campLoading;

  // Get camp data from user's profile
  const userCamp = profileData?.data?.camp;

  // Calculate dynamic stats from families data
  const families = campData?.data?.families || [];
  const totalFamilies = families.length;
  const totalMembers = families.reduce(
    (sum: number, family: any) =>
      sum + (family.totalMembers || family.members?.length || 0),
    0,
  );

  // Build dynamic camp stats from API data
  const campStats: CampsStats[] = [
    { label: t("shelter_name"), value: userCamp?.name || t("not_specified") },
    { label: t("families_count"), value: `${totalFamilies} ${t("family")}` },
    { label: t("members_count"), value: `${totalMembers} ${t("member")}` },
    {
      label: t("camp"),
      value: families[0]?.camp || userCamp?.name || t("not_specified"),
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">{t("loading")}</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8F9FA] rounded-2xl">
      <div className="flex flex-col lg:flex-row gap-5 bg-white rounded-xl p-1">
        {/* Right Section - Camp Stats */}
        <CampsDetails campStats={campStats} />

        {/* Left Section - Representative Info */}
        <EditCampFormData />
      </div>
    </div>
  );
}
