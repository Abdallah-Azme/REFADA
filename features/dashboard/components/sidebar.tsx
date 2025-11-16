"use client";

import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  Home,
  Users,
  FolderOpen,
  BarChart3,
  Settings,
  LogOut,
  Tent,
  Menu,
  X,
} from "lucide-react";

import Logo from "@/components/logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ImageFallback from "@/components/shared/image-fallback";
import { useDirection } from "@/hooks/use-direction";

const menuItems = [
  { label: "الرئيسية", icon: Home, href: "/dashboard" },
  { label: "بيانات المخيم", icon: Tent, href: "/dashboard/camps" },
  { label: "العائلات", icon: Users, href: "/dashboard/families" },
  { label: "المشاريع", icon: FolderOpen, href: "/dashboard/projects" },
  { label: "التقارير", icon: BarChart3, href: "/dashboard/reports" },
  { label: "الإعدادات", icon: Settings, href: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { isRTL } = useDirection();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const side = isRTL ? "right" : "left";

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className={`
          sm:hidden fixed top-4 z-100 bg-primary text-white p-2 rounded-lg shadow-lg
          ${isRTL ? "right-4" : "left-4"}
        `}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="sm:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
        />
      )}

      {/* SIDEBAR WRAPPER */}
      <div
        className={`
          fixed top-0 bottom-0 z-99 start-0 w-[220px] sm:static transform transition-transform duration-300
          ${
            open
              ? "translate-x-0"
              : isRTL
              ? "translate-x-full sm:translate-x-0"
              : "-translate-x-full sm:translate-x-0"
          }
        `}
      >
        <Sidebar
          side={side}
          collapsible="none"
          className="relative w-[220px] h-full bg-primary text-white flex flex-col border-none overflow-hidden"
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={() => setOpen(false)}
            className={`
              sm:hidden absolute top-4 z-50 bg-white/10 p-2 rounded-lg
              ${isRTL ? "left-4" : "right-4"}
            `}
          >
            <X className="w-4 h-4" />
          </button>

          {/* LOGO */}
          <div className="flex justify-center py-6 border-b border-white/10">
            <Logo className="w-[79px] h-[65px]" />
          </div>

          {/* MENU LIST */}
          <SidebarContent className="flex-1 px-3 py-6">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {menuItems.map((item, i) => {
                    // Extract segments
                    const current = pathname.split("/")[2] || "";
                    const itemSegment = item.href.split("/")[2] || "";

                    // True active state
                    const isActive = current === itemSegment;

                    return (
                      <SidebarMenuItem key={i}>
                        <Link href={item.href}>
                          <SidebarMenuButton
                            size="lg"
                            className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                        ${
                          isActive
                            ? "bg-[#D9CBA8] text-black shadow-sm"
                            : "text-white hover:bg-white/10"
                        }
                      `}
                          >
                            <item.icon
                              className={`w-4 h-4 ${
                                isActive ? "text-black" : "text-white"
                              }`}
                            />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* LOGOUT */}
          <SidebarFooter className="border-t border-white/10 py-3 px-4 mt-auto relative z-10">
            <SidebarMenuButton
              size="lg"
              className="w-full flex items-center gap-3 text-white hover:bg-white/10 rounded-xl px-4 py-3"
            >
              <LogOut className="size-4" />
              <span className="text-sm font-medium">تسجيل خروج</span>
            </SidebarMenuButton>
          </SidebarFooter>

          {/* ART */}
          <div className="absolute bottom-0 right-0 w-full h-[260px] pointer-events-none select-none z-0">
            <ImageFallback
              src="/shared/refad.webp"
              alt=""
              fill
              className="object-cover opacity-30"
            />
          </div>
        </Sidebar>
      </div>
    </>
  );
}
