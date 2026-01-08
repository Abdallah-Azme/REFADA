"use client";

import { cn } from "@/lib/utils";
import { Heart, Zap, CheckCircle, Users, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export const stats = [
  {
    icon: Heart,
    labelKey: "contributions",
    value: "314",
    subtitleKey: "contributions_subtitle",
    color: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    icon: Zap,
    labelKey: "current_projects",
    value: "50",
    subtitleKey: "current_projects_subtitle",
    subColor: "text-red-500",
    color: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    icon: CheckCircle,
    labelKey: "completed_projects",
    value: "1200",
    subtitleKey: "completed_projects_subtitle",
    subColor: "text-green-500",
    color: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    icon: Users,
    labelKey: "families_count",
    value: "1297",
    subtitle: "+ 5.2%",
    subColor: "text-green-500",
    color: "bg-blue-50",
    iconColor: "text-blue-500",
  },
];

export const stats4 = [
  {
    icon: Heart,
    labelKey: "contributions",
    value: "314",
    subtitleKey: "contributions_subtitle",
    color: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    icon: Zap,
    labelKey: "current_projects",
    value: "50",
    subtitleKey: "current_projects_subtitle",
    subColor: "text-red-500",
    color: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    icon: CheckCircle,
    labelKey: "completed_projects",
    value: "1200",
    subtitleKey: "completed_projects_subtitle",
    subColor: "text-green-500",
    color: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    icon: Users,
    labelKey: "families_count",
    value: "1297",
    subtitle: "+ 5.2%",
    subColor: "text-green-500",
    color: "bg-blue-50",
    iconColor: "text-blue-500",
  },
];

type StatItem = {
  icon: LucideIcon;
  labelKey: string;
  value: string | number;
  subtitleKey?: string;
  subtitle?: string;
  subColor?: string;
  color: string;
  iconColor: string;
};

interface StatsCardsProps {
  stats: StatItem[];
  className?: string;
  itemClassName?: string;
  secondary?: boolean;
  showTitle?: boolean;
}

export default function StatsCards({
  stats,
  className,
  itemClassName,
  showTitle = true,
  secondary = false,
}: StatsCardsProps) {
  const t = useTranslations("dashboard_stats");

  return (
    <section className="flex flex-col gap-2 ">
      {showTitle && (
        <h2 className="text-[#333333] font-bold text-lg">{t("quick_stats")}</h2>
      )}
      <div
        className={cn(
          "grid gap-4",
          !secondary &&
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          className
        )}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className={cn(
              "bg-white rounded-2xl py-6 px-5 shadow-sm border border-gray-100 flex flex-col items-start space-y-3",
              itemClassName
            )}
          >
            {/* Label */}
            <p className="text-sm font-semibold text-[#828282]">
              {stat.labelKey ? t(stat.labelKey) : ""}
            </p>

            {/* Value + Icon */}
            <div className="flex items-center justify-between w-full">
              <div className="text-[28px] leading-none text-black font-bold">
                {stat.value}
              </div>

              <div
                className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>

            {/* Subtitle */}
            <p
              className={`text-xs ${
                stat.subColor ? stat.subColor : "text-[#828282]"
              }`}
            >
              {stat.subtitleKey ? t(stat.subtitleKey) : stat.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
