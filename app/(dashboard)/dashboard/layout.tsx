import { SidebarProvider } from "@/shared/ui/sidebar";
import DashboardHeader from "@/src/features/dashboard/components/header";
import DashboardSidebar from "@/src/features/dashboard/components/sidebar";
import DashboardGuard from "@/src/features/dashboard/components/dashboard-guard";
import React from "react";
import { useTranslations } from "next-intl";

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin");
  return (
    <DashboardGuard allowedRoles={["admin", "delegate", "contributor"]}>
      <div className="fixed inset-0 flex bg-[#ececec] overflow-hidden">
        <SidebarProvider className="flex w-full h-full overflow-hidden">
          <DashboardSidebar />

          {/* RIGHT SIDE */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Header */}
            <DashboardHeader />

            {/* Scrollable content */}
            <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>

            <footer className="shrink-0 bg-[#1B2540] flex flex-col md:flex-row items-center justify-center gap-2 text-white py-4 px-4 font-semibold text-sm text-center">
              <span>{t("footer_rights")}</span>
              <span className="hidden md:inline">—</span>
              <div className="flex items-center gap-1 justify-center">
                <span>{t("developed_by")}</span>
                <a
                  href="https://www.subcodeco.com/ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline mr-1"
                >
                  SubCode
                </a>
              </div>
            </footer>
          </div>
        </SidebarProvider>
      </div>
    </DashboardGuard>
  );
}
