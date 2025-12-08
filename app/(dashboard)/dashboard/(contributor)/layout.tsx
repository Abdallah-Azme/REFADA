"use client";

import DashboardGuard from "@/src/features/dashboard/components/dashboard-guard";

export default function ContributorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard allowedRoles={["contributor"]}>{children}</DashboardGuard>
  );
}
