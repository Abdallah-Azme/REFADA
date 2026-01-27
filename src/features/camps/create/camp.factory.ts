import { Camp, CampFormValues } from "../types/camp.schema";

export function createCamp(data: CampFormValues): Camp {
  return {
    id: Date.now(),
    name: { ar: data.name_ar, en: data.name_en },
    description: { ar: data.description_ar, en: data.description_en },
    location: data.location,
    capacity: data.capacity,
    currentOccupancy: data.currentOccupancy,
    coordinates: data.coordinates,
    governorate_id: data.governorate_id,
    campImg: typeof data.camp_img === "string" ? data.camp_img : undefined,
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
