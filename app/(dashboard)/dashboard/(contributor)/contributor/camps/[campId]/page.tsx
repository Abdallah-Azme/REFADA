"use client";

import CampsMapSection from "@/components/pages/home/camps-map-section";
import ImageFallback from "@/components/shared/image-fallback";
import CampDetailsSection from "@/features/camps/components/camp-details-section";
import CurrentProjectsTableContribution from "@/features/dashboard/components/current-project-table-contribution";
import MainHeader from "@/features/dashboard/components/main-header";
import { cn } from "@/lib/utils";
import CampStats from "@/src/features/camps/components/camp-stats";
import { motion } from "framer-motion";
import { Loader2, Tent } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useCampDetails } from "@/features/camps/hooks/use-camps";
import { useLocale } from "next-intl";

// Helper to extract text from localized field
function getLocalizedText(
  field: string | { ar?: string; en?: string } | undefined | null,
  locale: string = "ar"
): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return (locale === "ar" ? field.ar : field.en) || field.ar || field.en || "";
}

export default function Page() {
  const t = useTranslations();
  const tCamp = useTranslations("campDetails");
  const locale = useLocale();
  const params = useParams();
  const campSlug = params?.campId as string;

  const {
    data: campData,
    isLoading,
    isError,
  } = useCampDetails(campSlug || null);

  const camp = campData?.data;

  const projects = camp?.projects || [];
  const families = camp?.families || [];

  // Use statistics object as primary source (most accurate), fallback to calculated values
  const actualFamilyCount =
    camp?.statistics?.familyCount || families.length || camp?.familyCount || 0;
  const actualMembersCount =
    camp?.statistics?.memberCount ||
    families.reduce(
      (sum, family) => sum + (family.totalMembers || family.membersCount || 0),
      0
    );

  // Get localized camp name and description
  const campName = getLocalizedText(camp?.name, locale);
  const campDescription = getLocalizedText(camp?.description, locale);

  if (isLoading) {
    return (
      <main className="w-full flex flex-col gap-6 p-8 bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mr-3 text-gray-600">
            جاري تحميل بيانات الإيواء...
          </span>
        </div>
      </main>
    );
  }

  if (isError || !camp) {
    return (
      <main className="w-full flex flex-col gap-6 p-8 bg-gray-50">
        <div className="text-center py-20">
          <p className="text-red-500">حدث خطأ أثناء تحميل البيانات</p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full flex flex-col gap-6 p-8 bg-gray-50">
      <div className="flex items-center justify-between mb-5">
        <MainHeader header={campName || tCamp("title")}>
          <Tent />
        </MainHeader>
      </div>

      {/* Stats cards - left side */}
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 items-stretch">
          <CampDetailsSection description={campDescription || null} />

          <CampsMapSection secondary camps={camp ? [camp] : []} />

          <CampStats
            familyCount={actualFamilyCount}
            membersCount={actualMembersCount || camp.childrenCount || 0}
            projectsCount={projects.length}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4 pointer-events-auto",
              "h-full"
            )}
          >
            {/* Image */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
              <ImageFallback
                src={camp.campImg || "/pages/home/gaza-camp-1.webp"}
                alt={campName || "Camp"}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-1 text-right h-full justify-around">
              <h3 className="font-semibold text-[#1C3A34] leading-tight">
                {campName}
              </h3>

              {camp.location && (
                <p className="text-gray-600 flex items-center gap-1 leading-relaxed">
                  <span className="text-gray-400">📍</span>
                  {camp.location}
                </p>
              )}

              {camp.governorate && (
                <p className="text-gray-600 flex items-center gap-1 leading-relaxed">
                  <span className="text-gray-400">🏛️</span>
                  {typeof camp.governorate === "string"
                    ? camp.governorate
                    : camp.governorate.name}
                </p>
              )}

              {camp.bankAccount && (
                <p className="text-gray-600 flex items-center gap-1 leading-relaxed">
                  <span className="text-gray-400">🏦</span>
                  {tCamp("bankAccount")}: {camp.bankAccount}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <CurrentProjectsTableContribution projects={projects} campId={camp.id} />
    </main>
  );
}
