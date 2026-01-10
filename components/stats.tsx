"use client";
import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AgeGroupsCount } from "@/features/home-control/types/hero.schema";
import { useTranslations } from "next-intl";

function Counter({ value = 1, suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => setDisplayValue(Math.round(latest)),
      });
      return controls.stop;
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

interface StatsProps {
  projectsCount?: number;
  familiesCount?: number;
  contributorsCount?: number;
  campsCount?: number;
  ageGroupsCount?: AgeGroupsCount;
}

// Arabic labels for age groups
const ageGroupLabels: Record<keyof AgeGroupsCount, string> = {
  newborns: "حديثي الولادة",
  infants: "الرضع",
  veryEarlyChildhood: "الطفولة المبكرة جداً",
  toddlers: "الأطفال الصغار",
  earlyChildhood: "الطفولة المبكرة",
  children: "الأطفال",
  adolescents: "المراهقين",
  youth: "الشباب",
  youngAdults: "البالغين الشباب",
  middleAgeAdults: "متوسطي العمر",
  lateMiddleAge: "أواخر متوسط العمر",
  seniors: "كبار السن",
};

export default function Stats({
  projectsCount = 0,
  familiesCount = 0,
  contributorsCount = 0,
  campsCount = 0,
  ageGroupsCount,
}: StatsProps) {
  const t = useTranslations();
  const [flipCount, setFlipCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Main stats
  const mainStats = [
    { number: projectsCount, suffix: "+", label: "مشروع" },
    { number: familiesCount, suffix: "+", label: "عائلة" },
    { number: contributorsCount, suffix: "+", label: "مساهم" },
    { number: campsCount, suffix: "+", label: "الإيواءات" },
  ];

  // Age groups as array
  const ageGroupEntries = ageGroupsCount
    ? (Object.entries(ageGroupsCount) as [keyof AgeGroupsCount, number][]).map(
        ([key, value]) => ({
          number: value,
          suffix: "",
          label: ageGroupLabels[key],
        })
      )
    : [];

  // Combine all stats: main stats first, then age groups in groups of 4
  const allPages: { number: number; suffix: string; label: string }[][] = [
    mainStats,
  ];

  // Split age groups into chunks of 4
  for (let i = 0; i < ageGroupEntries.length; i += 4) {
    allPages.push(ageGroupEntries.slice(i, i + 4));
  }

  const totalPages = allPages.length;

  // Calculate current and next page based on flip count
  const currentPageIndex = flipCount % totalPages;
  const nextPageIndex = (flipCount + 1) % totalPages;

  // Determine which content shows on front/back based on even/odd flips
  const isEvenFlip = flipCount % 2 === 0;
  const frontStats = isEvenFlip
    ? allPages[currentPageIndex]
    : allPages[nextPageIndex];
  const backStats = isEvenFlip
    ? allPages[nextPageIndex]
    : allPages[currentPageIndex];

  // Rotation angle (increases by 180 each flip)
  const rotation = flipCount * 180;

  useEffect(() => {
    if (!isInView || totalPages <= 1) return;

    // Auto-flip every 3 seconds
    const interval = setInterval(() => {
      setFlipCount((prev) => prev + 1);
    }, 6000);

    return () => clearInterval(interval);
  }, [isInView, totalPages]);

  return (
    <section className="container mx-auto mt-10 space-y-6">
      {/* Main Stats with Flip Animation */}
      <div
        ref={ref}
        className="overflow-hidden rounded-3xl flex flex-col md:flex-row"
      >
        {/* Right side text box */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#C2B693] text-white flex items-center justify-center text-center md:text-right p-6 md:p-10 rounded-3xl md:rounded-l-none"
        >
          <p className="leading-relaxed text-sm md:text-base font-medium text-black">
            {t("stats_message_line1")}
            <br />
            {t("stats_message_line2")}
          </p>
        </motion.div>

        {/* Stats boxes with flip animation */}
        <div className="grid grid-cols-2 md:grid-cols-4 flex-1 bg-white shadow-md rounded-e-3xl overflow-hidden">
          {[0, 1, 2, 3].map((i) => {
            const frontStat = frontStats?.[i] || mainStats[i];
            const backStat = backStats?.[i] || mainStats[i];

            return (
              <div
                key={`slot-${i}`}
                className={`flex items-center justify-center p-6 border-b md:border-b-0 ${
                  i !== 3 ? "md:border-l border-gray-200" : ""
                }`}
                style={{ perspective: "1000px" }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "80px",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transition: `transform 0.6s ease ${i * 0.1}s`,
                    transform: `rotateX(${rotation}deg)`,
                  }}
                >
                  {/* Front Face */}
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <p className="text-2xl md:text-3xl font-bold text-[#BDAE8F]">
                      {frontStat.number}
                      {frontStat.suffix}
                    </p>
                    <p className="text-gray-800 font-semibold text-sm md:text-base text-center">
                      {frontStat.label}
                    </p>
                  </div>

                  {/* Back Face */}
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateX(180deg)",
                    }}
                  >
                    <p className="text-2xl md:text-3xl font-bold text-[#BDAE8F]">
                      {backStat.number}
                      {backStat.suffix}
                    </p>
                    <p className="text-gray-800 font-semibold text-sm md:text-base text-center">
                      {backStat.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
