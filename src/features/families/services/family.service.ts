import { Family } from "../types/family.schema";

export const familyService = {
  formatMembersCount(count: number): string {
    return `${count} ${count === 1 ? "فرد" : "أفراد"}`;
  },

  // Add more helpers here as needed for the new schema
  // For example, formatting the address or combining phone numbers
  formatAddress(family: Family): string {
    return `${family.location} - خيمة ${family.tentNumber} - ${family.camp}`;
  },
};
