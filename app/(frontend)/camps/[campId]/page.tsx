"use client";

import ImageDecorations from "@/components/image-decorations";
import CampsMapSection from "@/components/pages/home/camps-map-section";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import ImageFallback from "@/components/shared/image-fallback";
import ProjectsSection from "@/features/campaign/components/projects-section";
import CampDetailsSection from "@/features/camps/components/camp-details-section";
import CampStats from "@/features/camps/components/camp-stats";
import { useCampDetails } from "@/features/camps/hooks/use-camps";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Info, SquareKanban } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function Page() {
  const t = useTranslations();
  const tCamp = useTranslations("campDetails");
  const params = useParams();
  const campSlug = params?.campId as string;
  const { data: campData, isLoading } = useCampDetails(campSlug || null);
  console.log("campData", campData);
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

  // Get coordinates for map
  const position: [number, number] | null =
    camp?.latitude && camp?.longitude
      ? [parseFloat(String(camp.latitude)), parseFloat(String(camp.longitude))]
      : null;
  return (
    <section className="container mx-auto px-4">
      {/* Breadcrumb with animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="my-10"
      >
        <Breadcrumb
          items={[
            { name: t("home"), href: "/" },
            { name: t("camps_nav"), href: "/camps" },
            { name: camp?.name || t("gablyaCamp"), href: "#" },
          ]}
        />
      </motion.div>
      {/* intro section */}
      <motion.div
        className="  space-y-6 relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Title */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Info className="text-[#4A8279]" />
          <h1 className="text-xl font-bold text-[#1E1E1E]">
            {isLoading ? tCamp("loading") : camp?.name || t("gablyaCamp")}
          </h1>
        </motion.div>

        {/* Decorative images (fade-in softly) */}
        <ImageDecorations />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 items-stretch">
          <div className="min-h-[300px]">
            <CampDetailsSection description={camp?.description} />
          </div>

          <div className="min-h-[300px]">
            <CampsMapSection secondary camps={camp ? [camp] : []} />
          </div>

          <CampStats
            familyCount={actualFamilyCount}
            childrenCount={actualMembersCount || camp?.childrenCount || 0}
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
                src={camp?.campImg || "/pages/home/gaza-camp-1.webp"}
                alt={camp?.name || "Camp"}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-1 text-start h-full justify-around">
              <h3 className="font-semibold text-[#1C3A34] leading-tight">
                {camp?.name || tCamp("loading")}
              </h3>

              {camp?.location && (
                <p className="text-gray-600  flex items-center gap-1 leading-relaxed">
                  <span className="text-gray-400">📍</span>
                  {camp.location}
                </p>
              )}

              {camp?.governorate && (
                <p className="text-gray-600  flex items-center gap-1 leading-relaxed">
                  <span className="text-gray-400">🏛️</span>
                  {typeof camp.governorate === "string"
                    ? camp.governorate
                    : camp.governorate.name}
                </p>
              )}

              {camp?.bankAccount && (
                <p className="text-gray-600  flex items-center gap-1 leading-relaxed">
                  <span className="text-gray-400">🏦</span>
                  {tCamp("bankAccount")}: {camp.bankAccount}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="my-6 flex flex-col gap-4 sm:my-12">
        {/* Title */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <SquareKanban className="text-[#4A8279]" />
          <h2 className="text-xl font-bold text-[#1E1E1E]">
            {tCamp("projectsTitle")}
          </h2>
        </motion.div>
        <ProjectsSection projects={projects} campName={camp?.name || ""} />
      </div>
    </section>
  );
}
