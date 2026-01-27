import { Camp, CampFormValues } from "../types/camp.schema";
import { createCamp, createEmptyCamp } from "../create/camp.factory";

export const campService = {
  /**
   * Creates default form values from a camp or returns empty values
   */
  createDefaultValues(camp?: Camp): CampFormValues {
    if (!camp) {
      return createEmptyCamp();
    }

    // Extract governorate_id - it could be in different formats
    let governorateId = "";
    if (camp.governorate_id) {
      governorateId = camp.governorate_id.toString();
    } else if (camp.governorate) {
      if (typeof camp.governorate === "object" && "id" in camp.governorate) {
        governorateId = camp.governorate.id.toString();
      } else if (typeof camp.governorate === "string") {
        governorateId = camp.governorate;
      }
    }

    // Extract localized name
    let nameAr = "";
    let nameEn = "";
    if (typeof camp.name === "object" && camp.name) {
      nameAr = camp.name.ar || "";
      nameEn = camp.name.en || "";
    } else if (typeof camp.name === "string") {
      nameAr = camp.name; // Fallback: use the name as Arabic
      nameEn = camp.name; // Also use as English fallback to pass validation
    }

    // Extract localized description
    let descAr = "";
    let descEn = "";
    if (typeof camp.description === "object" && camp.description) {
      descAr = camp.description.ar || "";
      descEn = camp.description.en || "";
    } else if (typeof camp.description === "string") {
      descAr = camp.description;
      descEn = "";
    }

    return {
      name_ar: nameAr,
      name_en: nameEn,
      location: camp.location || "",
      description_ar: descAr,
      description_en: descEn,
      capacity: camp.capacity || 0,
      currentOccupancy: camp.currentOccupancy || 0,
      coordinates: {
        lat: parseFloat(String(camp.latitude || 0)),
        lng: parseFloat(String(camp.longitude || 0)),
      },
      governorate_id: governorateId,
      camp_img: camp.campImg || undefined,
    };
  },

  /**
   * Normalizes form data into a Camp entity
   */
  normalizeCampData(data: CampFormValues): Camp {
    return createCamp(data);
  },

  /**
   * Calculates occupancy rate as a percentage
   */
  calculateOccupancyRate(camp: Camp): number {
    if (!camp.capacity || camp.capacity === 0) return 0;
    if (!camp.currentOccupancy) return 0;
    return Math.round((camp.currentOccupancy / camp.capacity) * 100);
  },

  /**
   * Checks if camp is over capacity
   */
  isOverCapacity(camp: Camp): boolean {
    if (!camp.capacity || !camp.currentOccupancy) return false;
    return camp.currentOccupancy > camp.capacity;
  },

  /**
   * Formats occupancy display string
   */
  formatOccupancy(camp: Camp): string {
    const percentage = this.calculateOccupancyRate(camp);
    return `${camp.currentOccupancy || 0} (${percentage}%)`;
  },

  /**
   * Gets status label in Arabic
   */
  getStatusLabel(status: "active" | "inactive"): string {
    return status === "active" ? "نشط" : "غير نشط";
  },
};
