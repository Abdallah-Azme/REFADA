"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
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
        <Image
          src="/shared/refad-logo.svg"
          alt="REFAD Gaza"
          width={60}
          height={49}
          className="w-[60px] h-[49px] select-none"
          priority
        />
      </Link>
    </motion.div>
  );
}
