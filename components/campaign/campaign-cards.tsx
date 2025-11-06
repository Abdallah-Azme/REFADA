"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import React, { Fragment } from "react";

interface CampaignCard {
  id: number;
  manager: string;
  percentage: number;
  color: string;
  stats: {
    cases: number;
    projects: number;
    participation: number;
  };
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
    percentage: 15,
    color: "#ef4444",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 3,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
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
    id: 1,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 2,
    manager: "مدير أعضاء",
    percentage: 15,
    color: "#ef4444",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 3,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
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
    id: 1,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 2,
    manager: "مدير أعضاء",
    percentage: 15,
    color: "#ef4444",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 3,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
  {
    id: 4,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
    stats: { cases: 320, projects: 14, participation: 75 },
  },
];

function CampaignCard({ campaign }: { campaign: CampaignCard }) {
  const data = [
    { name: "completed", value: campaign.percentage },
    { name: "remaining", value: 100 - campaign.percentage },
  ];

  return (
    <div
      className="bg-white rounded-lg shadow border border-gray-100 p-4 flex flex-col"
      dir="rtl"
    >
      <h3 className="text-center text-gray-600 text-sm mb-3">
        {campaign.manager}
      </h3>

      <div className="flex items-center justify-center gap-4">
        {/* Circle Chart */}
        <div className="relative w-24 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={45}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                dataKey="value"
              >
                <Cell fill={campaign.color} />
                <Cell fill="#e5e7eb" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-700">
              {campaign.percentage}%
            </span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <span>عدد العائلات المسجلة</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold">{campaign.stats.cases}</span>
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>عدد المشاريع الحالية</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold">{campaign.stats.projects}</span>
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>المساهمات</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold">
                {campaign.stats.participation}%
              </span>
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CampaignCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6   gap-4">
      {campaigns.map((campaign, index) => (
        <div key={index}>
          <h4 className="my-2">مخيم أصداء</h4>
          <CampaignCard campaign={campaign} />
        </div>
      ))}
    </div>
  );
}
