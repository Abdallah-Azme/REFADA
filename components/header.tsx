"use client";

import { useState, useEffect, useRef } from "react";
import { Settings } from "@/features/settings/types/settings.schema";
import MainHeader from "./main-header";
import TopHeader from "./top-header";

interface HeaderProps {
  settings?: Settings;
}

export default function Header({ settings }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const updateScrollState = () => {
      const scrollY = window.scrollY;

      // Simple logic: shrink after 150px, expand only at very top
      if (scrollY > 150) {
        setIsScrolled(true);
      } else if (scrollY === 0) {
        setIsScrolled(false);
      }

      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollState);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-5000">
      {/* Top bar - slides up when scrolled */}
      <div
        className={`transition-all duration-300 ease-out overflow-hidden ${
          isScrolled ? "max-h-0 opacity-0" : "max-h-[200px] opacity-100"
        }`}
      >
        <TopHeader settings={settings} />
      </div>
      {/* Main Navigation */}
      <MainHeader settings={settings} isScrolled={isScrolled} />
    </header>
  );
}
