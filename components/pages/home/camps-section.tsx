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

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));

    // Access autoplay plugin via api
    const autoplayPlugin = api.plugins()?.autoplay as any;
    if (autoplayPlugin && autoplayPlugin.play) {
      autoplayPlugin.play();
    }

    return () => {
      const autoplayPlugin = api.plugins()?.autoplay as any;
      if (autoplayPlugin && autoplayPlugin.stop) {
        autoplayPlugin.stop();
      }
    };
  }, [api]);

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
