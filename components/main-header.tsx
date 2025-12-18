"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import LangSwitcher from "./lang-switcher";
import { motion, AnimatePresence } from "framer-motion";
import MobileMenu from "./mobile-menu";
import { useDirection } from "@/hooks/use-direction";
import { useAuth } from "@/features/auth/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings } from "@/features/settings/types/settings.schema";

interface MainHeaderProps {
  settings?: Settings;
}

export default function MainHeader({ settings }: MainHeaderProps) {
  const pathName = usePathname();
  const t = useTranslations();
  const { isRTL } = useDirection();
  const { user, isAuthenticated } = useAuth();

  const navItems = [
    { label: t("home"), href: "/" },
    { label: t("about"), href: "/aboutus" },
    { label: t("camps_nav"), href: "/camps" },
    { label: t("feedback"), href: "/suggestions" },
    { label: t("stats"), href: "/stats" },
    { label: t("contact"), href: "/contactus" },
  ];

  return (
    <div className="py-4 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 container mx-auto ">
        {/* --- Desktop Navigation --- */}
        <nav className="hidden lg:flex gap-10 font-medium text-sm">
          {navItems.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "relative overflow-hidden hover:text-primary font-semibold transition text-muted",
                  item.href === pathName && "font-bold text-primary"
                )}
              >
                {item.label}
                <AnimatePresence>
                  {pathName === item.href && (
                    <motion.span
                      layoutId="underline"
                      className="absolute -bottom-2 right-0 w-full h-1 bg-secondary rounded-full"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* --- Right Side Actions --- */}
        <div className="flex items-center justify-between gap-4 w-full lg:w-fit">
          <div className="flex items-center gap-2">
            <LangSwitcher />
            {isAuthenticated && user ? (
              <Link
                href={
                  user.role === "admin"
                    ? "/dashboard/admin"
                    : user.role === "delegate"
                    ? "/dashboard/families"
                    : "/dashboard/contributor"
                }
                className="relative h-10 w-10 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
              >
                <Avatar className="flex items-center justify-center">
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-primary  text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Button
                asChild
                className="bg-secondary text-primary hover:text-secondary hover:bg-primary px-5 py-3 font-semibold rounded-full gap-2 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Link href="/signin">
                  {t("sign_in")}
                  {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </Link>
              </Button>
            )}
          </div>

          {/* --- Mobile Menu --- */}
          <MobileMenu navItems={navItems} />
        </div>
      </div>
    </div>
  );
}
