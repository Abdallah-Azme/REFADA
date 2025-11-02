"use client"

import { ChevronLeft } from "lucide-react"

export default function Analytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Analytics Chart */}
      <div className="lg:col-span-1 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">الإحصائيات</h3>

        {/* Circular Progress */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#22c55e"
                strokeWidth="8"
                strokeDasharray={`${(75 / 100) * 339.29} 339.29`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">75%</span>
            </div>
          </div>
        </div>

        {/* Stats List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">عدد العاملات المسجلة</span>
            <span className="font-semibold text-gray-900">320</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">عدد المشاريع الحالية</span>
            <span className="font-semibold text-gray-900">14</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">المساهمات</span>
            <span className="font-semibold text-gray-900">75%</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">آخر الأنشطة</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">تم إضافة مشروع 20 عائلة لـ (3 عائلات)</p>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">⊙</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">تحديث بيانات عائلة المحمدي وعائلة سالم</p>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm">!</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">إرسال تقرير جديد للمؤسسة بموهام الأسبوع السابق</p>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
