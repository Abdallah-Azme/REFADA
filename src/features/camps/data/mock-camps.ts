import { Camp } from "../types/camp.schema";

export const mockCamps: Camp[] = [
  {
    id: 1,
    name: "إيواء أصداء",
    location: "غزة - الشمال",
    description: "إيواء رئيسي يوفر المأوى والخدمات الأساسية",
    capacity: 500,
    currentOccupancy: 350,
    coordinates: { lat: 31.5, lng: 34.45 },
    status: "active",
  },
  {
    id: 2,
    name: "إيواء النور",
    location: "غزة - الجنوب",
    description: "إيواء طوارئ للعائلات النازحة",
    capacity: 300,
    currentOccupancy: 280,
    coordinates: { lat: 31.3, lng: 34.3 },
    status: "active",
  },
];
