"use client";

import { Breadcrumb } from "@/components/shared/breadcrumb";
import ImageFallback from "@/components/shared/image-fallback";
import { PageSection } from "@/components/shared/page-section";
import { useHero } from "@/features/home-control/hooks/use-hero";
import { Users, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";

export default function Page() {
  const t = useTranslations();
  const { data: heroData, isLoading } = useHero();

  // Get section at index 5 (vulnerable protection)
  const section = heroData?.data?.sections?.[5];
  const title = section?.title?.ar || "حماية الفئات الهشة";
  const description = section?.description?.ar || "";
  const document = section?.image; // Using image field as document URL

  return (
    <motion.div
      className="container mx-auto py-8 space-y-6 relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Breadcrumb
          items={[
            { name: t("home"), href: "/" },
            { name: title, href: "/vulnerable-protection" },
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
        <Users className="text-[#4A8279]" />
        <h1 className="text-xl font-bold text-[#1E1E1E]">{title}</h1>
      </motion.div>

      {/* Decorative images */}
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

      {/* Download Document Button - Aligned to the end */}
      {document && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="flex justify-end"
        >
          <a href={document} target="_blank" rel="noopener noreferrer" download>
            <Button className="gap-2" size="lg">
              <Download className="h-5 w-5" />
              تحميل المستند
            </Button>
          </a>
        </motion.div>
      )}

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
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
                className="leading-10 whitespace-pre-line [&_ul]:list-disc [&_ul]:pr-5 [&_ol]:list-decimal [&_ol]:pr-5"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )
          }
        />
      </motion.div>
    </motion.div>
  );
}
