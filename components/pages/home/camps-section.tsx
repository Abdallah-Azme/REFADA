"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDirection } from "@/hooks/use-direction";
import { MoveLeft, MoveRight } from "lucide-react";
import { CampCard } from "@/components/campaign/camp-card";

export const shelters = [
  {
    id: 1,
    title: "مخيم المغازي",
    location: "خان يونس",
    families: 2400,
    image: "/pages/home/gaza-camp-1.webp",
  },
  {
    id: 2,
    title: "مخيم أصدقاء",
    location: "خان يونس",
    families: 2400,
    image: "/pages/home/gaza-camp-2.webp",
  },
  {
    id: 3,
    title: "مخيم النصيرات",
    location: "خان يونس",
    families: 3000,
    image: "/pages/home/gaza-camp-3.webp",
  },
  {
    id: 4,
    title: "مخيم جباليا",
    location: "خان يونس",
    families: 2400,
    image: "/pages/home/gaza-camp-4.webp",
  },
  {
    id: 5,
    title: "مخيم المغازي",
    location: "خان يونس",
    families: 2400,
    image: "/pages/home/gaza-camp-1.webp",
  },
  {
    id: 6,
    title: "مخيم أصدقاء",
    location: "خان يونس",
    families: 2400,
    image: "/pages/home/gaza-camp-2.webp",
  },
  {
    id: 7,
    title: "مخيم النصيرات",
    location: "خان يونس",
    families: 3000,
    image: "/pages/home/gaza-camp-3.webp",
  },
  {
    id: 8,
    title: "مخيم جباليا",
    location: "خان يونس",
    families: 2400,
    image: "/pages/home/gaza-camp-4.webp",
  },
  {
    id: 9,
    title: "مخيم أصدقاء",
    location: "خان يونس",
    families: 2400,
    image: "/pages/home/gaza-camp-2.webp",
  },
];

export default function CampsSection() {
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

    autoplay.current.play?.();

    return () => {
      autoplay.current.stop?.();
    };
  }, [api]);

  return (
    <section id="camps" className="container mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2">الإيواءات</h2>
        <p className="text-gray-600">
          ساهم بتبرعك في تغيير حياة محتاج، فبمساعدتك تزرع الأمل وتستمر الأثر 🌿
        </p>
      </motion.div>

      {/* ✅ Simplified Carousel */}
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
        <CarouselContent className="-ml-4">
          {shelters.map((shelter, index) => (
            <CarouselItem
              key={shelter.id}
              className="pl-4 sm:basis-1/2 lg:basis-1/4"
            >
              <CampCard {...shelter} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2" />
      </Carousel>

      {/* Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: Math.ceil(shelters.length / 4) }).map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i * 4)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              current >= i * 4 && current < (i + 1) * 4
                ? "bg-primary w-8"
                : "bg-gray-300 w-2"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <Button
        variant={"outline"}
        className="mt-8 rounded-full px-12! py-8! border-primary hover:bg-primary text-black hover:text-white"
      >
        {!isRTL && <MoveRight />}
        المزيد من المشاريع
        {isRTL && <MoveLeft />}
      </Button>
    </section>
  );
}
