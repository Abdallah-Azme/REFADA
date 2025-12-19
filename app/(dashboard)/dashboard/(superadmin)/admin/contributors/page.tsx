"use client";

import { Users } from "lucide-react";
import MainHeader from "@/src/shared/components/main-header";
import AdminContributorsTable from "@/features/dashboard/components/admin-contributors-table";
import AddContributorDialog from "@/src/features/contributors/components/add-contributor-dialog";
import { useTranslations } from "next-intl";

export default function AdminContributorsPage() {
  const t = useTranslations("contributors");

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <MainHeader header={t("page_title")}>
          <Users className="text-primary" />
        </MainHeader>

        <AddContributorDialog />
      </div>

      {/* Content */}
      <div className="w-full bg-white rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {t("list_title")}
        </h3>

        <AdminContributorsTable />
      </div>
    </div>
  );
}
