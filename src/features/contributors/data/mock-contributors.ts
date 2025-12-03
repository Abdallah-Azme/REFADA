import { Contributor } from "../types/contributor.schema";

export const mockContributors: Contributor[] = [
  {
    id: 1,
    name: "مؤسسة الخير",
    type: "organization",
    email: "info@alkhair.org",
    phone: "0112345678",
    totalContributions: "500,000 ر.س",
    status: "active",
  },
  {
    id: 2,
    name: "محمد عبدالله",
    type: "individual",
    email: "mohammed@example.com",
    phone: "0551234567",
    totalContributions: "5,000 ر.س",
    status: "active",
  },
  {
    id: 3,
    name: "شركة العطاء",
    type: "company",
    email: "contact@alataa.com",
    phone: "0123456789",
    totalContributions: "100,000 ر.س",
    status: "inactive",
  },
  {
    id: 4,
    name: "جمعية البر",
    type: "organization",
    email: "info@albirr.org",
    phone: "0112223344",
    totalContributions: "250,000 ر.س",
    status: "active",
  },
  {
    id: 5,
    name: "أحمد سالم",
    type: "individual",
    email: "ahmed.salem@example.com",
    phone: "0509998877",
    totalContributions: "15,000 ر.س",
    status: "active",
  },
];
