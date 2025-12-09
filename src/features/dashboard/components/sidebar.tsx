"use client";

import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/shared/ui/sidebar";

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
  ChevronDown,
  UserCog,
  HeartHandshake,
  Mail,
  Landmark,
  Activity,
  Users2,
  MessageSquareWarning,
  FileText,
} from "lucide-react";
import { usePathname } from "next/navigation";

import Logo from "@/components/logo";
import Link from "next/link";
import ImageFallback from "@/components/shared/image-fallback";
import { useDirection } from "@/hooks/use-direction";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { isRTL } = useDirection();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  // REPRESENTATIVE MENU (default dashboard menu)
  const representativeMenu = [
    { label: "الرئيسية", icon: Home, href: "/dashboard" },
    { label: "بيانات الإيواء", icon: Tent, href: "/dashboard/camps" },
    { label: "العائلات", icon: Users, href: "/dashboard/families" },
    { label: "المشاريع", icon: FolderOpen, href: "/dashboard/projects" },
    { label: "التقارير", icon: BarChart3, href: "/dashboard/reports" },
    { label: "الإعدادات", icon: Settings, href: "/dashboard/settings" },
  ];

  // CONTRIBUTOR MENU
  const contributorMenu = [
    { label: "معلومات المساهم", icon: Users, href: "/dashboard/contributor" },
    { label: "الإيواءات", icon: Tent, href: "/dashboard/contributor/camps" },
    {
      label: "الإعدادات",
      icon: Settings,
      href: "/dashboard/contributor/settings",
    },
  ];

  // ADMIN MAIN MENU
  const adminMenu = [
    { label: "الرئيسية", icon: Home, href: "/dashboard/admin" },
    { label: "الإيواءات", icon: Tent, href: "/dashboard/admin/camps" },
    { label: "الرسائل", icon: Mail, href: "/dashboard/admin/messages" },
    {
      label: "الشكاوى والاقتراحات",
      icon: MessageSquareWarning,
      href: "/dashboard/admin/complaints",
    },
    { label: "الإعدادات", icon: Settings, href: "/dashboard/admin/settings" },
  ];

  // ENTITY MANAGEMENT MENU (Admin only)
  const entityManagementMenu = [
    {
      label: "إدارة المشاريع",
      icon: FolderOpen,
      href: "/dashboard/admin/projects",
    },
    {
      label: "إدارة المندوبين",
      icon: UserCog,
      href: "/dashboard/admin/representatives",
    },
    {
      label: "المستخدمين المعلقين",
      icon: Users,
      href: "/dashboard/admin/pending-users",
    },
    {
      label: "إدارة المساهمين",
      icon: HeartHandshake,
      href: "/dashboard/admin/contributors",
    },
    {
      label: "إدارة المحافظات",
      icon: Landmark,
      href: "/dashboard/admin/governorates",
    },
    {
      label: "الحالات الاجتماعية",
      icon: HeartHandshake,
      href: "/dashboard/admin/marital-status",
    },
    {
      label: "الحالات الطبية",
      icon: Activity,
      href: "/dashboard/admin/medical-condition",
    },
    {
      label: "العلاقات",
      icon: Users2,
      href: "/dashboard/admin/relationship",
    },
  ];

  // HOME PAGE CONTROL MENU (Admin only)
  const homeControlMenu = [
    {
      label: "الرئيسية (Hero)",
      icon: Home,
      href: "/dashboard/admin/home-control/hero",
    },
    {
      label: "الإحصائيات",
      icon: BarChart3,
      href: "/dashboard/admin/home-control/stats",
    },
    {
      label: "من نحن",
      icon: Users,
      href: "/dashboard/admin/home-control/about",
    },
    {
      label: "السياسات",
      icon: FolderOpen,
      href: "/dashboard/admin/home-control/policy",
    },
    {
      label: "الشركاء",
      icon: Users,
      href: "/dashboard/admin/home-control/partners",
    },
    {
      label: "الإيواءات",
      icon: Tent,
      href: "/dashboard/admin/home-control/camps",
    },
    {
      label: "المشاريع",
      icon: FolderOpen,
      href: "/dashboard/admin/home-control/projects",
    },
    {
      label: "آراء المستفيدين",
      icon: Users,
      href: "/dashboard/admin/home-control/testimonials",
    },
    {
      label: "الصفحات",
      icon: FileText,
      // href is optional for parents
      href: "#",
      children: [
        {
          label: "شروط الاستخدام",
          href: "/dashboard/admin/home-control/pages/terms",
        },
        {
          label: "سياسة الخصوصية",
          href: "/dashboard/admin/home-control/pages/privacy",
        },
        {
          label: "الشفافية",
          href: "/dashboard/admin/home-control/pages/transparency",
        },
        {
          label: "رسالتنا",
          href: "/dashboard/admin/home-control/pages/mission",
        },
        { label: "رؤيتنا", href: "/dashboard/admin/home-control/pages/vision" },
        { label: "أهدافنا", href: "/dashboard/admin/home-control/pages/goals" },
      ],
    },
    {
      label: "تواصل معنا",
      icon: Menu,
      href: "/dashboard/admin/home-control/contact",
    },
    {
      label: "إعدادات الموقع",
      icon: Settings,
      href: "/dashboard/admin/home-control/website-settings",
    },
  ];

  // DETECT USER ROLE FROM URL PATH
  const isAdmin = pathname.includes("/dashboard/admin");
  const isContributor = pathname.includes("/dashboard/contributor");
  const isRepresentative = !isAdmin && !isContributor;

  // SELECT THE CORRECT MAIN MENU BASED ON ROLE
  let mainMenu = representativeMenu;
  if (isAdmin) {
    mainMenu = adminMenu;
  } else if (isContributor) {
    mainMenu = contributorMenu;
  }

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
          <SidebarContent className="flex-1 px-3 py-6 custom-scrollbar gap-4">
            {/* MAIN MENU GROUP */}
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center justify-between text-white/70 mb-2 px-2 hover:text-white transition-colors">
                    {isAdmin ? "لوحة الإدارة" : "لوحة التحكم"}
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      {mainMenu.map((item, i) => {
                        const isActive =
                          pathname === item.href ||
                          (item.href !== "/dashboard" &&
                            item.href !== "/dashboard/admin" &&
                            item.href !== "/dashboard/contributor" &&
                            pathname.startsWith(item.href));

                        return (
                          <SidebarMenuItem key={i}>
                            <Link href={item.href}>
                              <SidebarMenuButton
                                size="default"
                                className={`
                                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
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
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>

            {/* ENTITY MANAGEMENT GROUP - Admin Only */}
            {isAdmin && (
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center justify-between text-white/70 mb-2 px-2 hover:text-white transition-colors">
                      إدارة النظام
                      <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu className="space-y-1">
                        {entityManagementMenu.map((item, i) => {
                          const isActive = pathname === item.href;

                          return (
                            <SidebarMenuItem key={i}>
                              <Link href={item.href}>
                                <SidebarMenuButton
                                  size="default"
                                  className={`
                                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
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
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            )}

            {/* HOME CONTROL GROUP - Admin Only */}
            {isAdmin && (
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center justify-between text-white/70 mb-2 px-2 hover:text-white transition-colors">
                      التحكم في الرئيسية
                      <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu className="space-y-1">
                        {homeControlMenu.map((item, i) => {
                          // Check if it has children
                          if ((item as any).children) {
                            const children = (item as any).children;
                            const isChildActive = children.some(
                              (child: any) => pathname === child.href
                            );

                            return (
                              <Collapsible
                                key={i}
                                defaultOpen={isChildActive}
                                className="group/sub"
                              >
                                <SidebarMenuItem>
                                  <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                      size="default"
                                      className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-all"
                                    >
                                      <div className="flex items-center gap-3">
                                        <item.icon className="w-4 h-4 text-white" />
                                        <span>{item.label}</span>
                                      </div>
                                      <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/sub:rotate-180 text-white/70" />
                                    </SidebarMenuButton>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <div className="flex flex-col space-y-1 mt-1 pr-4 border-r border-white/10 mr-2">
                                      {children.map(
                                        (child: any, idx: number) => {
                                          const isItemActive =
                                            pathname === child.href;
                                          return (
                                            <Link key={idx} href={child.href}>
                                              <div
                                                className={`
                                                                text-sm font-medium py-2 px-3 rounded-lg transition-colors
                                                                ${
                                                                  isItemActive
                                                                    ? "text-[#D9CBA8] bg-white/5"
                                                                    : "text-white/70 hover:text-white hover:bg-white/5"
                                                                }
                                                            `}
                                              >
                                                {child.label}
                                              </div>
                                            </Link>
                                          );
                                        }
                                      )}
                                    </div>
                                  </CollapsibleContent>
                                </SidebarMenuItem>
                              </Collapsible>
                            );
                          }

                          const isActive = pathname === item.href;
                          return (
                            <SidebarMenuItem key={i}>
                              <Link href={item.href}>
                                <SidebarMenuButton
                                  size="default"
                                  className={`
                                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
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
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            )}
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
