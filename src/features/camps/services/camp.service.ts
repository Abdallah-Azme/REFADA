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

    return {
      name_ar: camp.name, // Mapping existing name to AR
      name_en: "", // No EN name in current Camp interface
      location: camp.location || "",
      description_ar: camp.description || "",
      description_en: "",
      capacity: camp.capacity || 0,
      currentOccupancy: camp.currentOccupancy || 0,
      coordinates: camp.coordinates || { lat: 0, lng: 0 },
      governorate_id: camp.governorate?.id?.toString() || "",
      camp_img: undefined, // Files can't be pre-filled
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
    if (camp.capacity === 0) return 0;
    return Math.round((camp.currentOccupancy / camp.capacity) * 100);
  },

  /**
   * Checks if camp is over capacity
   */
  isOverCapacity(camp: Camp): boolean {
    return camp.currentOccupancy > camp.capacity;
  },

  /**
   * Formats occupancy display string
   */
  formatOccupancy(camp: Camp): string {
    const percentage = this.calculateOccupancyRate(camp);
    return `${camp.currentOccupancy} (${percentage}%)`;
  },

  /**
   * Gets status label in Arabic
   */
  getStatusLabel(status: "active" | "inactive"): string {
    return status === "active" ? "نشط" : "غير نشط";
  },
};
