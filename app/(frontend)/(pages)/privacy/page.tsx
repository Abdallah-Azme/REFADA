"use client";

import { Breadcrumb } from "@/components/shared/breadcrumb";
import ImageFallback from "@/components/shared/image-fallback";
import { PageSection } from "@/components/shared/page-section";
import { motion } from "framer-motion";
import { BookKey, Lock } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations();

  return (
    <motion.div
      className="container mx-auto py-8 space-y-6 relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Breadcrumb with animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Breadcrumb
          items={[
            { name: t("home"), href: "/" },
            { name: t("privacy"), href: "/privacy" },
          ]}
        />
      </motion.div>

      {/* Title */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <BookKey className="text-[#4A8279]" />
        <h1 className="text-xl font-bold text-[#1E1E1E]">{t("privacy")} </h1>
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

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <PageSection
          description={
            <>
              <p>{t("transparencyDescription")}</p>
              <p className="leading-10">{t("transparencyParagraph")}</p>
            </>
          }
        />
      </motion.div>
    </motion.div>
  );
}
