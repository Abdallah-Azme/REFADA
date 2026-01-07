"use client";

import { Metadata } from "next";
import AdminPendingUsersTable from "@/features/dashboard/components/admin-pending-users-table";
import { useTranslations } from "next-intl";

export default function AdminPendingUsersPage() {
  const t = useTranslations("sidebar.entity_management");

  return (
    <section className=" p-7 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {t("pending_users")}
        </h1>
      </div>
      <AdminPendingUsersTable />
    </section>
  );
}
