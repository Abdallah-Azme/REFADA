import AddProjectDialog from "@/features/dashboard/components/add-project-project";
import ExportingProjects from "@/features/dashboard/components/exporting-projects";
import MainHeader from "@/features/dashboard/components/main-header";
import PrintingProjects from "@/features/dashboard/components/printing-projects";
import ProjectsTable from "@/features/dashboard/components/projects-table";
import { Notebook, SquareDashedKanban, SquareKanban } from "lucide-react";
import React from "react";

export default function Page() {
  return (
    <section className=" p-7 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <MainHeader header="المشروع">
          <SquareKanban className="text-primary" />
        </MainHeader>
        <div className="flex items-center justify-between gap-2">
          <PrintingProjects />
          <ExportingProjects />
          <AddProjectDialog />
        </div>
      </div>
      <ProjectsTable main />
    </section>
  );
}
