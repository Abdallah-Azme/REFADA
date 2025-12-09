"use client";

import { useActivities } from "../hooks/use-activities";
import { activityColumns } from "./activity-columns";
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

export default function ActivitiesPage() {
  const { data, isLoading, error, page, setPage } = useActivities();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-3 text-gray-600">جاري تحميل النشاطات...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <p className="text-red-600 mb-2">حدث خطأ أثناء تحميل النشاطات</p>
          <p className="text-sm text-gray-500">
            {(error as any)?.message || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  const activities = data?.data || [];

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50/50 min-h-screen">
      <MainHeader header="سجل النشاطات" />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivityIcon className="h-5 w-5 text-primary" />
            جميع النشاطات
          </CardTitle>
          <CardDescription>
            سجل كامل بجميع الأنشطة والعمليات التي تمت في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityTable
            columns={activityColumns}
            data={activities}
            page={page}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
