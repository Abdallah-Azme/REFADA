"use client";

import { motion } from "framer-motion";
import ImageFallback from "./shared/image-fallback";
import { useEffect, useState } from "react";

export default function Hero() {
  // Generate random dots once on mount
  const [dots, setDots] = useState<{ id: number; top: number; left: number }[]>(
    []
  );

  useEffect(() => {
    const newDots = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
    }));
    setDots(newDots);
  }, []);

  return (
    <section className="relative overflow-visible container mx-auto px-4 flex flex-col-reverse sm:flex-row gap-8 items-center w-full">
      {/* Animated moving dots */}
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute w-2 h-2 rounded-full bg-primary/50"
          style={{
            top: `${dot.top}%`,
            left: `${dot.left}%`,
          }}
          animate={{
            x: [0, Math.random() * 40 - 20],
            y: [0, Math.random() * 40 - 20],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      ))}

      {/* Text Section */}
      <div className="flex-1 max-w-[609px] text-center sm:text-start z-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-light-black leading-[1.4] tracking-wide">
          بتبرعك تقدر تخفف معاناة{" "}
          <span className="text-secondary">أهل غزة</span>
          وتنشر الأمل في قلوب محتاجة للدعم والصمود 💚
        </h1>
        <p className="text-light-black text-sm sm:text-base leading-relaxed mb-6 max-w-[350px] mx-auto sm:mx-0">
          نحن نعمل على تطوير مشاريع مهمة تخدم المجتمع وتساهم في بناء مستقبل
          أفضل. من خلال شراكاتنا مع منظمات عالمية، نقدم حلولاً مبتكرة وفعالة.
        </p>
      </div>

      {/* Image Section */}
      <div className="flex-1 flex justify-center items-center relative overflow-visible">
        {/* Boy Wrapper */}
        <div className="relative flex justify-center items-center overflow-visible">
          {/* Boy Gradient Circle Background */}
          <motion.div
            className="absolute inset-0 m-auto w-[300px] sm:w-[400px] lg:w-[520px] h-[300px] sm:h-[400px] lg:h-[520px] rounded-full bg-gradient-to-tl from-primary to-secondary z-0"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          />

          {/* Boy Image */}
          <motion.div
            className="relative z-10 w-[280px] sm:w-[380px] lg:w-[500px] h-[280px] sm:h-[380px] lg:h-[500px] rounded-full overflow-hidden"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{
              rotateY: 180,
              scale: 1.05,
              transition: { duration: 0.6 },
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <ImageFallback
              alt="Gaza boy with happy smile :)"
              src="/pages/home/gaza-boy.webp"
              fill
              className="object-cover object-center"
            />
          </motion.div>
        </div>

        {/* Girl Wrapper */}
        <div className="absolute bottom-4 sm:bottom-10 start-6 sm:start-20 flex justify-center items-center overflow-visible">
          {/* Girl Gradient Circle Background */}
          <motion.div
            className="absolute inset-0 m-auto w-[130px] sm:w-[170px] lg:w-[210px] h-[130px] sm:h-[170px] lg:h-[210px] rounded-full bg-gradient-to-tl from-primary to-secondary z-10"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          />

          {/* Girl Image */}
          <motion.div
            className="relative z-20 w-[120px] sm:w-[160px] lg:w-[200px] h-[120px] sm:h-[160px] lg:h-[200px] rounded-full overflow-hidden"
            animate={{
              y: [0, -10, 0],
              rotateY: [0, 360],
            }}
            transition={{
              y: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              },
              rotateY: {
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              },
            }}
            whileHover={{
              rotateY: 180,
              scale: 1.05,
              transition: { duration: 0.6 },
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <ImageFallback
              alt="Gaza girl smiling :)"
              src="/pages/home/gaza-girl.webp"
              fill
              className="object-cover object-center"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
