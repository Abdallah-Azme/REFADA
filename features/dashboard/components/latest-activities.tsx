import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import React from "react";

export default function LatestActivities({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn("lg:col-span-1 bg-white rounded-lg px-4 py-8 ", className)}
    >
      <h3 className="text-lg font-semibold text-[#333333] mb-4">آخر الأنشطة</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
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

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
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

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
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
