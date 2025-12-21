"use client";
import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AgeGroupsCount } from "@/features/home-control/types/hero.schema";

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

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  index: number;
  activeIndex: number;
}

function FlipCard({
  frontContent,
  backContent,
  index,
  activeIndex,
}: FlipCardProps) {
  const ref = useRef(null);
  // Card is flipped when it's the active one
  const isFlipped = index === activeIndex;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="flex justify-center"
    >
      <div
        className="group cursor-pointer"
        style={{
          perspective: "1000px",
          width: "140px",
          height: "120px",
        }}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front Face - Number */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(145deg, #ffffff 0%, #f5f3ef 100%)",
              borderRadius: "20px",
              boxShadow:
                "0 10px 40px rgba(194, 182, 147, 0.25), 0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid rgba(194, 182, 147, 0.3)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {frontContent}
          </div>

          {/* Back Face - Label */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(145deg, #C2B693 0%, #9a8c6b 100%)",
              borderRadius: "20px",
              boxShadow:
                "0 10px 40px rgba(194, 182, 147, 0.4), 0 4px 12px rgba(0,0,0,0.1)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              padding: "12px",
            }}
          >
            {backContent}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Component to manage sequential flip animation
function AgeGroupsGrid({ ageGroupsCount }: { ageGroupsCount: AgeGroupsCount }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const entries = Object.entries(ageGroupsCount) as [
    keyof AgeGroupsCount,
    number
  ][];
  const totalCards = entries.length;

  useEffect(() => {
    if (!isInView) return;

    // Start after 1 second delay
    const startTimeout = setTimeout(() => {
      setActiveIndex(0);
    }, 1000);

    return () => clearTimeout(startTimeout);
  }, [isInView]);

  useEffect(() => {
    if (activeIndex < 0) return;

    // Move to next card after 1 second
    const timer = setTimeout(() => {
      setActiveIndex((prev) => {
        // If we've gone through all cards, reset to restart
        if (prev >= totalCards - 1) {
          return -1;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeIndex, totalCards]);

  useEffect(() => {
    // When no card is active (after completing a cycle), restart after 2 seconds
    if (activeIndex === -1 && isInView) {
      const restartTimer = setTimeout(() => {
        setActiveIndex(0);
      }, 2000);
      return () => clearTimeout(restartTimer);
    }
  }, [activeIndex, isInView]);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
    >
      {entries.map(([key, value], i) => (
        <FlipCard
          key={key}
          frontContent={
            <>
              <p className="text-2xl md:text-3xl font-bold text-[#BDAE8F]">
                <Counter value={value} suffix="" />
              </p>
              <p className="text-xs text-gray-500 mt-1">فرد</p>
            </>
          }
          backContent={
            <p className="text-sm md:text-base text-white text-center font-bold leading-tight">
              {ageGroupLabels[key]}
            </p>
          }
          index={i}
          activeIndex={activeIndex}
        />
      ))}
    </div>
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
  const stats = [
    { number: projectsCount, suffix: "+", label: "مشروع" },
    { number: familiesCount, suffix: "+", label: "عائلة" },
    { number: contributorsCount, suffix: "+", label: "مساهم" },
    { number: campsCount, suffix: "+", label: "الإيواءات" },
  ];

  // Calculate total people from age groups
  const totalPeople = ageGroupsCount
    ? Object.values(ageGroupsCount).reduce((sum, count) => sum + count, 0)
    : 0;

  return (
    <section className="container mx-auto mt-10 space-y-6">
      {/* Main Stats */}
      <div className="overflow-hidden rounded-3xl flex flex-col md:flex-row">
        {/* Right side text box */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#C2B693] text-white flex items-center justify-center text-center md:text-right p-6 md:p-10 rounded-3xl md:rounded-l-none"
        >
          <p className="leading-relaxed text-sm md:text-base font-medium text-black">
            هدفنا دعم المحتاجين وتنمية الأمل.
            <br />
            كن متطوعًا واصنع فرقًا حقيقيًا.
          </p>
        </motion.div>

        {/* Stats boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 flex-1 bg-white shadow-md rounded-e-3xl overflow-hidden">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`flex flex-col items-center justify-center p-6 border-b md:border-b-0 ${
                i !== stats.length - 1 ? "md:border-l border-gray-200" : ""
              }`}
            >
              <p className="text-2xl md:text-3xl font-bold text-[#BDAE8F]">
                <Counter value={stat.number} suffix={stat.suffix} />
              </p>
              <p className="text-gray-800 font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Age Groups Stats - 3D Cube Flip */}
      {ageGroupsCount && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-md p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              التوزيع العمري للمستفيدين
            </h3>
            <p className="text-[#BDAE8F] text-3xl md:text-4xl font-bold">
              <Counter value={totalPeople} suffix="" /> فرد
            </p>
          </div>

          <AgeGroupsGrid ageGroupsCount={ageGroupsCount} />
        </motion.div>
      )}
    </section>
  );
}
