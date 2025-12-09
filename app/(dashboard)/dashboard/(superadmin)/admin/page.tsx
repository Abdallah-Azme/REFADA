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
  TrendingUp,
  UserCheck,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { useStats } from "@/features/analytics";
import { Loader2 } from "lucide-react";

const adminLinks = [
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
    title: "الإيواءات",
    description: "إعدادات قسم الإيواءات",
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

const systemManagementLinks = [
  {
    title: "إدارة المشاريع",
    description: "قبول أو رفض المشاريع الجديدة",
    icon: FolderOpen,
    href: "/dashboard/admin/projects",
    color: "text-blue-600",
  },
  {
    title: "إدارة المندوبين",
    description: "تفعيل أو تعطيل حسابات المندوبين",
    icon: Users,
    href: "/dashboard/admin/representatives",
    color: "text-green-600",
  },
  {
    title: "إدارة المساهمين",
    description: "إدارة حسابات المساهمين وتفعيلها",
    icon: Users,
    href: "/dashboard/admin/contributors",
    color: "text-purple-600",
  },
];

export default function AdminPage() {
  const { data: statsData, isLoading: statsLoading } = useStats();
  const stats = statsData?.data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
        <p className="text-muted-foreground">
          مرحباً بك في لوحة تحكم المسؤول. يمكنك من هنا إدارة محتوى الموقع وتخصيص
          الأقسام المختلفة.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <div className="col-span-full flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المشاريع</CardTitle>
                <FolderOpen className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">
                  {stats?.projectsCount || 0}
                </div>
                <p className="text-xs text-blue-600 mt-1">إجمالي المشاريع</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">العائلات</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">
                  {stats?.familiesCount || 0}
                </div>
                <p className="text-xs text-green-600 mt-1">إجمالي العائلات</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المساهمين</CardTitle>
                <UserCheck className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-700">
                  {stats?.contributorsCount || 0}
                </div>
                <p className="text-xs text-purple-600 mt-1">إجمالي المساهمين</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المخيمات</CardTitle>
                <Building2 className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-700">
                  {stats?.CampsCount || 0}
                </div>
                <p className="text-xs text-orange-600 mt-1">إجمالي المخيمات</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">إدارة النظام</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systemManagementLinks.map((link) => (
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

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          التحكم في الرئيسية
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminLinks.map((link) => (
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
    </div>
  );
}
