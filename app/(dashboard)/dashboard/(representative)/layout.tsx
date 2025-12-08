"use client";

import DashboardGuard from "@/src/features/dashboard/components/dashboard-guard";

export default function RepresentativeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard allowedRoles={["delegate"]}>{children}</DashboardGuard>
  );
}
