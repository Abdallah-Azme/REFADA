import AddProjectDialog from "@/features/dashboard/components/add-project-project";
import MainHeader from "@/features/dashboard/components/main-header";
import ProjectsTable from "@/features/dashboard/components/projects-table";
import { SquareKanban } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AdminProjectsPage() {
  const t = useTranslations("admin");
  return (
    <section className="p-4 sm:p-7 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <MainHeader header={t("projects")}>
          <SquareKanban className="text-primary" />
        </MainHeader>
        <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
          {/* <PrintingProjects /> */}
          {/* <ExportingProjects /> */}
          <AddProjectDialog />
        </div>
      </div>
      <ProjectsTable main />
    </section>
  );
}
