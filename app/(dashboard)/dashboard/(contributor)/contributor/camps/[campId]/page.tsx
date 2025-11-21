import CampsMapSection from "@/components/pages/home/camps-map-section";
import CambDetailsCard from "@/features/dashboard/components/camb-details-card";
import CurrentProjectsTableContribution from "@/features/dashboard/components/current-project-table-contribution";
import MainHeader from "@/features/dashboard/components/main-header";
import { Tent } from "lucide-react";

export default function Page() {
  return (
    <main className="w-full flex flex-col  gap-6 p-8 bg-gray-50  ">
      <div className="flex items-center justify-between mb-5">
        <MainHeader header="مخيم اصداء">
          <Tent />
        </MainHeader>
      </div>

      <div className="flex flex-col lg:flex-row w-full gap-8">
        {/* Stats cards - left side */}
        <div className="w-full lg:w-1/2">
          <CambDetailsCard />
        </div>

        {/* Map - right side */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-[#333333] font-bold text-lg mb-2">الموقع </h2>
          <CampsMapSection secondary dashboard />
        </div>
      </div>
      <CurrentProjectsTableContribution />
    </main>
  );
}
