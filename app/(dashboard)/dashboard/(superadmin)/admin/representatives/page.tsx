import AdminRepresentativesTable from "@/features/dashboard/components/admin-representatives-table";

export default function AdminRepresentativesPage() {
  return (
    <section className="p-7 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">إدارة المندوبين</h1>
      </div>

      <AdminRepresentativesTable />
    </section>
  );
}
