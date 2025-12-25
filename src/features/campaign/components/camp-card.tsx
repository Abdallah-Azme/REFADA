"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ImageFallback from "@/components/shared/image-fallback";
import Link from "next/link";

interface CampCardProps {
  id: number;
  title: string;
  slug?: string;
  location: string;
  families: number;
  image: string;
  index: number;
  dashboard?: boolean;
}

export function CampCard({
  id,
  title,
  slug,
  location,
  families,
  image,
  index,
  dashboard = false,
}: CampCardProps) {
  return (
    <Link
      href={
        dashboard
          ? `/dashboard/contributor/camps/${slug || id}`
          : `/camps/${slug || title}`
      }
      key={id}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer"
      >
        {/* Image */}
        <ImageFallback
          src={image}
          alt={title}
          width={302}
          height={380}
          className="w-full h-[380px] object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute bottom-4 start-4 end-4 text-right text-white">
          <h3 className="text-lg font-bold">{title}</h3>
          <div className="text-sm text-gray-200 flex items-center justify-between gap-2">
            <span>{families} عائلة</span>

            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {location}
            </span>
          </div>
        </div>

        {/* Donate Button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-secondary text-white hover:bg-secondary/90 px-10! py-8! opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
        >
          للتفاصيل ←
        </Button>
      </motion.div>
    </Link>
  );
}
