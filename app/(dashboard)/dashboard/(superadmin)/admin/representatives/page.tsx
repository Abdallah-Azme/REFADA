"use client";

import { UserCheck, Loader2 } from "lucide-react";
import MainHeader from "@/src/shared/components/main-header";
import AdminRepresentativesTable from "@/features/dashboard/components/admin-representatives-table";
import AddRepresentativeDialog from "@/src/features/representatives/components/add-representative-dialog";
import { useTranslations } from "next-intl";

export default function AdminRepresentativesPage() {
  const t = useTranslations("representatives");

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <MainHeader header={t("page_title")}>
          <UserCheck className="text-primary" />
        </MainHeader>

        <AddRepresentativeDialog />
      </div>

      {/* Content */}
      <div className="w-full bg-white rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {t("list_title")}
        </h3>

        <AdminRepresentativesTable />
      </div>
    </div>
  );
}
