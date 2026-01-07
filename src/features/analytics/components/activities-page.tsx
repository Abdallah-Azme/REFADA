"use client";

import { useActivities } from "../hooks/use-activities";
import { createActivityColumns } from "./activity-columns";
import { ActivityTable } from "./activity-table";
import { Loader2, Activity as ActivityIcon } from "lucide-react";
import MainHeader from "@/shared/components/main-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { useTranslations } from "next-intl";

export default function ActivitiesPage() {
  const { data, isLoading, error, page, setPage } = useActivities();
  const t = useTranslations("activities");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-3 text-gray-600">{t("loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <p className="text-red-600 mb-2">{t("error_title")}</p>
          <p className="text-sm text-gray-500">
            {(error as any)?.message || t("unknown_error")}
          </p>
        </div>
      </div>
    );
  }

  const activities = data?.data || [];
  const columns = createActivityColumns(t);

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50/50 min-h-screen">
      <MainHeader header={t("page_title")} />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivityIcon className="h-5 w-5 text-primary" />
            {t("all_activities")}
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityTable
            columns={columns}
            data={activities}
            page={page}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
