import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardHeader from "@/features/dashboard/components/header";
import DashboardSidebar from "@/features/dashboard/components/sidebar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden  ">
      <SidebarProvider>
        <DashboardSidebar />

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <DashboardHeader />

          {/* Scrollable content */}
          <div className="flex-1 overflow-auto">{children}</div>

          <footer className="bg-[#1B2540] flex items-center justify-center text-white py-3 font-semibold">
            جميع الحقوق محفوطظة لهمتنا غزة.....2025.
          </footer>
        </div>
      </SidebarProvider>
    </div>
  );
}
