import { Contributor, ContributorType } from "../types/contributor.schema";

export const contributorService = {
  getTypeLabel(type: ContributorType): string {
    const labels = {
      organization: "مؤسسة",
      company: "شركة",
      individual: "فرد",
    };
    return labels[type];
  },

  getStatusLabel(status: "active" | "inactive"): string {
    return status === "active" ? "نشط" : "غير نشط";
  },

  getStatusBadgeClass(status: "active" | "inactive"): string {
    return status === "active" ? "bg-green-500 hover:bg-green-600" : "";
  },

  toggleStatus(contributor: Contributor): Contributor {
    return {
      ...contributor,
      status: contributor.status === "active" ? "inactive" : "active",
    };
  },

  isActive(contributor: Contributor): boolean {
    return contributor.status === "active";
  },
};
