"use client";
import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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

export default function Stats() {
  const stats = [
    { number: 1400, suffix: "+", label: "مشروع" },
    { number: 6500, suffix: "+", label: "عائلة" },
    { number: 3200, suffix: "+", label: "مساهم" },
    { number: 30, suffix: "+", label: "الإيواءات" },
  ];

  return (
    <section className="container mx-auto mt-10 overflow-hidden rounded-3xl flex flex-col md:flex-row  ">
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
    </section>
  );
}
