"use client"

import { Trash2, Edit, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const projects = [
  {
    name: "مشروع 1200 عائلة لـن",
    status: "قيد التنفيذ",
    statusColor: "bg-orange-100 text-orange-700",
    total: 1200,
    contributions: "عائلة المحمدي",
    completed: true,
  },
  {
    name: "مشروع 50 خيمة",
    status: "تم التسليم",
    statusColor: "bg-green-100 text-green-700",
    total: 50,
    contributions: "تم التسليم",
    completed: true,
  },
  {
    name: "مشروع 130 عائلة لـن",
    status: "تم التسليم",
    statusColor: "bg-green-100 text-green-700",
    total: 130,
    contributions: "تم التسليم",
    completed: true,
  },
  {
    name: "مشروع 30 دقيق",
    status: "قيد التنفيذ",
    statusColor: "bg-orange-100 text-orange-700",
    total: 30,
    contributions: "قيد التنفيذ",
    completed: true,
  },
]

export default function ProjectsTable() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">المشاريع الحالية</h3>
          <Button className="bg-slate-900 hover:bg-slate-800 gap-2">
            <span>إضافة مشروع</span>
            <span>⊕</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="فحص البحث"
              className="w-full pr-10 pl-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">✕</button>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Search className="w-4 h-4" />
            <span>بحث</span>
          </Button>

          <div className="flex items-center gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none">
              <option>المشروع</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 -ml-8" />
          </div>

          <div className="flex items-center gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none">
              <option>حالة المشروع</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 -ml-8" />
          </div>

          <div className="flex items-center gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none">
              <option>الحالة</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 -ml-8" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">المشروع</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الحالة</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الإجمالي</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">المساهمات</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">تم الانتهاء</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">حذف</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">تعديل</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{project.name}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.statusColor}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{project.total}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{project.contributions}</td>
                <td className="px-6 py-4 text-sm">
                  {project.completed && <input type="checkbox" checked className="w-4 h-4 rounded" />}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-blue-500 hover:text-blue-700">
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
