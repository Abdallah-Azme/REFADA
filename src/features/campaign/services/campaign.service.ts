import { Campaign, CampaignStatus } from "../types/campaign.schema";

export const campaignService = {
  calculateProgress(current: number, target: number): number {
    if (target === 0) return 0;
    return Math.round((current / target) * 100);
  },

  formatAmount(amount: number): string {
    return `${amount.toLocaleString("ar-SA")} ر.س`;
  },

  getStatusLabel(status: CampaignStatus): string {
    const labels = {
      [CampaignStatus.Active]: "نشطة",
      [CampaignStatus.Completed]: "مكتملة",
      [CampaignStatus.Cancelled]: "ملغاة",
    };
    return labels[status];
  },

  getStatusBadgeClass(status: CampaignStatus): string {
    const classes = {
      [CampaignStatus.Active]: "bg-green-500",
      [CampaignStatus.Completed]: "bg-blue-500",
      [CampaignStatus.Cancelled]: "bg-gray-500",
    };
    return classes[status];
  },

  isActive(campaign: Campaign): boolean {
    return campaign.status === CampaignStatus.Active;
  },

  getRemainingDays(endDate: string): number {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  },

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  },
};
