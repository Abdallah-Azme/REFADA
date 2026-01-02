"use client";

import AnimatedNumber from "@/components/animated-number";
import { UsersRound, FolderOpenDot, Users } from "lucide-react";
import { useTranslations } from "next-intl";

interface CampStatsProps {
  familyCount?: number;
  membersCount?: number;
  projectsCount?: number;
}

export default function CampStats({
  familyCount = 0,
  membersCount = 0,
  projectsCount = 0,
}: CampStatsProps) {
  const t = useTranslations("campStats");

  return (
    <div className="flex h-full shadow-sm border flex-col sm:flex-row items-center justify-between bg-white gap-6 text-[#1E1E1E] px-6 py-6 rounded-md">
      {/* Families */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Users />
        </div>

        <p className="font-bold text-lg">{t("families_count")}</p>
        <p className="text-2xl font-bold text-primary">
          <AnimatedNumber to={familyCount} /> {t("family")}
        </p>
      </div>

      {/* Members */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <UsersRound />
        </div>

        <p className="font-bold text-lg">{t("members_count")}</p>
        <p className="text-2xl font-bold text-primary">
          <AnimatedNumber to={membersCount} /> {t("member")}
        </p>
      </div>

      {/* Projects */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <FolderOpenDot />
        </div>

        <p className="font-bold text-lg">{t("projects_count")}</p>
        <p className="text-2xl font-bold text-primary">
          <AnimatedNumber to={projectsCount} /> {t("project")}
        </p>
      </div>
    </div>
  );
}
