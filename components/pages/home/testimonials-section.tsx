"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ImageFallback from "@/components/shared/image-fallback";
import { useDirection } from "@/hooks/use-direction";
import { Testimonial } from "@/features/testimonials/types/testimonial.schema";
import { useTranslations } from "next-intl";

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export default function TestimonialsSection({
  testimonials = [],
}: TestimonialsSectionProps) {
  const { isRTL } = useDirection();
  const t_trans = useTranslations("testimonials");

  const autoplay = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  console.log("testimonials", testimonials);
  // Optionally hide if empty
  if (testimonials.length === 0) return null;

  return (
    <div className="bg-[#EEEADD] -mb-6">
      <section className="relative py-20 px-4 container mx-auto text-center  overflow-hidden">
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <ImageFallback
            src="/pages/pages/wheat.webp"
            width={136}
            height={184}
            className="absolute bottom-0 right-0 w-[136px] h-[184px]"
          />
          <ImageFallback
            src="/pages/pages/heart.webp"
            width={78}
            height={64}
            className="absolute top-0 left-1/4 w-16 h-[78px]"
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative z-10  mx-auto mb-14"
        >
          <h2 className="text-3xl font-bold mb-3 text-[#1C3A34]">
            {t_trans("title")}
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            {t_trans("description")}
          </p>
        </motion.div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          plugins={[autoplay.current as any]}
          opts={{
            align: "center",
            loop: true,
            direction: isRTL ? "rtl" : "ltr",
          }}
          className="  mx-auto relative"
        >
          <CarouselContent className="-ms-4">
            {testimonials.map((t, i) => (
              <CarouselItem key={i} className="pl-4 basis-[380px] shrink-0 ">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  className="bg-white flex flex-row-reverse gap-4 rounded-2xl transition-all duration-300 p-6 h-full"
                >
                  {/* Text Content */}
                  <div className="flex flex-col gap-2 text-start flex-1">
                    <h4 className="font-bold text-lg text-[#B8A47C]">
                      {(t as any).userName || t.user_name}
                    </h4>
                    <p className="text-xs font-medium text-[#747474]">
                      {(t as any).createdAt || t.created_at
                        ? new Date(
                            (t as any).createdAt || t.created_at
                          ).toLocaleDateString(isRTL ? "ar" : "en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          })
                        : ""}
                    </p>
                    <p className="text-[#1C3A34] text-sm leading-relaxed line-clamp-4 mt-2">
                      {t.opinion}
                    </p>
                  </div>
                  {/* User Image */}
                  <div className="flex items-start shrink-0">
                    <ImageFallback
                      src={
                        (t as any).userImage ||
                        t.user_image ||
                        "/pages/pages/user.webp"
                      }
                      width={80}
                      height={80}
                      className="size-20 rounded-full object-cover"
                    />
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dots */}
        <div className="flex justify-center mt-8 gap-2 relative z-10">
          {Array.from({ length: testimonials.length }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "size-2.5 rounded-full transition-all  duration-300",
                current === i
                  ? "bg-[#0682E6]  "
                  : "bg-gray-400  hover:bg-gray-500"
              )}
              aria-label={t_trans("slide_aria", { index: i + 1 })}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
