"use client";
import CampsMapSection from "@/components/pages/home/camps-map-section";
import ImageFallback from "@/components/shared/image-fallback";
import CampDetailsSection from "@/features/camps/components/camp-details-section";
import CurrentProjectsTableContribution from "@/features/dashboard/components/current-project-table-contribution";
import MainHeader from "@/features/dashboard/components/main-header";
import { cn } from "@/lib/utils";
import CampStats from "@/src/features/camps/components/camp-stats";
import { motion } from "framer-motion";
import { Tent } from "lucide-react";
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
    <main className="w-full flex flex-col  gap-6 p-8 bg-gray-50  ">
      <div className="flex items-center justify-between mb-5">
        <MainHeader header="إيواء اصداء">
          <Tent />
        </MainHeader>
      </div>

      {/* Stats cards - left side */}
      <div className="w-full  ">
        {/* <CambDetailsCard /> */}

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
      </div>
      <CurrentProjectsTableContribution />
    </main>
  );
}
