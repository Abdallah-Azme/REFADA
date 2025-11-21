import CurrentProjectsTableContribution from "@/features/dashboard/components/current-project-table-contribution";
import MainHeader from "@/features/dashboard/components/main-header";
import { Tent } from "lucide-react";
import React from "react";

export default function Page() {
  return (
    <main className="w-full flex flex-col  gap-6 p-8 bg-gray-50  ">
      <div className="flex items-center justify-between mb-5">
        <MainHeader header="مخيم اصداء">
          <Tent />
        </MainHeader>
      </div>
      <CurrentProjectsTableContribution />
    </main>
  );
}
