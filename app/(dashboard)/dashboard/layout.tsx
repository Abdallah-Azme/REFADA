import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardHeader from "@/features/dashboard/components/header";
import DashboardSidebar from "@/features/dashboard/components/sidebar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex bg-[#ececec] overflow-hidden">
      <SidebarProvider className="flex w-full h-full overflow-hidden">
        <DashboardSidebar />

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Header */}
          <DashboardHeader />

          {/* Scrollable content */}
          <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>

          <footer className="shrink-0 bg-[#1B2540] flex items-center justify-center text-white py-3 font-semibold">
            جميع الحقوق محفوطظة لهمتنا غزة.....2025.
          </footer>
        </div>
      </SidebarProvider>
    </div>
  );
}
