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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {(
              Object.entries(ageGroupsCount) as [keyof AgeGroupsCount, number][]
            ).map(([key, value], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex justify-center"
              >
                <div
                  className="cube-container group cursor-pointer"
                  style={{
                    perspective: "600px",
                    width: "120px",
                    height: "100px",
                  }}
                >
                  <div
                    className="cube"
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.6s ease-in-out",
                    }}
                  >
                    {/* Front Face - Number */}
                    <div
                      className="cube-face front"
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(135deg, #f8f6f3 0%, #efe9df 100%)",
                        borderRadius: "16px",
                        boxShadow: "0 4px 15px rgba(189, 174, 143, 0.2)",
                        border: "2px solid #C2B693",
                        backfaceVisibility: "hidden",
                        transform: "translateZ(50px)",
                      }}
                    >
                      <p className="text-2xl md:text-3xl font-bold text-[#BDAE8F]">
                        <Counter value={value} suffix="" />
                      </p>
                      <p className="text-xs text-gray-500 mt-1">فرد</p>
                    </div>

                    {/* Top Face - Label (shown on hover) */}
                    <div
                      className="cube-face top"
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(135deg, #C2B693 0%, #a89970 100%)",
                        borderRadius: "16px",
                        boxShadow: "0 4px 15px rgba(189, 174, 143, 0.3)",
                        backfaceVisibility: "hidden",
                        transform: "rotateX(90deg) translateZ(50px)",
                        padding: "8px",
                      }}
                    >
                      <p className="text-sm md:text-base text-white text-center font-bold leading-tight">
                        {ageGroupLabels[key]}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CSS for hover flip */}
          <style jsx>{`
            .cube-container:hover .cube {
              transform: rotateX(-90deg);
            }
          `}</style>
        </motion.div>
      )}
    </section>
  );
}
