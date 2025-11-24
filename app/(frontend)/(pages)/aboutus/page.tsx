"use client";

import PartnersSection from "@/components/pages/home/partners-section";
import PolicySection from "@/components/pages/home/policy-section";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import ImageFallback from "@/components/shared/image-fallback";
import MissionVisionGoals from "@/components/shared/mission-vision-goals";
import { PageSection } from "@/components/shared/page-section";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations();

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
          <h1 className="text-xl font-bold text-[#1E1E1E]">{t("aboutus")}</h1>
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
        <div className="flex flex-col sm:flex-row gap-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex-1"
          >
            <PageSection
              description={
                <>
                  <p>{t("transparencyDescription")}</p>
                  <p className="leading-10 line-clamp-6">
                    {t("transparencyParagraph")}
                  </p>
                </>
              }
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex-1 relative hidden sm:block"
          >
            <ImageFallback src="/pages/pages/shaking-hands.webp" fill />
          </motion.div>
        </div>
      </motion.div>

      <PolicySection secondary />
      <MissionVisionGoals />
      <PartnersSection secondary />
    </section>
  );
}
