"use client";

import { Breadcrumb } from "@/components/shared/breadcrumb";
import ImageFallback from "@/components/shared/image-fallback";
import { PageSection } from "@/components/shared/page-section";
import { usePage } from "@/features/pages/hooks/use-pages";
import { ShieldPlus, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";

export default function Page() {
  const t = useTranslations();
  const { data: pageData, isLoading } = usePage("transparency");

  // Get data from API or fallback to translations
  const title = pageData?.data?.title || t("transparencyTitle");
  const description = pageData?.data?.description || "";

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
            { name: t("transparency"), href: "/transparency" },
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
          <ShieldPlus className="text-[#4A8279]" />
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
                className="leading-10 [&_ul]:list-disc [&_ul]:pr-5 [&_ol]:list-decimal [&_ol]:pr-5"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )
          }
        />
      </motion.div>
    </motion.div>
  );
}
