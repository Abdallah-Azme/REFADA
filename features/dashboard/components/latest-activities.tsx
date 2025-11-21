import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import React from "react";
import CardTitle from "./card-title";

export default function LatestActivities({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("lg:col-span-1", className)}>
      <CardTitle title="آخر الأنشطة" />

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg  border border-[#E4E4E4]">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✓</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                تم إضافة مشروع 20 عائلة لـ (3 عائلات)
              </p>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg  border border-[#E4E4E4]">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">⊙</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                تحديث بيانات عائلة المحمدي وعائلة سالم
              </p>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg  border border-[#E4E4E4]">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-sm">!</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                إرسال تقرير جديد للمؤسسة بموهام الأسبوع السابق
              </p>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
