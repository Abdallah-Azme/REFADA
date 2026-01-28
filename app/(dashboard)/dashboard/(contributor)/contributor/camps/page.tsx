"use client";

import CampProjects from "@/features/campaign/components/camp-projects";
import { useCamps } from "@/features/camps/hooks/use-camps";
import { Loader2 } from "lucide-react";

export default function Page() {
  const { data: campsData, isLoading, isError } = useCamps();
  console.log({ campsData });
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 relative">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mr-3 text-gray-600">جاري تحميل الإيواءات...</span>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="container mx-auto px-4 relative">
        <div className="text-center py-20">
          <p className="text-red-500">حدث خطأ أثناء تحميل البيانات</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 relative">
      <CampProjects camps={campsData?.data || []} dashboard />
    </section>
  );
}
