"use client";

import { Breadcrumb } from "@/components/shared/breadcrumb";
import ImageFallback from "@/components/shared/image-fallback";
import { PageSection } from "@/components/shared/page-section";
import { usePage } from "@/features/pages/hooks/use-pages";
import { motion } from "framer-motion";
import { Lock, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";

export default function Page() {
  const t = useTranslations();
  const { data: pageData, isLoading } = usePage("terms");
  const locale = (
    typeof window !== "undefined" ? document.documentElement.lang : "ar"
  ) as "ar" | "en";

  // Get data from API - handle both string and localized object formats
  const titleData = pageData?.data?.title;
  const descData = pageData?.data?.description;

  const title =
    typeof titleData === "object" && titleData
      ? titleData[locale] || titleData.ar || t("termsAndConditions")
      : titleData || t("termsAndConditions");

  const description =
    typeof descData === "object" && descData
      ? descData[locale] || descData.ar || ""
      : descData || "";

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
            { name: t("termsAndConditions"), href: "/terms-and-conditions" },
          ]}
        />
      </motion.div>

      {/* Title with Download Button */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <Lock className="text-[#4A8279]" />
          <h1 className="text-xl font-bold text-[#1E1E1E]">{title}</h1>
        </div>

        {/* Download Document Button - Aligned with Title */}
        {pageData?.data?.file && (
          <a
            href={pageData.data.file}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <Button className="gap-2" variant="outline">
              <Download className="h-5 w-5" />
              تحميل المستند
            </Button>
          </a>
        )}
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

      {/* Content Section with optional Image */}
      <div
        className={`flex flex-col ${
          pageData?.data?.image ? "lg:flex-row-reverse" : ""
        } gap-10 items-start`}
      >
        {/* Image Section - only show if image exists */}
        {pageData?.data?.image && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative w-full lg:w-1/2 h-[300px] sm:h-[350px] shrink-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50"
          >
            <ImageFallback
              src={pageData.data.image}
              fill
              className="object-cover"
              alt={typeof title === "string" ? title : ""}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
          </motion.div>
        )}

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={`${
            pageData?.data?.image ? "flex-1" : "w-full"
          } bg-white/50 backdrop-blur-sm rounded-3xl`}
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
  );
}
