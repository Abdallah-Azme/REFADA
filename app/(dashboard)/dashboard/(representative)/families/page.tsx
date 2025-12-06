import AddFamilyDialog from "@/features/dashboard/components/add-family-dialog";
import ExportingProjects from "@/features/dashboard/components/exporting-projects";
import MainHeader from "@/features/dashboard/components/main-header";
import PrintingProjects from "@/features/dashboard/components/printing-projects";
import FamilyTable from "@/features/dashboard/components/family-table";
import { Users } from "lucide-react";
import React from "react";

export default function Page() {
  return (
    <section className=" p-7 flex flex-col gap-4">
      <div className="flex  items-center justify-between">
        <MainHeader header="العائلات">
          <Users className="text-primary" />
        </MainHeader>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <PrintingProjects />
          <ExportingProjects />
          <AddFamilyDialog />
        </div>
      </div>
      <FamilyTable />
    </section>
  );
}
