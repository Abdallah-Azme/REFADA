import { AnalyticsStats } from "../types/analytics.types";

export const analyticsService = {
  formatCurrency(amount: number): string {
    return `${amount.toLocaleString("ar-SA")} ر.س`;
  },

  formatNumber(num: number): string {
    return num.toLocaleString("ar-SA");
  },

  calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  },

  formatPercentage(value: number): string {
    return `${value}%`;
  },

  getStatLabel(key: keyof AnalyticsStats): string {
    const labels: Record<keyof AnalyticsStats, string> = {
      totalCamps: "إجمالي المخيمات",
      totalProjects: "إجمالي المشاريع",
      totalContributors: "إجمالي المساهمين",
      totalFamilies: "إجمالي العائلات",
      totalBudget: "إجمالي الميزانية",
      activeRepresentatives: "المندوبين النشطين",
    };
    return labels[key];
  },
};
