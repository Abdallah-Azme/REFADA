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

const testimonials = [
  {
    name: "أحمد عبد الله",
    date: "12/10/2025",
    message:
      "فخورين بشراكتنا مع هذا الفريق المتميز، التنظيم والتزامهم جعل العمل معنا تجربة مثمرة.",
    image: "/pages/pages/user.webp",
  },
  {
    name: "فاطمة السيد",
    date: "12/10/2025",
    message:
      "تجربتي كمتطوعة كانت رائعة جداً، لم أتخيل أن كل جهد بسيط يصنع فرق حقيقي.",
    image: "/pages/pages/user.webp",
  },
  {
    name: "محمد علي",
    date: "12/10/2025",
    message:
      "ما كنت أتوقع إن التواصل يكون بالسلاسة دي، حسّيت إن في حد فعلاً مهتم يسمعني ويساعد.",
    image: "/pages/pages/user.webp",
  },
  {
    name: "أمير عصام",
    date: "12/10/2025",
    message:
      "المنصة خلّت التعامل بمهنية، كل البيانات محفوظة وعملية وهتخلينا نكمل بثقة.",
    image: "/pages/pages/user.webp",
  },
  {
    name: "أحمد عبد الله",
    date: "12/10/2025",
    message:
      "فخورين بشراكتنا مع هذا الفريق المتميز، التنظيم والتزامهم جعل العمل معنا تجربة مثمرة.",
    image: "/pages/pages/user.webp",
  },
  {
    name: "فاطمة السيد",
    date: "12/10/2025",
    message:
      "تجربتي كمتطوعة كانت رائعة جداً، لم أتخيل أن كل جهد بسيط يصنع فرق حقيقي.",
    image: "/pages/pages/user.webp",
  },
  {
    name: "محمد علي",
    date: "12/10/2025",
    message:
      "ما كنت أتوقع إن التواصل يكون بالسلاسة دي، حسّيت إن في حد فعلاً مهتم يسمعني ويساعد.",
    image: "/pages/pages/user.webp",
  },
  {
    name: "أمير عصام",
    date: "12/10/2025",
    message:
      "المنصة خلّت التعامل بمهنية، كل البيانات محفوظة وعملية وهتخلينا نكمل بثقة.",
    image: "/pages/pages/user.webp",
  },
];

export default function TestimonialsSection() {
  const { isRTL } = useDirection();

  const autoplay = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

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
            آراء المستخدمين
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            نفخر بكل من شاركنا الرحلة وساهم في تحقيق الأثر الإنساني. هنا بعض
            الكلمات التي نعتز بها وتشجعنا على الاستمرار في العطاء.
          </p>
        </motion.div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          plugins={[autoplay.current]}
          opts={{
            align: "center",
            loop: true,
            direction: isRTL ? "rtl" : "ltr",
          }}
          className="  mx-auto relative"
        >
          <CarouselContent className="-ms-4">
            {testimonials.map((t, i) => (
              <CarouselItem key={i} className="pl-4 basis-[300px] shrink-0 ">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  className="bg-white flex gap-2.5 rounded-2xl    transition-all duration-300 p-6   h-full justify-between"
                >
                  <div className="flex items-center gap-3 mb-4 self-start">
                    <ImageFallback
                      src={t.image}
                      width={60}
                      height={60}
                      className="size-15 shrink-0  "
                    />
                  </div>
                  <div className="flex flex-col gap-2 text-start">
                    <h4 className="font-bold text-sm text-black">{t.name}</h4>
                    <p className="text-[8px] font-semibold text-[#747474]">
                      {t.date}
                    </p>
                    <p className="text-black text-sm leading-relaxed line-clamp-3">
                      {t.message}
                    </p>
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
              aria-label={`الشريحة ${i + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
