"use client";

import ImageDecorations from "@/components/image-decorations";
import CampsMapSection from "@/components/pages/home/camps-map-section";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import ImageFallback from "@/components/shared/image-fallback";
import { Button } from "@/components/ui/button";
import ProjectsSection from "@/features/campaign/components/projects-section";
import CampDetailsSection from "@/features/camps/components/camp-details-section";
import { cn } from "@/lib/utils";
import CampStats from "@/src/features/camps/components/camp-stats";
import { motion } from "framer-motion";
import { Info, SquareKanban } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations();
  const campDetails = {
    name: "إيواء جباليا",
    location: "الإيواء الشمالي - غزة",
    phone: "+972 22 222 2222",
    image: "/pages/home/gaza-camp-1.webp",
    position: [31.535, 34.495],
  };
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
          <Info className="text-[#4A8279]" />
          <h1 className="text-xl font-bold text-[#1E1E1E]">
            {t("gablyaCamp")}
          </h1>
        </motion.div>

        {/* Decorative images (fade-in softly) */}
        <ImageDecorations />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 items-stretch">
          <CampDetailsSection />

          <CampsMapSection secondary />

          <CampStats />

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
                src={campDetails.image}
                alt={campDetails.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-1 text-right h-full justify-around">
              <h3 className="font-semibold text-[#1C3A34] leading-tight">
                {campDetails.name}
              </h3>

              <p className="text-gray-600  flex items-center gap-1 leading-relaxed">
                <span className="text-gray-400">📍</span>
                شمال قطاع غزة - على بُعد نحو 4 كيلومترات
              </p>

              <p className="text-gray-600  flex items-center gap-1 leading-relaxed">
                <span className="text-gray-400">📞</span>
                تواصل معنا: {campDetails.phone}
              </p>

              <p className="text-gray-600  flex items-center gap-1 leading-relaxed">
                <span className="text-gray-400">🏦</span>
                الحساب البنكي: 10008890003444
              </p>
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
            المشاريع المقامة داخل الإيواء
          </h2>
        </motion.div>
        <ProjectsSection />
        <div className="flex justify-center mt-12">
          <Button
            variant={"outline"}
            className="px-12! py-6! border-2 rounded-full font-semibold text-primary border-primary transition-colors flex items-center gap-2"
          >
            المزيد
          </Button>
        </div>
      </div>
    </section>
  );
}
