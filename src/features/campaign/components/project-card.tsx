"use client";

import { motion } from "framer-motion";
import ImageFallback from "@/components/shared/image-fallback";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Contributor } from "@/features/camps/types/camp.schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  campSlug?: string;
  contributors?: Contributor[];
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
  campSlug,
  contributors = [],
}: ProjectCardProps) {
  const t = useTranslations("campDetails");

  // ✅ Format to 2 decimal places safely
  const formattedPercentage = Number(percentage.toFixed(2));

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Intl.DateTimeFormat("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(dateString));
    } catch (e) {
      return dateString;
    }
  };

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
        <div className="absolute top-3 start-2">
          <span className="bg-teal-500 text-white text-xs px-3 py-1 rounded-full">
            {tag}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>

          {campSlug ? (
            <Link
              href={`/camps/${campSlug}`}
              className="bg-[#D2EBFF] text-blue-500 rounded-md text-xs px-2 py-1 hover:bg-blue-100 transition-colors"
            >
              {camp}
            </Link>
          ) : (
            <p className="bg-[#D2EBFF] text-blue-500 rounded-md text-xs px-2 py-1">
              {camp}
            </p>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        <p className="text-xs text-gray-500 mb-4">{location}</p>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{formattedPercentage}%</span>
            <span>
              {t("requiredLabel")}: {goal}
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
                    : "bg-green-500",
              )}
              style={{ direction: "ltr" }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-500">
            <span>
              {t("goalLabel")}: {donors}
            </span>
          </div>
          <div className="text-gray-700 text-end">
            <span className="font-semibold">{t("collectedLabel")}:</span>{" "}
            <span className="text-teal-600 font-bold">{current}</span>
          </div>
        </div>

        {/* Contributors List */}
        {contributors && contributors.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-2">
              {t("contributionsLabel") || "المساهمات"}:
            </p>
            <div className="flex flex-col gap-1">
              {[...contributors]
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 3)
                .map((contributor, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-xs bg-gray-50 p-1.5 rounded"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-gray-700 truncate max-w-[120px] font-medium">
                        {contributor.contributorName}
                      </span>
                      {contributor.createdAt && (
                        <span className="text-[9px] text-gray-400">
                          {formatDate(contributor.createdAt)}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {contributor.quantity}
                    </span>
                  </div>
                ))}
              {contributors.length > 3 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-[10px] text-teal-600 hover:text-teal-700 font-medium mt-1 self-start flex items-center gap-1">
                      <span>... {t("showAll") || "عرض الكل"}</span>
                      <span className="bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-full text-[9px]">
                        +{contributors.length - 3}
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {t("allContributions") || "كافة المساهمات"} - {title}
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] pl-4">
                      <div className="flex flex-col gap-2 mt-4">
                        {[...contributors]
                          .sort((a, b) => b.quantity - a.quantity)
                          .map((contributor, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                            >
                              <span className="font-bold text-teal-600 bg-white px-3 py-1 rounded-full border border-teal-100 shadow-sm">
                                {contributor.quantity}
                              </span>
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                  <span className="font-medium text-gray-900">
                                    {contributor.contributorName}
                                  </span>
                                  {contributor.createdAt && (
                                    <span className="text-[10px] text-gray-500">
                                      {formatDate(contributor.createdAt)}
                                    </span>
                                  )}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">
                                  {i + 1}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
