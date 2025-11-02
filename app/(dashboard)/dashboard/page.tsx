import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"
import StatsCards from "@/components/dashboard/stats-cards"
import Analytics from "@/components/dashboard/analytics"
import ProjectsTable from "@/components/dashboard/projects-table"

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader />

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Stats Cards */}
            <StatsCards />

            {/* Analytics and Recent Activity */}
            <Analytics />

            {/* Projects Table */}
            <ProjectsTable />
          </div>
        </div>
      </div>
    </div>
  )
}
