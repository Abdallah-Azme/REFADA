import AdminProjectsTable from "@/features/dashboard/components/admin-projects-table";

export default function AdminProjectsPage() {
  return (
    <section className="p-7 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">إدارة المشاريع</h1>
      </div>

      <AdminProjectsTable />
    </section>
  );
}
