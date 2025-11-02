"use client";

import MainHeader from "./main-header";
import TopHeader from "./top-header";

export default function Header() {
  return (
    <header className="">
      {/* Top bar */}
      <TopHeader />
      {/* Main Navigation */}
      <MainHeader />
    </header>
  );
}
