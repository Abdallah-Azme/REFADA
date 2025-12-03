import CampaignCard from "@/features/campaign/components/campaign-card";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import CardTitle from "./card-title";

export default function AnalyticsChart({ title = "المشاريع الحالية" }: { title?: string }) {
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
    <div className="lg:col-span-1 h-full rounded-lg  ">
      <CardTitle title={title} className="mb-2" />
      <div className="bg-white rounded-lg border border-gray-100 p-4 flex flex-col">

        <div className="flex items-center justify-evenly gap-4">
          {/* Stats Section */}
          <div className="space-y-2 text-sm text-gray-700">
            <ul className="list-disc marker:text-[#0682E6] text-[#4F4F4F] font-semibold text-sm space-y-2 min-w-40">
              <li className=" w-full flex items-center justify-between">
                <span>عدد العائلات المسجلة</span>
                <span className="font-semibold">{campaign.stats.cases}</span>
              </li>

              <li className=" flex items-center justify-between">
                <span>عدد المشاريع الحالية</span>
                <span className="font-semibold">{campaign.stats.projects}</span>
              </li>

              <li className=" flex items-center  justify-between">
                <span>المساهمات</span>
                <span className="font-semibold">
                  {campaign.stats.participation}%
                </span>
              </li>
            </ul>
          </div>
          {/* Circle Chart */}
          <div className="relative w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={70}
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
