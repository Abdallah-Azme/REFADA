"use client";
import ImageFallback from "@/components/shared/image-fallback";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Shield, FileText, Lock, Scale, Globe, Users } from "lucide-react";
import Link from "next/link";

interface Section {
  id: number;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  image?: string | null;
}

interface PolicySectionProps {
  secondary?: boolean;
  sections?: Section[];
}

// Map section index to icon and href
const sectionConfig = [
  { icon: Shield, href: "/transparency", fallbackTitle: "الشفافية" },
  {
    icon: FileText,
    href: "/terms-and-conditions",
    fallbackTitle: "شروط الاستخدام",
  },
  { icon: Lock, href: "/privacy", fallbackTitle: "الخصوصية" },
  {
    icon: Scale,
    href: "/intellectual-property",
    fallbackTitle: "حقوق الملكية",
  },
  { icon: Globe, href: "/platform-limits", fallbackTitle: "حدود دور المنصة" },
  {
    icon: Users,
    href: "/vulnerable-protection",
    fallbackTitle: "حماية الفئات الهشة",
  },
];

export default function PolicySection({
  secondary = false,
  sections = [],
}: PolicySectionProps) {
  // Use API sections or fallback to default titles
  const cards = sectionConfig.map((config, index) => {
    const section = sections[index];
    return {
      icon: config.icon,
      title: section?.title?.ar || config.fallbackTitle,
      desc: section?.description?.ar || "",
      href: config.href,
      image: section?.image,
    };
  });

  return (
    <section
      className={cn(
        " text-white py-5 lg:py-20 overflow-hidden rounded-t-[50px] sm:rounded-t-[100px]  ",
        secondary ? "bg-white" : "bg-primary  mt-[-50px]"
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
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-10 text-center">
          {cards.map((card, i) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-6 flex flex-col items-center h-full"
              >
                {/* Show image if available, otherwise show icon */}
                {card.image ? (
                  <div
                    className={cn(
                      "mb-4 rounded-full overflow-hidden w-20 h-20 sm:w-32 sm:h-32 shrink-0",
                      secondary ? "bg-[#DEEDEA]" : "bg-white"
                    )}
                  >
                    <ImageFallback
                      src={card.image}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      alt={card.title}
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      "mb-4 rounded-full text-primary p-4 sm:p-10 shrink-0",
                      secondary ? "bg-[#DEEDEA]" : "bg-white"
                    )}
                  >
                    <IconComponent
                      className={cn(
                        "w-10 h-10",
                        secondary ? "text-secondary" : "text-primary"
                      )}
                    />
                  </div>
                )}
                <div className="text-start sm:text-center flex flex-col gap-2 flex-1">
                  <h3
                    className={cn(
                      "text-xl font-bold",
                      secondary ? "text-[#1E1E1E]" : "text-white"
                    )}
                  >
                    {card.title}
                  </h3>
                  {card.desc && (
                    <div
                      className={cn(
                        "max-w-[300px] leading-relaxed line-clamp-3",
                        secondary ? "text-[#494949]" : "text-white"
                      )}
                      dangerouslySetInnerHTML={{ __html: card.desc }}
                    />
                  )}
                </div>
                <button className="text-secondary w-fit sm:mx-auto font-semibold hover:underline mt-auto pt-2">
                  <Link href={card.href}>المزيد</Link>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
