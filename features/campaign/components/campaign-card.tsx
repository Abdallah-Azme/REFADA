import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { type CampaignCard } from "./campaign-cards";

export default function CampaignCard({ campaign }: { campaign: CampaignCard }) {
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
