import CampsMapSection from "@/components/pages/home/camps-map-section";
import Analytics from "@/features/dashboard/components/analytics";
import CampsData from "@/features/dashboard/components/camps-data";
import StatsCards, {
  stats4,
} from "@/features/dashboard/components/stats-cards";
import { Tent } from "lucide-react";

export default function Page() {
  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg flex gap-1 font-semibold text-gray-900">
          <Tent />
          المخيم
        </h3>
      </div>

      <CampsData />

      <div className="flex flex-col lg:flex-row w-full gap-3">
        {/* Stats cards - left side */}
        <div className="w-full lg:w-1/2">
          <StatsCards
            stats={stats4}
            secondary={true} // Add this prop to prevent default grid classes
            className="grid grid-cols-2 gap-3"
            itemClassName=""
          />
        </div>

        {/* Map - right side */}
        <div className="w-full lg:w-1/2">
          <CampsMapSection secondary />
        </div>
      </div>

      <Analytics />
    </div>
  );
}
