"use client";

import CampProjects from "@/features/campaign/components/camp-projects";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import ImageFallback from "@/components/shared/image-fallback";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations();

  return (
    <section className="container mx-auto px-4 relative">
      <CampProjects dashboard />
    </section>
  );
}
