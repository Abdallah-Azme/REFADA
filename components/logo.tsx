"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ImageFallback from "./shared/image-fallback";
import { cn } from "@/lib/utils";
import { useWebsiteSettings } from "@/features/home-control/hooks/use-website-settings";

export default function Logo({ className }: { className?: string }) {
  const { data: settingsResponse } = useWebsiteSettings();
  const logoSrc = settingsResponse?.data?.siteLogo || "/shared/refad-logo.svg";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1], // smooth cubic-bezier
      }}
      whileHover={{
        scale: 1.08,
        rotate: [0, -3, 3, 0], // subtle wobble effect
        transition: { duration: 0.6, ease: "easeInOut" },
      }}
      className="inline-block cursor-pointer"
    >
      <Link href={"/"}>
        <ImageFallback
          src={logoSrc}
          alt="REFAD Gaza"
          width={120}
          height={120}
          className={cn(
            "w-[120px] h-[120px] select-none object-contain",
            className
          )}
        />
      </Link>
    </motion.div>
  );
}
