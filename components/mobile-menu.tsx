"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LangSwitcher from "./lang-switcher";

interface MobileMenuProps {
  navItems: {
    label: string;
    href: string;
  }[];
}

export default function MobileMenu({ navItems }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden">
        <motion.div
          whileTap={{ scale: 0.9 }}
          whileHover={{ rotate: 10 }}
          transition={{ duration: 0.2 }}
        >
          <Menu size={28} className="text-primary" />
        </motion.div>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="p-6 flex flex-col border-l border-[#C8BA90]/30 bg-gradient-to-b from-[#F9F9F7] to-[#F1EFE8]"
      >
        <motion.nav
          className="flex flex-col gap-4 mt-10 text-lg font-semibold"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {navItems.map((item, i) => {
            const isActive = pathname === item.href;

            return (
              <SheetClose asChild key={i}>
                <Link
                  href={item.href}
                  className={`
                  rounded-lg px-3 py-2 cursor-pointer transition-all duration-200 block
                  ${
                    isActive
                      ? "bg-[#274540]/10 border-b-2 border-[#C8BA90] text-[#274540]"
                      : "text-gray-700 hover:text-[#274540]"
                  }
                `}
                >
                  <motion.span
                    whileHover={{
                      x: 8,
                      backgroundColor: "rgba(39, 69, 64, 0.08)",
                    }}
                    transition={{ type: "spring", stiffness: 250 }}
                    className="block w-full rounded-lg"
                  >
                    {item.label}
                  </motion.span>
                </Link>
              </SheetClose>
            );
          })}
        </motion.nav>

        <motion.div
          className="mt-auto pt-8 border-t border-[#C8BA90]/30 flex justify-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <LangSwitcher />
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
