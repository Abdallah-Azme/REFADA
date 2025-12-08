import { Metadata } from "next";
import AdminPendingUsersTable from "@/features/dashboard/components/admin-pending-users-table";

export const metadata: Metadata = {
  title: "إدارة طلبات المناديب | لوحة التحكم",
};

export default function AdminPendingUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">طلبات المناديب</h1>
      </div>
      <AdminPendingUsersTable />
    </div>
  );
}
