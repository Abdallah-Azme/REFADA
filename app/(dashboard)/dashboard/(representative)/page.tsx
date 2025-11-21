import Analytics from "@/features/dashboard/components/analytics";
import ProjectsTable from "@/features/dashboard/components/projects-table";
import StatsCards, { stats } from "@/features/dashboard/components/stats-cards";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <StatsCards stats={stats} />
      <Analytics />
      <ProjectsTable />
    </div>
  );
}
