"use client";

import { Settings } from "@/features/settings/types/settings.schema";
import MainHeader from "./main-header";
import TopHeader from "./top-header";

interface HeaderProps {
  settings?: Settings;
}

export default function Header({ settings }: HeaderProps) {
  return (
    <header className="sticky top-0 z-5000">
      {/* Top bar */}
      <TopHeader settings={settings} />
      {/* Main Navigation */}
      <MainHeader settings={settings} />
    </header>
  );
}
