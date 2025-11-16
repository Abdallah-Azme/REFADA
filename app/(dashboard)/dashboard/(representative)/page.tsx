import Analytics from "@/features/dashboard/components/analytics";
import ProjectsTable from "@/features/dashboard/components/projects-table";
import StatsCards, { stats } from "@/features/dashboard/components/stats-cards";

export default function DashboardPage() {
  return (
    <div className="flex-1 overflow-auto ">
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Analytics and Recent Activity */}
        <Analytics />

        {/* Projects Table */}
        <ProjectsTable />
      </div>
    </div>
  );
}
