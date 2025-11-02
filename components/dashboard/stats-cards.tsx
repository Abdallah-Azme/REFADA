"use client"

import { Heart, Zap, CheckCircle, Users } from "lucide-react"

const stats = [
  {
    icon: Heart,
    label: "حالات درجة",
    value: "10",
    subtitle: "خلال الاسبوع",
    color: "bg-red-100",
    iconColor: "text-red-500",
  },
  {
    icon: Heart,
    label: "المساهمات",
    value: "314",
    subtitle: "مجموع المساهمات المنتهية",
    color: "bg-green-100",
    iconColor: "text-green-500",
  },
  {
    icon: Zap,
    label: "عدد المشاريع الحالية",
    value: "50",
    subtitle: "تم تشغيلها بالأسبوع 20%",
    color: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    icon: CheckCircle,
    label: "عدد المشاريع المنتهية",
    value: "1200",
    subtitle: "تم تشغيلها بالأسبوع 80%",
    color: "bg-green-100",
    iconColor: "text-green-500",
  },
  {
    icon: Users,
    label: "عدد العاملات",
    value: "1297",
    subtitle: "+ 5.2%",
    color: "bg-blue-100",
    iconColor: "text-blue-500",
  },
]

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
            <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
          </div>
          <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
          <div className="text-xs text-gray-500">{stat.subtitle}</div>
        </div>
      ))}
    </div>
  )
}
