"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Phone, Twitter } from "lucide-react";
import Logo from "./logo";

export default function TopHeader() {
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.15,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-primary text-white"
    >
      <div className="py-4 px-4 flex items-center justify-between gap-2 sm:gap-6 container mx-auto">
        {/* Logo */}
        <motion.div variants={itemVariants}>
          <Logo />
        </motion.div>

        {/* Phone */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <span className="hover:text-secondary transition-colors duration-300">
            +972-22-333-4444
          </span>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="hidden sm:block"
          >
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/10 hover:bg-white/20 rounded-full w-9 h-9 text-white transition-transform duration-300"
            >
              <Phone size={18} />
            </Button>
          </motion.div>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-1 sm:gap-4"
        >
          {[Instagram, Twitter, Facebook].map((Icon, i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.15,
                rotate: 8,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              <Button
                size="icon"
                variant="ghost"
                className="bg-white/10 hover:bg-white/20 rounded-full w-9 h-9 text-white transition-all duration-300"
              >
                <Icon size={18} />
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
