import { Representative } from "../types/representative.schema";

export const representativeService = {
  getStatusLabel(status: "active" | "inactive"): string {
    return status === "active" ? "نشط" : "غير نشط";
  },

  getStatusBadgeClass(status: "active" | "inactive"): string {
    return status === "active" ? "bg-green-500 hover:bg-green-600" : "";
  },

  toggleStatus(rep: Representative): Representative {
    return {
      ...rep,
      status: rep.status === "active" ? "inactive" : "active",
    };
  },

  isActive(rep: Representative): boolean {
    return rep.status === "active";
  },

  formatAssignedCamps(count: number): string {
    return count === 0 ? "لا يوجد" : `${count} مخيم`;
  },
};
