"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface CampaignCard {
  id: number
  manager: string
  percentage: number
  color: string
  stats: {
    cases: number
    projects: number
    participation: number
  }
}

const campaigns: CampaignCard[] = [
  {
    id: 1,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 2,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 3,
    manager: "مدير أعضاء",
    percentage: 25,
    color: "#ef4444",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 4,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 5,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 6,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 7,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 8,
    manager: "مدير أعضاء",
    percentage: 15,
    color: "#ef4444",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 9,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 10,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 11,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 12,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
]

function CampaignCard({ campaign }: { campaign: CampaignCard }) {
  const data = [
    { name: "completed", value: campaign.percentage },
    { name: "remaining", value: 100 - campaign.percentage },
  ]

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow" dir="rtl">
      <h3 className="text-center text-gray-600 text-sm mb-6">{campaign.manager}</h3>

      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={65}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
              >
                <Cell fill={campaign.color} />
                <Cell fill="#e5e7eb" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{campaign.percentage}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-gray-700">
          <span>عدد العاملات المسجلة</span>
          <div className="flex items-center gap-1">
            <span className="font-semibold">{campaign.stats.cases}</span>
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          </div>
        </div>
        <div className="flex items-center justify-between text-gray-700">
          <span>عدد المشاريع الحالية</span>
          <div className="flex items-center gap-1">
            <span className="font-semibold">{campaign.stats.projects}</span>
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          </div>
        </div>
        <div className="flex items-center justify-between text-gray-700">
          <span>المساهمات</span>
          <div className="flex items-center gap-1">
            <span className="font-semibold">{campaign.stats.participation}%</span>
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CampaignCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  )
}
