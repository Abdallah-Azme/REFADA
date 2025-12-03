"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Eye, Target } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import ImageFallback from "./image-fallback";

// Animation Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const listContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const listItem = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function MissionVisionGoals() {
  return (
    <section className="container relative mx-auto px-4 py-10 grid md:grid-cols-2 gap-10 items-center overflow-hidden">
      {/* Decorative Backgrounds */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        <ImageFallback
          src="/pages/pages/wheat.webp"
          width={267}
          height={360}
          className="absolute bottom-0 right-0 w-[267px] h-[360px]"
        />
        <ImageFallback
          src="/pages/pages/heart.webp"
          width={200}
          height={245}
          className="absolute top-0 left-0 w-50 h-[245px]"
        />
      </motion.div>

      {/* Image Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative flex justify-center"
      >
        <div className="relative max-w-sm">
          <ImageFallback
            src="/pages/pages/hand-carrying-hope.webp"
            alt="hands holding ribbon"
            width={450}
            height={490}
            className="rounded-2xl object-cover"
          />
          <div className="absolute -bottom-3 left-0 right-0 h-2 bg-primary rounded-full mx-auto w-1/2" />
          <div className="absolute -top-3 -end-3 size-50 bg-secondary rounded-2xl -z-10 mx-auto" />
        </div>
      </motion.div>

      {/* Text Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col gap-6 rtl text-right z-10"
      >
        {/* Mission */}
        <motion.div variants={cardVariants}>
          <Card className="rounded-2xl shadow-sm border-none bg-gray-50">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-primary" size={20} />
                <h3 className="font-bold text-lg">رسالتنا</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                نحافظ على سرية بيانات المتبرعين والمستفيدين، ونستخدمها فقط لخدمة
                العمل الإنساني وفق أعلى معايير الأمان.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vision */}
        <motion.div variants={cardVariants}>
          <Card className="rounded-2xl shadow-sm border-none bg-gray-50">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Eye className="text-primary" size={20} />
                <h3 className="font-bold text-lg">رؤيتنا</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                نطمح لعلاقة مميزة مع المتبرعين والمتطوعين بما يضمن الثقة
                والمسؤولية المشتركة في تحقيق أهدافنا الإنسانية.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Goals */}
        <motion.div variants={cardVariants}>
          <Card className="rounded-2xl shadow-sm border-none bg-gray-50">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Target className="text-primary" size={20} />
                <h3 className="font-bold text-lg">أهدافنا</h3>
              </div>

              {/* Animated list */}
              <motion.ul
                variants={listContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="list-disc pr-5 space-y-2 text-gray-600"
              >
                {[
                  "تقديم الإغاثة العاجلة للفئات الأكثر احتياجاً من خلال المساعدات الطبية والخدمات الصحية.",
                  "دعم البرامج التعليمية وبناء القدرات للأطفال والأيتام وذوي الهمم.",
                  "بناء تعاون مع الجهات المحلية لتحقيق التنمية المستدامة وخدمة العمل الإنساني.",
                  "نشر روح التعاون والتكافل بين أفراد المجتمع.",
                ].map((text, i) => (
                  <motion.li key={i} variants={listItem}>
                    {text}
                  </motion.li>
                ))}
              </motion.ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
