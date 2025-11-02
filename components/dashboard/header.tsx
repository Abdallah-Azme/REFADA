"use client"

import { Bell, User, Globe, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2 border-gray-300 bg-transparent">
            <span>إضافة عائلة</span>
            <span className="text-lg">⊕</span>
          </Button>
          <div className="relative hidden md:block">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="بحث..."
              className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>EN</span>
            <Globe className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-gray-600">متصل</span>
          </div>

          <div className="text-sm text-gray-600">
            <div>pm 12:00</div>
            <div>19/10/2025</div>
          </div>

          <Bell className="w-5 h-5 text-gray-600 cursor-pointer relative">
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              1
            </span>
          </Bell>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">أحمد محمد عبد الله</div>
            </div>
            <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">هضنا غرب</div>
          </div>
        </div>
      </div>
    </header>
  )
}
