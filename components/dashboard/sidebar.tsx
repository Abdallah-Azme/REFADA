"use client"

import { Home, Users, MessageSquare, FolderOpen, BarChart3, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
  { icon: Home, label: "الرئيسية", href: "#" },
  { icon: Users, label: "بيانات المحتم", href: "#" },
  { icon: MessageSquare, label: "الملاحظات", href: "#" },
  { icon: FolderOpen, label: "المشاريع", href: "#" },
  { icon: BarChart3, label: "التقارير", href: "#" },
  { icon: Settings, label: "الإعدادات", href: "#" },
]

export default function DashboardSidebar() {
  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="text-2xl font-bold">هضنا غرب</div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              index === 0 ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-slate-700"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل خروج</span>
        </Button>
      </div>
    </aside>
  )
}
