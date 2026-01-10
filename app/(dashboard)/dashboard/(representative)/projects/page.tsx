import AddProjectDialog from "@/features/dashboard/components/add-project-project";
import ExportingProjects from "@/features/dashboard/components/exporting-projects";
import MainHeader from "@/features/dashboard/components/main-header";
import PrintingProjects from "@/features/dashboard/components/printing-projects";
import ProjectsTable from "@/features/dashboard/components/projects-table";
import { SquareKanban } from "lucide-react";

export default function Page() {
  return (
    <section className=" p-7 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <MainHeader header="المشروع">
          <SquareKanban className="text-primary" />
        </MainHeader>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
          <PrintingProjects />
          <ExportingProjects />
          <AddProjectDialog />
        </div>
      </div>
      <ProjectsTable main hideApproveDelete />
    </section>
  );
}
