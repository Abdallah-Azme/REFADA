"use client";
import ImageFallback from "@/components/shared/image-fallback";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Shield, FileText, Lock } from "lucide-react";
import Link from "next/link";

export default function PolicySection({
  secondary = false,
}: {
  secondary?: boolean;
}) {
  const cards = [
    {
      icon: (
        <Lock
          className={cn(
            "w-10 h-10 ",
            secondary ? "text-secondary" : " text-primary"
          )}
        />
      ),
      title: "الخصوصية",
      desc: "نحافظ على بيانات المتبرعين والمستفيدين ونستخدمها لخدمة العمل الخيري.",
      href: "/privacy",
    },
    {
      icon: (
        <FileText
          className={cn(
            "w-10 h-10 ",
            secondary ? "text-secondary" : " text-primary"
          )}
        />
      ),
      title: "شروط الاستخدام",
      desc: "تنظم علاقتنا بالمتبرعين والمستفيدين بما يضمن الشفافية وتحقيق أهدافنا.",
      href: "/terms-and-conditions",
    },
    {
      icon: (
        <Shield
          className={cn(
            "w-10 h-10 ",
            secondary ? "text-secondary" : " text-primary"
          )}
        />
      ),
      title: "الشفافية",
      desc: "نلتزم بالتوضيح في كل مراحل عملنا ونبلغ المتبرعين بالتفاصيل بدقة ووضوح.",
      href: "/transparency",
    },
  ];
  return (
    <section
      className={cn(
        " text-white py-5 lg:py-20 overflow-hidden rounded-t-[50px] sm:rounded-t-[100px]   mt-[-50px]",
        secondary ? "bg-white" : "bg-primary"
      )}
    >
      <div className="container relative mx-auto px-6 ">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-10 text-center">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-6 flex gap-4 sm:flex-col items-center"
            >
              <div
                className={cn(
                  "mb-4   rounded-full text-primary p-4 sm:p-10",
                  secondary ? "bg-[#DEEDEA]" : "bg-white"
                )}
              >
                {card.icon}
              </div>
              <div className="text-start sm:text-center flex flex-col gap-2  ">
                <h3
                  className={cn(
                    "text-xl font-bold  ",
                    secondary ? " text-[#1E1E1E]" : "text-white"
                  )}
                >
                  {card.title}
                </h3>
                <p
                  className={cn(
                    " max-w-[300px] leading-relaxed",
                    secondary ? "text-[#494949]" : " text-white"
                  )}
                >
                  {card.desc}
                </p>
                <button className="text-secondary w-fit sm:mx-auto font-semibold hover:underline">
                  <Link href={card.href}>المزيد</Link>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
