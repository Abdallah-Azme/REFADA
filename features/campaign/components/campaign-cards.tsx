"use client";
import CampaignCard from "@/features/campaign/components/campaign-card";

export interface CampaignCard {
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
