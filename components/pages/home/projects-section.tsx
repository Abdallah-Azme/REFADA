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
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  raised: number;
  goal: number;
}

const projects: Project[] = [
  {
    id: 1,
    title: "توزيع الطرود الغذائية",
    description:
      "في ظل الحصار القاسي، نواصل العمل لتأمين المساعدات الغذائية للعائلات المحتاجة.",
    category: "مهمات المساعدات",
    image: "/projects/project1.jpg",
    raised: 3500,
    goal: 3500,
  },
  {
    id: 2,
    title: "توزيع الطرود الغذائية",
    description:
      "مرحل الحصار الثانية تتطلب الدعم لاستمرار مشروع توزيع الغذاء في قطاع غزة.",
    category: "مهمات المساعدات",
    image: "/projects/project2.jpg",
    raised: 1300,
    goal: 3500,
  },
  {
    id: 3,
    title: "توزيع الطرود الغذائية",
    description:
      "بجهودكم نستمر في تحقيق الأمن الغذائي للأسر الفقيرة في المناطق المنكوبة.",
    category: "مهمات المساعدات",
    image: "/projects/project3.jpg",
    raised: 1900,
    goal: 3500,
  },
  {
    id: 4,
    title: "مشروع كسوة الشتاء",
    description:
      "نهدف لتوفير الملابس والأغطية للأسر المتضررة مع حلول فصل الشتاء.",
    category: "مهمات الإغاثة",
    image: "/projects/project4.jpg",
    raised: 900,
    goal: 3000,
  },
];

export default function ProjectsSection() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );
  const [current, setCurrent] = React.useState(0);

  return (
    <section className="bg-white py-16 px-6 font-sans" dir="rtl">
      {/* Title */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold mb-2 text-[#1C3A34]">
          المشاريع الحالية
        </h2>
        <p className="text-gray-600 text-sm">
          ساهم بتبرعك في تغيير حياة محتاج، ليزهر الأمل ويستمر العطاء 🌿
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
        <CarouselContent>
          {projects.map((project, index) => {
            const progress = Math.min(
              (project.raised / project.goal) * 100,
              100
            );

            // Dynamic color
            const progressColor =
              progress >= 80
                ? "bg-green-600"
                : progress >= 50
                ? "bg-yellow-500"
                : "bg-red-500";

            return (
              <CarouselItem
                key={project.id}
                className="basis-full sm:basis-1/2 lg:basis-1/3 px-3"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden h-full flex flex-col"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <span className="inline-block text-xs bg-blue-100 text-blue-700 rounded-md px-2 py-1 mb-2">
                        {project.category}
                      </span>
                      <h3 className="font-semibold text-[#1C3A34] mb-1">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${progressColor} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>المجموع: {project.goal}</span>
                        <span>{progress.toFixed(0)}%</span>
                        <span>المحقق: {project.raised}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {projects.map((_, idx) => (
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

      {/* More Projects Button */}
      <div className="flex justify-center mt-8">
        <Button className="rounded-full bg-[#EDEBE2] text-[#1C3A34] hover:bg-[#d9d7ce] flex items-center gap-2 px-6">
          <ArrowLeft size={16} />
          المزيد من المشاريع
        </Button>
      </div>
    </section>
  );
}
