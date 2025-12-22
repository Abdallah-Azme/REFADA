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
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDirection } from "@/hooks/use-direction";
import { MoveLeft, MoveRight } from "lucide-react";
import { CampCard } from "@/features/campaign/components/camp-card";
import Link from "next/link";
import { Camp } from "@/features/camps/types/camp.schema";

interface CampsSectionProps {
  camps?: Camp[];
}

export default function CampsSection({ camps = [] }: CampsSectionProps) {
  const { isRTL } = useDirection();

  const autoplay = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Don't render carousel if no camps
  if (!camps || camps.length === 0) {
    return null;
  }

  React.useEffect(() => {
    if (!api || camps.length === 0) return;

    try {
      setCurrent(api.selectedScrollSnap());
      api.on("select", () => setCurrent(api.selectedScrollSnap()));

      // Access autoplay plugin via api
      // plugins() returns an array or object depending on embla version
      const plugins = api.plugins();
      if (!plugins) return;

      // Try accessing as object first (newer embla versions)
      let autoplayPlugin = (plugins as any)?.autoplay;

      // If not found, try finding in array (older embla versions)
      if (!autoplayPlugin && Array.isArray(plugins)) {
        autoplayPlugin = plugins.find(
          (plugin: any) => plugin?.play || plugin?.stop
        );
      }

      if (autoplayPlugin && typeof autoplayPlugin.play === "function") {
        autoplayPlugin.play();
      }
    } catch (error) {
      // Silently handle errors during initialization
      console.warn("Carousel initialization error:", error);
    }

    return () => {
      try {
        const plugins = api?.plugins();
        if (!plugins) return;

        let autoplayPlugin = (plugins as any)?.autoplay;
        if (!autoplayPlugin && Array.isArray(plugins)) {
          autoplayPlugin = plugins.find((plugin: any) => plugin?.stop);
        }

        if (autoplayPlugin && typeof autoplayPlugin.stop === "function") {
          autoplayPlugin.stop();
        }
      } catch (error) {
        // Silently handle cleanup errors
      }
    };
  }, [api, camps.length]);

  return (
    <section id="camps" className="container mx-auto px-4 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2">الإيواءات</h2>
        <p className="text-gray-600">
          الإيواءات الموثّقة تُمكّن من التخطيط الأفضل والاستجابة الأعدل.
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
        plugins={[autoplay.current] as any}
        className="relative"
      >
        <CarouselContent className="-ml-4">
          {camps.map((camp, index) => (
            <CarouselItem
              key={camp.id}
              className="pl-4 sm:basis-1/2 lg:basis-1/4"
            >
              <CampCard
                id={camp.id}
                title={camp.name}
                location={camp.location || ""}
                families={camp.familyCount || 0}
                image={camp.campImg || "/placeholder.jpg"}
                index={index}
                slug={camp.slug}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: Math.ceil(camps.length / 4) }).map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i * 4)}
            className={cn(
              "size-2.5 rounded-full transition-all duration-300",
              current >= i * 4 && current < (i + 1) * 4
                ? "bg-primary "
                : "bg-[#D2D2D2] "
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <Button
        variant={"outline"}
        asChild
        className="mt-8 rounded-full px-12! py-8! border-primary hover:bg-primary text-black hover:text-white"
      >
        <Link href="/camps">
          {!isRTL && <MoveRight />}
          المزيد من الإيواءات
          {isRTL && <MoveLeft />}
        </Link>
      </Button>
    </section>
  );
}
