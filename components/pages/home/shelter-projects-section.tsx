"use client";

import { ProjectCard } from "@/features/campaign/components/project-card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDirection } from "@/hooks/use-direction";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { MoveLeft, MoveRight } from "lucide-react";
import * as React from "react";

export const projects = [
  {
    id: 1,
    title: "توزيع الطرود الغذائية",
    description: "من خلال الحصار الجائر، وتفاقم أزمات الجفاف، استمرار الحصار",
    location: "الأراضي الفلسطينية في قطاع غزة وخارجه",
    goal: 3600,
    current: 2500,
    donors: 165,
    image: "/pages/pages/project-1.webp",
    tag: "مقدم للنشاطين",
  },
  {
    id: 2,

    title: "توزيع الطرود الغذائية",
    description: "من خلال الحصار الجائر، وتفاقم أزمات الجفاف، استمرار الحصار",
    location: "الأراضي الفلسطينية في قطاع غزة وخارجه",
    goal: 3600,
    current: 1900,
    donors: 165,
    image: "/pages/pages/project-2.webp",
    tag: "مقدم للنشاطين",
  },
  {
    id: 3,

    title: "توزيع الطرود الغذائية",
    description: "من خلال الحصار الجائر، وتفاقم أزمات الجفاف، استمرار الحصار",
    location: "الأراضي الفلسطينية في قطاع غزة وخارجه",
    goal: 3600,
    current: 1300,
    donors: 165,
    image: "/pages/pages/project-3.webp",
    tag: "مقدم للنشاطين",
  },
  {
    id: 4,

    title: "توزيع الطرود الغذائية",
    description: "من خلال الحصار الجائر، وتفاقم أزمات الجفاف، استمرار الحصار",
    location: "الأراضي الفلسطينية في قطاع غزة وخارجه",
    goal: 3600,
    current: 1100,
    donors: 745,
    image: "/pages/pages/project-1.webp",
    tag: "مقدم للنشاطين",
  },
  {
    id: 5,

    title: "توزيع الطرود الغذائية",
    description: "من خلال الحصار الجائر، وتفاقم أزمات الجفاف، استمرار الحصار",
    location: "الأراضي الفلسطينية في قطاع غزة وخارجه",
    goal: 3600,
    current: 2500,
    donors: 165,
    image: "/pages/pages/project-2.webp",
    tag: "مقدم للنشاطين",
  },
  {
    id: 6,

    title: "توزيع الطرود الغذائية",
    description: "من خلال الحصار الجائر، وتفاقم أزمات الجفاف، استمرار الحصار",
    location: "الأراضي الفلسطينية في قطاع غزة وخارجه",
    goal: 3600,
    current: 1900,
    donors: 165,
    image: "/pages/pages/project-3.webp",
    tag: "مقدم للنشاطين",
  },
  {
    id: 7,

    title: "توزيع الطرود الغذائية",
    description: "من خلال الحصار الجائر، وتفاقم أزمات الجفاف، استمرار الحصار",
    location: "الأراضي الفلسطينية في قطاع غزة وخارجه",
    goal: 3600,
    current: 1300,
    donors: 165,
    image: "/pages/pages/project-1.webp",
    tag: "مقدم للنشاطين",
  },
  {
    id: 8,

    title: "توزيع الطرود الغذائية",
    description: "من خلال الحصار الجائر، وتفاقم أزمات الجفاف، استمرار الحصار",
    location: "الأراضي الفلسطينية في قطاع غزة وخارجه",
    goal: 3600,
    current: 1100,
    donors: 745,
    image: "/pages/pages/project-2.webp",
    tag: "مقدم للنشاطين",
  },
  {
    id: 9,

    title: "توزيع الطرود الغذائية",
    description: "من خلال الحصار الجائر، وتفاقم أزمات الجفاف، استمرار الحصار",
    location: "الأراضي الفلسطينية في قطاع غزة وخارجه",
    goal: 3600,
    current: 1100,
    donors: 745,
    image: "/pages/pages/project-3.webp",
    tag: "مقدم للنشاطين",
  },
];

export default function CurrentProjectsSection() {
  const { isRTL } = useDirection();

  const autoplay = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));

    // Start autoplay when ready
    try {
      autoplay.current.play?.();
    } catch (err) {}

    return () => {
      try {
        autoplay.current.stop?.();
      } catch (err) {}
    };
  }, [api]);

  return (
    <section className="relative container mx-auto px-4 py-16 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 right-12 w-16 h-16 text-teal-100 opacity-60">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50,10 L60,40 L90,50 L60,60 L50,90 L40,60 L10,50 L40,40 Z" />
        </svg>
      </div>
      <div className="absolute top-16 left-12 w-8 h-8 text-pink-200 opacity-70">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50,20 C50,20 20,35 20,55 C20,70 32,80 50,80 C68,80 80,70 80,55 C80,35 50,20 50,20 Z" />
        </svg>
      </div>
      <div className="absolute bottom-24 right-24 w-12 h-12 text-amber-100 opacity-50">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>
      <div className="absolute bottom-32 left-32 w-10 h-10 text-teal-200 opacity-40">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="35" />
        </svg>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-10 text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          المشاريع الحالية
        </h2>
        <p className="text-gray-600">
          ساهم بتبرعك في تغيير حياة محتاج، ضحصات الأبرع للأمل ومستمر الأثر 🌿
        </p>
      </motion.div>

      {/* Carousel */}
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          direction: isRTL ? "rtl" : "ltr",
        }}
        plugins={[autoplay.current]}
        className="relative"
      >
        <CarouselContent className="-ml-4 py-2">
          {projects.map((project, index) => {
            const percentage = Math.round(
              (project.current / project.goal) * 100
            );

            return (
              <CarouselItem
                key={index}
                className="pl-4 sm:basis-1/2 lg:basis-1/4"
              >
                <ProjectCard
                  index={index}
                  image={project.image}
                  title={project.title}
                  description={project.description}
                  location={project.location}
                  tag={project.tag}
                  goal={project.goal}
                  current={project.current}
                  donors={project.donors}
                  percentage={percentage}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Arrows */}
        <CarouselPrevious className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2" />
      </Carousel>

      {/* Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: Math.ceil(projects.length / 4) }).map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i * 4)}
            className={cn(
              "size-2.5 rounded-full transition-all duration-300",
              current >= i * 4 && current < (i + 1) * 4
                ? "bg-primary"
                : "bg-[#D2D2D2]"
            )}
            aria-label={`انتقل إلى الشريحة ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
