"use client";

import DashboardGuard from "@/src/features/dashboard/components/dashboard-guard";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardGuard allowedRoles={["admin"]}>{children}</DashboardGuard>;
}
