import ExportingProjects from "@/features/dashboard/components/exporting-projects";
import MainHeader from "@/features/dashboard/components/main-header";
import ReportsPage from "@/features/dashboard/components/reports-page";
import SendReport from "@/features/dashboard/components/send-report";
import { Notebook } from "lucide-react";

export default function Page() {
  return (
    <section className=" p-7 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <MainHeader header="التقارير">
          <Notebook className="text-primary" />
        </MainHeader>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
          <SendReport />
          <ExportingProjects className={"px-8 py-5"} />
        </div>
      </div>
      <ReportsPage />;
    </section>
  );
}
