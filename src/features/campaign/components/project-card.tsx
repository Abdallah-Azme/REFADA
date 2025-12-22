"use client";

import { motion } from "framer-motion";
import ImageFallback from "@/components/shared/image-fallback";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface ProjectCardProps {
  index: number;
  image: string;
  title: string;
  description: string;
  location: string;
  tag: string;
  goal: number;
  current: number;
  donors: number;
  percentage: number;
  camp: string;
}

export function ProjectCard({
  index,
  image,
  title,
  description,
  location,
  tag,
  goal,
  current,
  donors,
  percentage,
  camp,
}: ProjectCardProps) {
  const t = useTranslations("campDetails");

  // ✅ Format to 2 decimal places safely
  const formattedPercentage = Number(percentage.toFixed(2));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden transition-all duration-300 group h-full"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <ImageFallback
          src={image}
          alt={title}
          width={327}
          height={221}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 inset-inline-end-3">
          <span className="bg-teal-500 text-white text-xs px-3 py-1 rounded-full">
            {tag}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>

          <Link
            href={`https://www.google.com/search?q=${encodeURIComponent(
              title
            )}`}
            className="bg-[#D2EBFF] text-blue-500 rounded-md text-xs px-2 py-1"
          >
            {camp}
          </Link>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        <p className="text-xs text-gray-500 mb-4">{location}</p>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{formattedPercentage}%</span>
            <span>
              {t("goalLabel")}: {goal}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${formattedPercentage}%` }}
              transition={{
                duration: 1,
                delay: (index % 4) * 0.1 + 0.3,
              }}
              viewport={{ once: true }}
              className={cn(
                "h-full rounded-full",
                formattedPercentage < 40
                  ? "bg-red-500"
                  : formattedPercentage < 90
                  ? "bg-yellow-400"
                  : "bg-green-500"
              )}
              style={{ direction: "ltr" }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-500">
            <span>
              {donors} {t("donorsLabel")}
            </span>
          </div>
          <div className="text-gray-700 text-end">
            <span className="font-semibold">{t("collectedLabel")}:</span>{" "}
            <span className="text-teal-600 font-bold">{current}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
