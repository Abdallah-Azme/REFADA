"use client";

import { cn } from "@/lib/utils";
import { useCampFamilyStatistics } from "@/features/camps/hooks/use-camps";
import { Tent, Users, FolderKanban, Loader2 } from "lucide-react";

interface CampFamilyStatsProps {
  className?: string;
}

export default function CampFamilyStats({ className }: CampFamilyStatsProps) {
  const { data, isLoading, error } = useCampFamilyStatistics();
  const camps = data?.data || [];

  if (isLoading) {
    return (
      <section className={cn("flex flex-col gap-2", className)}>
        <h2 className="text-[#333333] font-bold text-lg">إحصائيات الإيواءات</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mr-2 text-gray-500">جاري تحميل الإحصائيات...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cn("flex flex-col gap-2", className)}>
        <h2 className="text-[#333333] font-bold text-lg">إحصائيات الإيواءات</h2>
        <div className="flex items-center justify-center py-8 text-red-500">
          حدث خطأ أثناء تحميل الإحصائيات
        </div>
      </section>
    );
  }

  if (camps.length === 0) {
    return (
      <section className={cn("flex flex-col gap-2", className)}>
        <h2 className="text-[#333333] font-bold text-lg">إحصائيات الإيواءات</h2>
        <div className="flex items-center justify-center py-8 text-gray-500">
          لا توجد إحصائيات متاحة
        </div>
      </section>
    );
  }

  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <h2 className="text-[#333333] font-bold text-lg">إحصائيات الإيواءات</h2>
      <div className="space-y-6">
        {camps.map((camp) => (
          <div
            key={camp.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            {/* Camp Name Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Tent className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-[#333333]">{camp.name}</h3>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Family Count */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">عدد العائلات</p>
                  <p className="text-2xl font-bold text-[#333333]">
                    {camp.familyCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              {/* Member Count */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">عدد الأفراد</p>
                  <p className="text-2xl font-bold text-[#333333]">
                    {camp.memberCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>

              {/* Project Count */}
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">عدد المشاريع</p>
                  <p className="text-2xl font-bold text-[#333333]">
                    {camp.projectCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FolderKanban className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
