"use client";
import CampaignCard from "@/features/campaign/components/campaign-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import ImageFallback from "@/components/shared/image-fallback";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { NotepadText } from "lucide-react";
import { useCampStatistics } from "@/features/camps/hooks/use-camps";
import type { CampaignCard as CampaignCardType } from "@/features/campaign/components/campaign-cards";

export default function CampaignPage() {
  const t = useTranslations();
  const { data: statisticsData, isLoading } = useCampStatistics();

  // Transform API data to match CampaignCard structure
  const campaigns: CampaignCardType[] =
    statisticsData?.data?.map((stat) => {
      const percentage =
        parseInt(stat.contributionsPercentage.replace("%", "")) || 0;
      // Determine color based on percentage
      const color =
        percentage >= 50 ? "#10b981" : percentage >= 25 ? "#f59e0b" : "#ef4444";

      return {
        id: stat.id,
        manager: stat.name,
        percentage,
        color,
        stats: {
          cases: stat.registeredFamilies,
          projects: stat.currentProjects,
          participation: percentage,
        },
      };
    }) || [];
  return (
    <div className="bg-gray-50 relative">
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="pt-10"
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
          <main className="mx-auto px-4 py-12">
            <motion.div
              className="flex items-center gap-2  mb-5"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <NotepadText size={20} className="text-[#4a8279]" />
              <h1 className="text-xl font-bold text-[#1E1E1E]">{t("stats")}</h1>
            </motion.div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow border border-gray-100 p-4 animate-pulse"
                  >
                    <div className="h-32 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : campaigns.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6 gap-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id}>
                    <h4 className="my-2 text-[#1E1E1E]">{campaign.manager}</h4>
                    <CampaignCard campaign={campaign} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>لا توجد إحصائيات متاحة</p>
              </div>
            )}

            {statisticsData?.pagination &&
              statisticsData.pagination.last_page > 1 && (
                <div className="flex justify-center mt-12">
                  <Button
                    variant={"outline"}
                    className="px-12! py-6! border-2 rounded-full font-semibold text-primary border-primary transition-colors flex items-center gap-2"
                  >
                    المزيد
                  </Button>
                </div>
              )}
          </main>
        </div>
      </section>
    </div>
  );
}
