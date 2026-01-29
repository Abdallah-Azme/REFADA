"use client";

import CampProjects from "@/features/campaign/components/camp-projects";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import ImageFallback from "@/components/shared/image-fallback";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Camp } from "@/features/camps/types/camp.schema";

interface CampsPageClientProps {
  camps: Camp[];
  selectedGovernorate?: string;
  onGovernorateChange?: (value: string) => void;
  selectedSearchName?: string;
  onSearchNameChange?: (value: string) => void;
}

export default function CampsPageClient({
  camps,
  selectedGovernorate,
  onGovernorateChange,
  selectedSearchName,
  onSearchNameChange,
}: CampsPageClientProps) {
  const t = useTranslations();

  return (
    <section className="container mx-auto px-4 relative">
      {/* Breadcrumb with animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mt-6"
      >
        <Breadcrumb
          items={[
            { name: t("home"), href: "/" },
            { name: t("camps_nav"), href: "#" },
          ]}
        />
      </motion.div>

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
      <CampProjects
        camps={camps}
        selectedGovernorate={selectedGovernorate}
        onGovernorateChange={onGovernorateChange}
        selectedSearchName={selectedSearchName}
        onSearchNameChange={onSearchNameChange}
      />
    </section>
  );
}
