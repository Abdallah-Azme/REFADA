"use client";

import { useQuery } from "@tanstack/react-query";
import { historyApi } from "@/src/features/dashboard/api/history.api";
import { ContributionHistoryTable } from "@/src/features/dashboard/components/contribution-history-table";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

export default function ContributorHistoryPage() {
  const t = useTranslations("contributor_history");

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contributor-history"],
    queryFn: historyApi.getContributorHistory,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96 text-red-500">
        {t("error_loading")}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t("page_title")}</h1>
          <p className="text-muted-foreground mt-1">{t("page_subtitle")}</p>
        </div>
      </div>

      <ContributionHistoryTable data={response?.data || []} />
    </div>
  );
}
