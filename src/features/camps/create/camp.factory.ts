import { Camp, CampFormValues } from "../types/camp.schema";

export function createCamp(data: CampFormValues): Camp {
  return {
    id: Date.now(),
    ...data,
    status: "active",
  };
}

export function createEmptyCamp(): CampFormValues {
  return {
    name_ar: "",
    name_en: "",
    location: "",
    description_ar: "",
    description_en: "",
    capacity: 0,
    currentOccupancy: 0,
    coordinates: { lat: 0, lng: 0 },
    governorate_id: "",
    camp_img: undefined,
  };
}
