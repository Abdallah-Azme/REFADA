"use client";
import ImageFallback from "@/components/shared/image-fallback";
import { motion } from "framer-motion";
import Image from "next/image";

export default function PartnersSection() {
  const partners = [
    { src: "/pages/home/coursera.png", alt: "Coursera" },
    { src: "/pages/home/udemy.png", alt: "Udemy" },
    { src: "/pages/home/oxford.png", alt: "Oxford" },
    { src: "/pages/home/michigan-state.png", alt: "Michigan State University" },
  ];

  return (
    <section className="bg-[#C2B693] text-center py-16 rounded-b-[100px]">
      <h3 className="text-2xl md:text-3xl font-bold text-[#1F3A36] mb-10">
        شركاؤنا
      </h3>

      <div className="flex flex-wrap items-center justify-between container mx-auto px-4 gap-10  ">
        {partners.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="flex items-center justify-center grayscale hover:grayscale-0 transition duration-300"
          >
            <ImageFallback src={p.src} alt={p.alt} width={150} height={60} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
