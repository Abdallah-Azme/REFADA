"use client";

import { cn } from "@/lib/utils";
import { Heart, Zap, CheckCircle, Users, LucideIcon } from "lucide-react";

export const stats = [
  {
    icon: Heart,
    label: "حالات حرجة",
    value: "10",
    subtitle: "خلال الأسبوع",
    color: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    icon: Heart,
    label: "المساهمات",
    value: "314",
    subtitle: "مجموع المساهمات المنتهية",
    color: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    icon: Zap,
    label: "عدد المشاريع الحالية",
    value: "50",
    subtitle: "تم تشغيلها آخر أسبوع • 20%",
    subColor: "text-red-500",
    color: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    icon: CheckCircle,
    label: "عدد المشاريع المنفذة",
    value: "1200",
    subtitle: "تم تشغيلها آخر أسبوع • 80%",
    subColor: "text-green-500",
    color: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    icon: Users,
    label: "عدد العائلات",
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
    label: "المساهمات",
    value: "314",
    subtitle: "مجموع المساهمات المنتهية",
    color: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    icon: Zap,
    label: "عدد المشاريع الحالية",
    value: "50",
    subtitle: "تم تشغيلها آخر أسبوع • 20%",
    subColor: "text-red-500",
    color: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    icon: CheckCircle,
    label: "عدد المشاريع المنفذة",
    value: "1200",
    subtitle: "تم تشغيلها آخر أسبوع • 80%",
    subColor: "text-green-500",
    color: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    icon: Users,
    label: "عدد العائلات",
    value: "1297",
    subtitle: "+ 5.2%",
    subColor: "text-green-500",
    color: "bg-blue-50",
    iconColor: "text-blue-500",
  },
];

type StatItem = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle: string;
  subColor?: string;
  color: string;
  iconColor: string;
};

interface StatsCardsProps {
  stats: StatItem[];
  className?: string;
  itemClassName?: string;
  secondary?: boolean;
}

export default function StatsCards({
  stats,
  className,
  itemClassName,
  secondary = false,
}: StatsCardsProps) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-[#333333] font-bold text-lg">احصائيات سريعة</h2>
      <div
        className={cn(
          "grid gap-4",
          !secondary &&
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5",
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
            <p className="text-sm font-semibold text-[#828282]">{stat.label}</p>

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
              {stat.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
