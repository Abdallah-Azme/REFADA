"use client";

import { usePathname } from "next/navigation";
import LangSwitcher from "@/components/lang-switcher";
import AddFamilyDialog from "./add-family-dialog";
import DateTime from "./date-time";
import Notification from "./notification";
import SearchForm from "./search-form";
import UserAvatar from "./user-avatar";

export default function Header() {
  const pathname = usePathname();

  // Hide AddFamilyDialog if URL starts with /dashboard/contributor or /dashboard/admin
  const shouldShowFamilyDialog =
    !pathname.startsWith("/dashboard/contributor") &&
    !pathname.startsWith("/dashboard/admin");

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 h-20 flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        {/* User */}
        <UserAvatar />
        {/* Notification */}
        <Notification />
        {/* Date & Time */}
        <DateTime />
      </div>

      <div className="flex items-center gap-4">
        {/* Language */}
        <LangSwitcher />

        {/* Search Box */}
        <SearchForm />

        {/* add family */}
        {shouldShowFamilyDialog ? <AddFamilyDialog /> : <div className="" />}
      </div>
    </header>
  );
}
