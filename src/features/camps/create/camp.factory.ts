import { Camp, CampFormValues } from "../types/camp.schema";

export function createCamp(data: CampFormValues): Camp {
  return {
    id: Date.now().toString(),
    ...data,
    status: "active",
  };
}

export function createEmptyCamp(): CampFormValues {
  return {
    name: "",
    location: "",
    description: "",
    capacity: 0,
    currentOccupancy: 0,
    coordinates: { lat: 0, lng: 0 },
  };
}
