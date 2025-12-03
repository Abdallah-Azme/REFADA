import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { type CampaignCard } from "./campaign-cards";

export default function CampaignCard({ campaign }: { campaign: CampaignCard }) {
  const data = [
    { name: "completed", value: campaign.percentage },
    { name: "remaining", value: 100 - campaign.percentage },
  ];

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 p-4 flex flex-col">
      {/* <h3 className="text-center text-gray-600 text-sm mb-3">
        {campaign.manager}
      </h3> */}

      <div className="flex items-center justify-center gap-4">
        {/* Stats Section */}
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2 justify-between">
            <span className="size-2 rounded-full bg-[#C8BA90]"></span>
            <span>عدد العائلات المسجلة</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{campaign.stats.cases}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#C8BA90]"></span>
            <span>عدد المشاريع الحالية</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{campaign.stats.projects}</span>
            </div>
          </div>
          <div className="flex items-center gap-2  ">
            <span className="size-2 rounded-full bg-[#C8BA90]"></span>
            <span>المساهمات</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {campaign.stats.participation}%
              </span>
            </div>
          </div>
        </div>
        {/* Circle Chart */}
        <div className="relative size-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={65}
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
      </div>
    </div>
  );
}
