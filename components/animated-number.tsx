"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface AnimatedNumberProps {
  to: number;
  duration?: number;
  className?: string;
}

export default function AnimatedNumber({
  to,
  duration = 2,
  className = "",
}: AnimatedNumberProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v));

  useEffect(() => {
    const controls = animate(count, to, {
      duration,
      ease: "easeOut",
    });

    return controls.stop;
  }, [to]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
