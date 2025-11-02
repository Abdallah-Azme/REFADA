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
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "أحمد عبد الله",
    date: "12/10/2025",
    message:
      "تجربة مميزة جداً مع هذه الجهة، المتطوعين كانوا متعاونين جداً. أنصح الجميع بتجربتها.",
    image: "/avatars/user1.jpg",
  },
  {
    name: "فاطمة السيد",
    date: "09/10/2025",
    message:
      "خدمة متميزة ذات واجهة حديثة. كان لدي تجربة إيجابية جداً. شكراً لكم!",
    image: "/avatars/user2.jpg",
  },
  {
    name: "محمد علي",
    date: "07/10/2025",
    message: "ما شاء الله تواصل رائع، الردود بالسرعة المطلوبة. بارك الله فيكم.",
    image: "/avatars/user3.jpg",
  },
  {
    name: "أمير عصام",
    date: "05/10/2025",
    message:
      "أنصح كل شخص بالتعامل معهم، لأن خدماتهم دقيقة ونتائجهم مبهرة. شكراً جزيلاً.",
    image: "",
  },
];

export default function TestimonialsSection() {
  const plugin = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true })
  );

  const [current, setCurrent] = React.useState(0);

  return (
    <section
      className="bg-[#EDEBE2] py-16 px-4 text-center font-sans"
      dir="rtl"
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto mb-12"
      >
        <h2 className="text-2xl font-bold mb-2">آراء المستخدمين</h2>
        <p className="text-gray-600 text-sm">
          نفخر بكل من شاركنا النجاح وساهم في تحقيق الأثر الإنساني، هنا بعض
          الخدمات التي قدمناها وساهمت في الاستمرار في العطاء.
        </p>
      </motion.div>

      {/* Carousel */}
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
        opts={{
          align: "center",
          loop: true,
          direction: "rtl",
        }}
        className="max-w-6xl mx-auto"
      >
        <CarouselContent
          className="flex items-stretch"
          onScroll={(e) => {
            const scroll = e.currentTarget.scrollLeft;
            const width = e.currentTarget.scrollWidth / testimonials.length;
            setCurrent(Math.round(scroll / width));
          }}
        >
          {testimonials.map((t, index) => (
            <CarouselItem
              key={index}
              className="basis-full md:basis-1/2 lg:basis-1/3 px-2"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white shadow-md rounded-xl p-6 text-right flex flex-col h-full justify-between"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-12 h-12">
                    {t.image ? (
                      <AvatarImage src={t.image} alt={t.name} />
                    ) : (
                      <AvatarFallback>{t.name[0]}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-[#1C3A34]">{t.name}</h4>
                    <span className="text-xs text-gray-500">{t.date}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {t.message}
                </p>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Optional Arrows (Hidden on Mobile) */}
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>

      {/* Dot Controls */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              current === idx
                ? "bg-[#1C3A34] scale-110"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
