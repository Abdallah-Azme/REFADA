import CampaignCard from "@/features/campaign/components/campaign-card";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export default function AnalyticsChart() {
  const campaign = {
    id: 1,
    manager: "مدير أعضاء",
    percentage: 75,
    color: "#10b981",
    stats: { cases: 320, projects: 14, participation: 75 },
  };
  const data = [
    { name: "completed", value: campaign.percentage },
    { name: "remaining", value: 100 - campaign.percentage },
  ];
  return (
    <div className="lg:col-span-1 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">الإحصائيات</h3>
      <div className="bg-white rounded-lg shadow border border-gray-100 p-4 flex flex-col">
        <h3 className="text-center text-gray-600 text-sm mb-3">
          {campaign.manager}
        </h3>

        <div className="flex items-center justify-evenly gap-4">
          {/* Stats Section */}
          <div className="space-y-2 text-sm text-gray-700">
            <ul className="list-disc pl-5 marker:text-[#0682E6] space-y-2">
              <li className="list-item flex items-center justify-between">
                <span>عدد العائلات المسجلة</span>
                <span className="font-semibold">{campaign.stats.cases}</span>
              </li>

              <li className="list-item flex items-center justify-between">
                <span>عدد المشاريع الحالية</span>
                <span className="font-semibold">{campaign.stats.projects}</span>
              </li>

              <li className="list-item flex items-center justify-between">
                <span>المساهمات</span>
                <span className="font-semibold">
                  {campaign.stats.participation}%
                </span>
              </li>
            </ul>
          </div>
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
                  <Cell fill={"#27AE60"} />
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
        </div>
      </div>
    </div>
  );
}
