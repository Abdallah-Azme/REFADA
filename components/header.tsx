"use client";

import MainHeader from "./main-header";
import TopHeader from "./top-header";

export default function Header() {
  return (
    <header className="sticky top-0 z-5000">
      {/* Top bar */}
      <TopHeader />
      {/* Main Navigation */}
      <MainHeader />
    </header>
  );
}
