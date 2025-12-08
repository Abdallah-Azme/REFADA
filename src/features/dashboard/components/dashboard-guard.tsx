"use client";

import { useRequireAuth } from "@/features/auth";
import { User } from "@/features/auth/types/auth.schema";
import { Loader2 } from "lucide-react";

interface DashboardGuardProps {
  children: React.ReactNode;
  allowedRoles: User["role"][];
}

export default function DashboardGuard({
  children,
  allowedRoles,
}: DashboardGuardProps) {
  const { isLoading } = useRequireAuth(allowedRoles);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#ececec]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
