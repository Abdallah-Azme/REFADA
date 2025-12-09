import { Metadata } from "next";
import AdminPendingUsersTable from "@/features/dashboard/components/admin-pending-users-table";

export const metadata: Metadata = {
  title: "إدارة طلبات المناديب | لوحة التحكم",
};

export default function AdminPendingUsersPage() {
  return (
    <section className=" p-7 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">طلبات المناديب</h1>
      </div>
      <AdminPendingUsersTable />
    </section>
  );
}
