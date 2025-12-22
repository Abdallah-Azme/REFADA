"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Eye, Target } from "lucide-react";
import { motion } from "framer-motion";
import ImageFallback from "./image-fallback";
import { usePages, useAboutUs } from "@/features/pages/hooks/use-pages";
import { useLocale } from "next-intl";

// Animation Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

// Helper function to get localized value
const getLocalizedValue = (
  value: string | { ar?: string; en?: string } | undefined,
  locale: string,
  fallback: string = ""
): string => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value[locale as "ar" | "en"] || value.ar || value.en || fallback;
};

export default function MissionVisionGoals() {
  const locale = useLocale();
  const { data: pagesData, isLoading: pagesLoading } = usePages();
  const { data: aboutUsData, isLoading: aboutLoading } = useAboutUs();

  const isLoading = pagesLoading || aboutLoading;

  // Get mission, vision, goals data from API
  const pages = pagesData?.data || [];
  const mission = pages.find((p) => p.pageType === "mission");
  const vision = pages.find((p) => p.pageType === "vision");
  const goals = pages.find((p) => p.pageType === "goals");

  const sectionImage =
    aboutUsData?.data?.second_image || "/pages/pages/hand-carrying-hope.webp";

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-3 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
    </div>
  );

  return (
    <section className="container relative mx-auto px-4 py-10 grid md:grid-cols-2 gap-10 items-center overflow-hidden">
      {/* Decorative Backgrounds */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        <ImageFallback
          src="/pages/pages/wheat.webp"
          width={267}
          height={360}
          className="absolute bottom-0 right-0 w-[267px] h-[360px]"
        />
        <ImageFallback
          src="/pages/pages/heart.webp"
          width={200}
          height={245}
          className="absolute top-0 left-0 w-50 h-[245px]"
        />
      </motion.div>

      {/* Image Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative flex justify-center"
      >
        <div className="relative max-w-sm">
          <ImageFallback
            src={sectionImage}
            alt="hands holding ribbon"
            width={450}
            height={490}
            className="rounded-2xl object-cover"
          />
          <div className="absolute -bottom-3 left-0 right-0 h-2 bg-primary rounded-full mx-auto w-1/2" />
          <div className="absolute -top-3 -end-3 size-50 bg-secondary rounded-2xl -z-10 mx-auto" />
        </div>
      </motion.div>

      {/* Text Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col gap-6 rtl text-right z-10"
      >
        {/* Mission */}
        <motion.div variants={cardVariants}>
          <Card className="rounded-2xl shadow-sm border-none bg-gray-50">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-primary" size={20} />
                <h3 className="font-bold text-lg">
                  {getLocalizedValue(mission?.title, locale, "رسالتنا")}
                </h3>
              </div>
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <div
                  className="text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: getLocalizedValue(
                      mission?.description,
                      locale,
                      "نحافظ على سرية بيانات المتبرعين والمستفيدين، ونستخدمها فقط لخدمة العمل الإنساني وفق أعلى معايير الأمان."
                    ),
                  }}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Vision */}
        <motion.div variants={cardVariants}>
          <Card className="rounded-2xl shadow-sm border-none bg-gray-50">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Eye className="text-primary" size={20} />
                <h3 className="font-bold text-lg">
                  {getLocalizedValue(vision?.title, locale, "رؤيتنا")}
                </h3>
              </div>
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <div
                  className="text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: getLocalizedValue(
                      vision?.description,
                      locale,
                      "نطمح لعلاقة مميزة مع المتبرعين والمتطوعين بما يضمن الثقة والمسؤولية المشتركة في تحقيق أهدافنا الإنسانية."
                    ),
                  }}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Goals */}
        <motion.div variants={cardVariants}>
          <Card className="rounded-2xl shadow-sm border-none bg-gray-50">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Target className="text-primary" size={20} />
                <h3 className="font-bold text-lg">
                  {getLocalizedValue(goals?.title, locale, "أهدافنا")}
                </h3>
              </div>
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <div
                  className="text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: getLocalizedValue(
                      goals?.description,
                      locale,
                      "نسعى لتحقيق أهداف واضحة تشمل دعم الأسر المحتاجة، تنفيذ مشاريع مستدامة، وبناء شراكات مجتمعية فاعلة."
                    ),
                  }}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
