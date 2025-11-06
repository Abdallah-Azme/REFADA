"use client";
import CampaignCards from "@/components/campaign/campaign-cards";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import ImageFallback from "@/components/shared/image-fallback";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
export default function CampaignPage() {
  const t = useTranslations();
  return (
    <div className="bg-gray-50 relative">
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="pt-6"
        >
          <Breadcrumb
            items={[
              { name: t("home"), href: "/" },
              { name: t("stats"), href: "#" },
            ]}
          />
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
            src="/pages/pages/wheat.webp"
            width={136}
            height={184}
            className="absolute top-0 left-0 w-[136px] h-[184px]"
          />
          <ImageFallback
            src="/pages/pages/heart.webp"
            width={78}
            height={64}
            className="absolute top-0 left-1/4 w-16 h-[78px]"
          />
          <ImageFallback
            src="/pages/pages/heart.webp"
            width={78}
            height={64}
            className="absolute bottom-0 right-1/4 w-16 h-[78px]"
          />
        </motion.div>
        <div className="">
          <main className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">الإحصائيات</h1>
            </div>

            <CampaignCards />

            <div className="flex justify-center mt-12">
              <Button
                variant={"outline"}
                className="px-12! py-6! border-2     rounded-full font-semibold  transition-colors flex items-center gap-2"
              >
                المزيد
              </Button>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}
