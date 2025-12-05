"use client";
import ImageFallback from "@/components/shared/image-fallback";
import { motion } from "framer-motion";

export default function ImageDecorations() {
  return (
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
  );
}
