"use client";

import { motion } from "framer-motion";
import ImageFallback from "./shared/image-fallback";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { useDirection } from "@/hooks/use-direction";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const carouselSlides = [
  {
    id: 0,
    title: "بتبرعك تقدر تخفف معاناة",
    highlightedText: "أهل غزة",
    subtitle: "وتنشر الأمل في قلوب محتاجة للدعم والصمود 💚",
    description:
      "نحن نعمل على تطوير مشاريع مهمة تخدم المجتمع وتساهم في بناء مستقبل أفضل. من خلال شراكاتنا مع منظمات عالمية، نقدم حلولاً مبتكرة وفعالة.",
    boyImage: "/pages/home/gaza-boy.webp",
    girlImage: "/pages/home/gaza-girl.webp",
    boyAlt: "Gaza boy with happy smile :)",
    girlAlt: "Gaza girl smiling :)",
  },
  {
    id: 1,
    title: "بتبرعك تقدر تخفف معاناة",
    highlightedText: "أهل غزة",
    subtitle: "وتنشر الأمل في قلوب محتاجة للدعم والصمود 💚",
    description:
      "نحن نعمل على تطوير مشاريع مهمة تخدم المجتمع وتساهم في بناء مستقبل أفضل. من خلال شراكاتنا مع منظمات عالمية، نقدم حلولاً مبتكرة وفعالة.",
    boyImage: "/pages/home/gaza-boy.webp",
    girlImage: "/pages/home/gaza-girl.webp",
    boyAlt: "Gaza boy with happy smile :)",
    girlAlt: "Gaza girl smiling :)",
  },
  {
    id: 2,
    title: "بتبرعك تقدر تخفف معاناة",
    highlightedText: "أهل غزة",
    subtitle: "وتنشر الأمل في قلوب محتاجة للدعم والصمود 💚",
    description:
      "نحن نعمل على تطوير مشاريع مهمة تخدم المجتمع وتساهم في بناء مستقبل أفضل. من خلال شراكاتنا مع منظمات عالمية، نقدم حلولاً مبتكرة وفعالة.",
    boyImage: "/pages/home/gaza-boy.webp",
    girlImage: "/pages/home/gaza-girl.webp",
    boyAlt: "Gaza boy with happy smile :)",
    girlAlt: "Gaza girl smiling :)",
  },
  {
    id: 3,
    title: "بتبرعك تقدر تخفف معاناة",
    highlightedText: "أهل غزة",
    subtitle: "وتنشر الأمل في قلوب محتاجة للدعم والصمود 💚",
    description:
      "نحن نعمل على تطوير مشاريع مهمة تخدم المجتمع وتساهم في بناء مستقبل أفضل. من خلال شراكاتنا مع منظمات عالمية، نقدم حلولاً مبتكرة وفعالة.",
    boyImage: "/pages/home/gaza-boy.webp",
    girlImage: "/pages/home/gaza-girl.webp",
    boyAlt: "Gaza boy with happy smile :)",
    girlAlt: "Gaza girl smiling :)",
  },
  {
    id: 4,
    title: "بتبرعك تقدر تخفف معاناة",
    highlightedText: "أهل غزة",
    subtitle: "وتنشر الأمل في قلوب محتاجة للدعم والصمود 💚",
    description:
      "نحن نعمل على تطوير مشاريع مهمة تخدم المجتمع وتساهم في بناء مستقبل أفضل. من خلال شراكاتنا مع منظمات عالمية، نقدم حلولاً مبتكرة وفعالة.",
    boyImage: "/pages/home/gaza-boy.webp",
    girlImage: "/pages/home/gaza-girl.webp",
    boyAlt: "Gaza boy with happy smile :)",
    girlAlt: "Gaza girl smiling :)",
  },
];

export default function Hero() {
  const { isRTL } = useDirection();
  const [dots, setDots] = useState<{ id: number; top: number; left: number }[]>(
    []
  );
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const newDots = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
    }));
    setDots(newDots);
  }, []);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="relative overflow-visible container mx-auto px-4 w-full">
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

      {/* Carousel Container */}
      <div className="relative">
        {/* Shadcn Carousel */}
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            direction: isRTL ? "rtl" : "ltr",
          }}
          plugins={[
            Autoplay({ delay: 2000, stopOnInteraction: false }),
            Fade({}),
          ]}
        >
          <CarouselContent className="py-5">
            {carouselSlides.map((slide) => (
              <CarouselItem key={slide.id} className="pl-0">
                <div className="flex flex-col-reverse sm:flex-row gap-8 items-center w-full">
                  {/* Text Section */}
                  <div className="flex-1 max-w-[609px] text-center sm:text-start z-10">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-light-black leading-[1.4] tracking-wide">
                      {slide.title}{" "}
                      <span className="text-secondary">
                        {slide.highlightedText}
                      </span>
                      {slide.subtitle}
                    </h1>
                    <p className="text-light-black text-sm sm:text-base leading-relaxed mb-6 max-w-[350px] mx-auto sm:mx-0">
                      {slide.description}
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
                        style={{
                          transformStyle: "preserve-3d",
                          perspective: "1000px",
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                        }}
                      >
                        <ImageFallback
                          alt={slide.boyAlt}
                          src={slide.boyImage}
                          fill
                          className="object-cover object-center"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                          }}
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
                          alt={slide.girlAlt}
                          src={slide.girlImage}
                          fill
                          className="object-cover object-center"
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Navigation Dots */}
        <div className="flex gap-2 mt-8 z-20 justify-center">
          {carouselSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => api?.scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                selectedIndex === index
                  ? "bg-primary  "
                  : "bg-[#D2D2D2] hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
