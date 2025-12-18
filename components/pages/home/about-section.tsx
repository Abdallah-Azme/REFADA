"use client";
import ImageFallback from "@/components/shared/image-fallback";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AboutSectionProps {
  title?: string;
  description?: string;
}

export default function AboutSection({
  title = "من نحن ؟",
  description = "نحن فريق يسعى لجبر الخواطر الإنسانية، نعمل من قلب المعاناة وسط الركام وأوات الدموع والأمل، نمد يد العون ونزرع بذور الخير في كل أروقة فلسطين.",
}: AboutSectionProps) {
  return (
    <section className="relative overflow-hidden min-h-[500px]">
      {/* Background image */}
      <div className="absolute inset-0 z-0 h-[500px]">
        <ImageFallback
          src="/pages/home/shake-hands.webp"
          alt="About background"
          fill
          className="object-cover brightness-[0.55]"
        />
      </div>

      <div className="relative z-10 container mx-auto py-24 text-center text-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto leading-loose text-lg mb-10"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          <Link
            href="/aboutus"
            className="bg-secondary flex gap-2 items-center text-primary font-semibold px-8 py-3 sm:px-16 sm:py-4 rounded-full hover:bg-[#b7a782] transition-all duration-300"
          >
            المزيد
            <ArrowLeft />
          </Link>
          <Link
            href="/contactus"
            className="border flex gap-2 border-secbg-secondary text-white font-semibold px-8 py-3 sm:px-16 sm:py-4 rounded-full hover:bg-[#C2B693] hover:text-black transition-all duration-300"
          >
            اتصل بنا
            <ArrowLeft />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
