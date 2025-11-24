"use client";
import ImageFallback from "@/components/shared/image-fallback";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import { useDirection } from "@/hooks/use-direction";

export default function PartnersSection({
  secondary = false,
}: {
  secondary?: boolean;
}) {
  const { isRTL } = useDirection();
  const partners = [
    { src: "/pages/home/coursera.png", alt: "Coursera" },
    { src: "/pages/home/udemy.png", alt: "Udemy" },
    { src: "/pages/home/oxford.png", alt: "Oxford" },
    { src: "/pages/home/michigan-state.png", alt: "Michigan State University" },
    { src: "/pages/home/coursera.png", alt: "Coursera" },
    { src: "/pages/home/udemy.png", alt: "Udemy" },
    { src: "/pages/home/oxford.png", alt: "Oxford" },
  ];

  const autoplay = useRef(Autoplay({ delay: 1500, stopOnInteraction: false }));

  const [api, setApi] = useState<CarouselApi>();

  return (
    <section
      className={cn(
        "bg-secondary text-center py-8 sm:py-16 ",
        secondary
          ? "rounded-t-[50px] sm:rounded-t-[100px]"
          : "rounded-b-[50px] sm:rounded-b-[100px]"
      )}
    >
      <h3 className="text-2xl md:text-3xl font-bold text-primary mb-10">
        شركاؤنا
      </h3>

      <div className="container mx-auto px-4">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            direction: isRTL ? "rtl" : "ltr",
          }}
          plugins={[autoplay.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {partners.map((p, i) => (
              <CarouselItem
                key={i}
                className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 2xl:basis-1/5"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (i % 5) * 0.1 }}
                  className="flex items-center justify-center grayscale hover:grayscale-0 transition duration-300 h-[100px]"
                >
                  <ImageFallback
                    src={p.src}
                    alt={p.alt}
                    width={150}
                    height={60}
                    className="object-contain"
                  />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
