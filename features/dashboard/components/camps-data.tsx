"use client";

import CampsDetails from "./camps-details";
import EditCampFormData from "./edit-camp-form-data";

export interface CampsStats {
  label: string;
  value: string;
}

export const campStats = [
  { label: "اسم المخيم", value: "اضافه" },
  { label: "عدد العائلات", value: "320 عائلة" },
  { label: "عدد الأطفال", value: "3120 طفل" },
  { label: "عدد كبار السن", value: "32 شيخ" },
];

export default function CampsData() {
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
