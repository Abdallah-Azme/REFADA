import { Family, NeedsAssessment } from "../types/family.schema";

export const familyService = {
  getStatusLabel(status: "active" | "inactive"): string {
    return status === "active" ? "نشط" : "غير نشط";
  },

  getNeedsAssessmentLabel(level: NeedsAssessment): string {
    const labels = {
      [NeedsAssessment.Urgent]: "عاجل",
      [NeedsAssessment.High]: "عالي",
      [NeedsAssessment.Medium]: "متوسط",
      [NeedsAssessment.Low]: "منخفض",
    };
    return labels[level];
  },

  getNeedsAssessmentColor(level: NeedsAssessment): string {
    const colors = {
      [NeedsAssessment.Urgent]: "bg-red-500",
      [NeedsAssessment.High]: "bg-orange-500",
      [NeedsAssessment.Medium]: "bg-yellow-500",
      [NeedsAssessment.Low]: "bg-green-500",
    };
    return colors[level];
  },

  isActive(family: Family): boolean {
    return family.status === "active";
  },

  toggleStatus(family: Family): Family {
    return {
      ...family,
      status: family.status === "active" ? "inactive" : "active",
    };
  },

  formatMembersCount(count: number): string {
    return `${count} ${count === 1 ? "فرد" : "أفراد"}`;
  },
};
