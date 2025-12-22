"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Phone, Twitter, Linkedin } from "lucide-react"; // Linkedin added
import Logo from "./logo";
import { Settings } from "@/features/settings/types/settings.schema";

interface TopHeaderProps {
  settings?: Settings;
}

export default function TopHeader({ settings }: TopHeaderProps) {
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
      <div className="py-2 px-4 flex items-center justify-between gap-2 sm:gap-6 container mx-auto">
        {/* Logo */}
        <motion.div variants={itemVariants}>
          <Logo />
        </motion.div>

        {/* Phone */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 text-sm font-medium"
        >
          {settings?.phone ? (
            <span
              className="hover:text-secondary transition-colors duration-300"
              dir="ltr"
            >
              {settings.phone}
            </span>
          ) : (
            <span className="hover:text-secondary transition-colors duration-300">
              +972-22-333-4444
            </span>
          )}
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
          {[
            { Icon: Instagram, href: settings?.instagram },
            { Icon: Twitter, href: settings?.twitter },
            { Icon: Facebook, href: settings?.facebook },
          ].map(({ Icon, href }, i) => (
            // Conditionally render if we want, or just default to placeholder
            // If href unavailable, maybe hide it? Or default.
            // Let's render if we have settings, or keep existing map if not.
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
                asChild
              >
                <a href={href || "#"} target="_blank" rel="noopener noreferrer">
                  <Icon size={18} />
                </a>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
