"use client";

import CampProjects from "@/components/campaign/camp-projects";
import CampsMapSection from "@/components/pages/home/camps-map-section";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import ImageFallback from "@/components/shared/image-fallback";
import { PageSection } from "@/components/shared/page-section";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
export default function Page() {
  const t = useTranslations();

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
            { name: t("gablyaCamp"), href: "#" },
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
          <Info />
          <h1 className="text-xl font-semibold text-[#1E1E1E]">
            {t("gablyaCamp")}
          </h1>
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
                    يُعتبر مخيم جباليا أكبر مخيم للاجئين الفلسطينيين في فلسطين،
                    حيث يعيش فيه 119,000 فلسطيني يتوزعون على مساحة لا تتجاوز 1.4
                    كيلومتر مربع، مما يجعله واحدًا من أكثر الأماكن اكتظاظاً
                    بالسكان في العالم. ينحدر لاجئو جباليا من أحفاد 38,000
                    فلسطيني تم تطهيرهم عرقيًا من أسدود ويافا والرملة واللد وبئر
                    السبع خلال نكبة عام 1948.يُعتبر مخيم جباليا أكبر مخيم
                    للاجئين الفلسطينيين في فلسطين، حيث يعيش فيه 119,000
                    فلسطيني يتوزعون على مساحة لا تتجاوز 1.4 كيلومتر مربع، مما
                    يجعله واحدًا من أكثر الأماكن اكتظاظاً بالسكان في العالم.
                    ينحدر لاجئو جباليا من أحفاد 38,000 فلسطيني تم تطهيرهم عرقيًا
                    من أسدود ويافا والرملة واللد وبئر السبع خلال نكبة عام 1948.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-between text-[#1E1E1E] px-4 py-2 rounded-md bg-[#FAF8F8]">
                    <div className="flex items-center gap-2">
                      <p className="font-bold ">عدد العائلات: </p>
                      <p className=""> 500 عائلة </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold ">عددالمواليد: </p>
                      <p className="">5000 مولود</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold ">عددالمشاريع: </p>
                      <p className="">20 مشاريع</p>
                    </div>
                  </div>
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
            <CampsMapSection secondary />
          </motion.div>
        </div>
      </motion.div>

      <CampProjects />
    </section>
  );
}
