import CampsMapSection from "@/components/pages/home/camps-map-section";
import Analytics from "@/features/dashboard/components/analytics";
import CampsData from "@/features/dashboard/components/camps-data";
import MainHeader from "@/features/dashboard/components/main-header";
import StatsCards, {
  stats4,
} from "@/features/dashboard/components/stats-cards";
import { Tent } from "lucide-react";

export default function Page() {
  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      <MainHeader header="مخيم أصداء">
        <Tent className="text-primary" />
      </MainHeader>

      <CampsData />

      <div className="flex flex-col lg:flex-row w-full gap-8">
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
          <h2 className="text-[#333333] font-bold text-lg mb-2">الموقع </h2>
          <CampsMapSection secondary dashboard />
        </div>
      </div>

      <Analytics />
    </div>
  );
}
