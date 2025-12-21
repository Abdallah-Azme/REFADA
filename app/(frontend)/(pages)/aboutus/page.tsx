"use client";

import PartnersSection from "@/components/pages/home/partners-section";
import PolicySection from "@/components/pages/home/policy-section";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import ImageFallback from "@/components/shared/image-fallback";
import MissionVisionGoals from "@/components/shared/mission-vision-goals";
import { PageSection } from "@/components/shared/page-section";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useAboutUs } from "@/features/pages/hooks/use-pages";
import { useHero } from "@/features/home-control/hooks/use-hero";

export default function Page() {
  const t = useTranslations();
  const locale = useLocale();
  const { data: aboutUsData, isLoading } = useAboutUs();
  const { data: homePageData } = useHero();

  // Get localized content
  const title =
    aboutUsData?.data?.title?.[locale as "ar" | "en"] || t("aboutus");
  const description =
    aboutUsData?.data?.description?.[locale as "ar" | "en"] || "";

  const mainImage =
    aboutUsData?.data?.image || "/pages/pages/shaking-hands.webp";
  const secondImage =
    aboutUsData?.data?.second_image || "/pages/pages/shaking-hands.webp";
  const sections = homePageData?.data?.sections || [];

  return (
    <section className="flex flex-col gap-8 sm:gap-12 container mx-auto px-4">
      {/* Breadcrumb with animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mt-10"
      >
        <Breadcrumb
          items={[
            { name: t("home"), href: "/" },
            { name: t("aboutus"), href: "/aboutus" },
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
          <Info size={20} className="text-[#4a8279]" />
          <h1 className="text-xl font-bold text-[#1E1E1E]">{title}</h1>
        </motion.div>

        {/* Decorative images (fade-in softly) */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <ImageFallback
            src="/pages/pages/wheat.webp"
            width={136}
            height={184}
            className="absolute bottom-0 right-0 w-[136px] h-[184px]"
          />
          <ImageFallback
            src="/pages/pages/heart.webp"
            width={78}
            height={64}
            className="absolute top-0 left-1/4 w-16 h-[78px]"
          />
        </motion.div>
        <div className="flex flex-col lg:flex-row-reverse gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative w-full lg:w-1/2 h-[300px] sm:h-[350px] shrink-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50"
          >
            <ImageFallback
              src={mainImage}
              fill
              className="object-cover"
              alt={title}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex-1 bg-white/50 backdrop-blur-sm  rounded-3xl "
          >
            <PageSection
              description={
                isLoading ? (
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
                  </div>
                ) : (
                  <div
                    className="leading-10 text-lg text-gray-700 [&_ul]:list-disc [&_ul]:pr-5 [&_ol]:list-decimal [&_ol]:pr-5"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                )
              }
            />
          </motion.div>
        </div>
      </motion.div>

      <PolicySection secondary sections={sections} />
      <MissionVisionGoals />
      <PartnersSection secondary />
    </section>
  );
}
