"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Users } from "lucide-react";
import Link from "next/link";
import ImageFallback from "@/components/shared/image-fallback";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const shelters = [
  {
    title: "مخيم المغازي",
    families: 2400,
    location: "خان يونس",
    image: "/images/shelter1.jpg",
  },
  {
    title: "مخيم أصداء",
    families: 2400,
    location: "خان يونس",
    image: "/images/shelter2.jpg",
  },
  {
    title: "مخيم النصيرات",
    families: 3000,
    location: "خان يونس",
    image: "/images/shelter3.jpg",
  },
  {
    title: "مخيم جباليا",
    families: 2400,
    location: "خان يونس",
    image: "/images/shelter4.jpg",
  },
];

export default function ShelterProjectsSection() {
  return (
    <section className="relative py-20 bg-[#F7F7F5] text-right overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F3A36] mb-3">
            الإيواءات
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            ساهم بتبرعك في تغيير حياة مئات العائلات بمخيمات الأمل ومستمر الأثر
            🌿
          </p>
        </motion.div>

        {/* Carousel */}
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="flex gap-6 -ml-6">
            {shelters.map((shelter, i) => (
              <CarouselItem
                key={i}
                className="pl-6 flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer"
                >
                  <ImageFallback
                    src={shelter.image}
                    alt={shelter.title}
                    width={400}
                    height={300}
                    className="object-cover w-full h-72 group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
                    <h3 className="text-lg font-semibold mb-1">
                      {shelter.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm opacity-90">
                      <span className="flex items-center gap-1">
                        <Users size={14} /> {shelter.families} عائلة
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {shelter.location}
                      </span>
                    </div>

                    {i === 3 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="absolute top-4 left-4 bg-[#C2B693] text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#b7a782] transition"
                      >
                        المزيد
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md" />
        </Carousel>

        {/* Button */}
        <div className="flex justify-center mt-10">
          <Link
            href="#"
            className="border border-[#1F3A36] text-[#1F3A36] font-medium rounded-full px-8 py-3 hover:bg-[#1F3A36] hover:text-white transition"
          >
            ← المزيد من المشاريع
          </Link>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute top-10 left-10 w-5 h-5 bg-[#C2B693] rounded-full opacity-70" />
      <div className="absolute bottom-20 right-12 w-4 h-4 bg-[#1F3A36] rounded-full opacity-70" />
      <div className="absolute top-24 right-24 w-3 h-3 bg-blue-300 rounded-full opacity-70" />
    </section>
  );
}
