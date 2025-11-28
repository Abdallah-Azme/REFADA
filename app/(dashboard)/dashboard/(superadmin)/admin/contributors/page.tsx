import AdminContributorsTable from "@/features/dashboard/components/admin-contributors-table";
import { Button } from "@/components/ui/button";

export default function AdminContributorsPage() {
  return (
    <section className="p-7 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">إدارة المساهمين</h1>
        <Button>إضافة مساهم جديد</Button>
      </div>

      <AdminContributorsTable />
    </section>
  );
}
