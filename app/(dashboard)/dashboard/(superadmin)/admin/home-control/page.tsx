"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  BarChart3,
  Users,
  FolderOpen,
  Tent,
  Menu,
  FileText,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

const homeControlLinks = [
  {
    title: "الرئيسية (Hero)",
    description: "تعديل العنوان والصورة الرئيسية",
    icon: Home,
    href: "/dashboard/admin/home-control/hero",
    color: "text-blue-500",
  },
  {
    title: "الإحصائيات",
    description: "تعديل الأرقام والإحصائيات",
    icon: BarChart3,
    href: "/dashboard/admin/home-control/stats",
    color: "text-green-500",
  },
  {
    title: "من نحن",
    description: "تعديل معلومات الجمعية",
    icon: Users,
    href: "/dashboard/admin/home-control/about",
    color: "text-purple-500",
  },
  {
    title: "السياسات",
    description: "تعديل سياسات الجمعية",
    icon: FileText,
    href: "/dashboard/admin/home-control/policy",
    color: "text-orange-500",
  },
  {
    title: "الشركاء",
    description: "إدارة شركاء النجاح",
    icon: Users,
    href: "/dashboard/admin/home-control/partners",
    color: "text-indigo-500",
  },
  {
    title: "المخيمات",
    description: "إعدادات قسم المخيمات",
    icon: Tent,
    href: "/dashboard/admin/home-control/camps",
    color: "text-red-500",
  },
  {
    title: "المشاريع",
    description: "إعدادات قسم المشاريع",
    icon: FolderOpen,
    href: "/dashboard/admin/home-control/projects",
    color: "text-yellow-500",
  },
  {
    title: "آراء المستفيدين",
    description: "إدارة آراء المستفيدين",
    icon: MessageSquare,
    href: "/dashboard/admin/home-control/testimonials",
    color: "text-pink-500",
  },
  {
    title: "تواصل معنا",
    description: "تعديل معلومات الاتصال",
    icon: Menu,
    href: "/dashboard/admin/home-control/contact",
    color: "text-cyan-500",
  },
];

export default function HomeControlIndexPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          التحكم في الصفحة الرئيسية
        </h1>
        <p className="text-muted-foreground">
          قم باختيار القسم الذي تريد تعديله من القائمة أدناه.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeControlLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {link.title}
                </CardTitle>
                <link.icon className={`h-5 w-5 ${link.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {link.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
