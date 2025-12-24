"use client";

import { useProfile } from "@/features/profile";
import CampsDetails from "./camps-details";
import EditCampFormData from "./edit-camp-form-data";
import { Loader2 } from "lucide-react";

export interface CampsStats {
  label: string;
  value: string;
}

export default function CampsData() {
  const { data: profileData, isLoading } = useProfile();

  // Get camp data from user's profile
  const userCamp = profileData?.data?.camp;

  // Build dynamic camp stats from profile data
  const campStats: CampsStats[] = [
    { label: "اسم الإيواء", value: userCamp?.name || "غير محدد" },
    { label: "عدد العائلات", value: `${userCamp?.familyCount || 0} عائلة` },
    { label: "عدد الأطفال", value: `${userCamp?.childrenCount || 0} طفل` },
    { label: "عدد كبار السن", value: `${userCamp?.elderlyCount || 0} شيخ` },
  ];

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">جاري التحميل...</span>
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
