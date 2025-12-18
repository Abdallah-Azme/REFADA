import { HeroFormValues, HomePageData, HeroSlide } from "../types/hero.schema";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type HeroResponse = {
  success: boolean;
  message: string;
  data: HomePageData;
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": "ar",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw { ...data, status: response.status };
  }

  return data as T;
}

export const heroApi = {
  get: async (): Promise<HeroResponse> => {
    return apiRequest<HeroResponse>("/homepage");
  },

  create: async (data: HeroFormValues): Promise<HeroResponse> => {
    const formData = new FormData();

    // The create endpoint expects flat keys
    formData.append("hero_title[ar]", data.hero_title_ar);
    formData.append("hero_title[en]", data.hero_title_en);
    formData.append("hero_description[ar]", data.hero_description_ar);
    formData.append("hero_description[en]", data.hero_description_en);

    if (data.hero_subtitle_ar) {
      formData.append("hero_subtitle[ar]", data.hero_subtitle_ar);
    }
    if (data.hero_subtitle_en) {
      formData.append("hero_subtitle[en]", data.hero_subtitle_en);
    }

    if (data.hero_image instanceof File) {
      formData.append("hero_image", data.hero_image);
    }
    if (data.small_hero_image instanceof File) {
      formData.append("small_hero_image", data.small_hero_image);
    }

    return apiRequest<HeroResponse>("/homepage/slides", {
      method: "POST",
      body: formData,
    });
  },

  update: async ({
    formValues,
    allSlides,
  }: {
    formValues: HeroFormValues;
    allSlides: HeroSlide[];
    isNew?: boolean; // Kept for interface compatibility but not used
  }): Promise<HeroResponse> => {
    const formData = new FormData();

    // Clone slides to avoid mutating the original array
    // We only send existing slides for update
    const slidesPayload = [...allSlides];

    // Find exisiting slide index
    const targetIndex = slidesPayload.findIndex((s) => s.id === formValues.id);

    if (targetIndex === -1) {
      throw new Error("Slide not found for update");
    }

    // Loop through ALL slides to build the array-based FormData
    slidesPayload.forEach((slide, index) => {
      const isTarget = index === targetIndex;

      // Ensure ID is sent if it exists
      if (slide.id !== undefined && slide.id !== null) {
        formData.append(`slides[${index}][id]`, slide.id.toString());
      }

      if (isTarget) {
        // --- Append data from FORM (Formatted values) ---
        formData.append(
          `slides[${index}][hero_title][ar]`,
          formValues.hero_title_ar
        );
        formData.append(
          `slides[${index}][hero_title][en]`,
          formValues.hero_title_en
        );
        formData.append(
          `slides[${index}][hero_description][ar]`,
          formValues.hero_description_ar
        );
        formData.append(
          `slides[${index}][hero_description][en]`,
          formValues.hero_description_en
        );

        if (formValues.hero_subtitle_ar) {
          formData.append(
            `slides[${index}][hero_subtitle][ar]`,
            formValues.hero_subtitle_ar
          );
        }
        if (formValues.hero_subtitle_en) {
          formData.append(
            `slides[${index}][hero_subtitle][en]`,
            formValues.hero_subtitle_en
          );
        }

        // Files - only append if new file provided
        if (formValues.hero_image instanceof File) {
          formData.append(
            `slides[${index}][hero_image]`,
            formValues.hero_image
          );
        }
        if (formValues.small_hero_image instanceof File) {
          formData.append(
            `slides[${index}][small_hero_image]`,
            formValues.small_hero_image
          );
        }
      } else {
        // --- Append data from EXISTING SLIDE (Keep as is) ---
        formData.append(
          `slides[${index}][hero_title][ar]`,
          slide.heroTitle?.ar || ""
        );
        formData.append(
          `slides[${index}][hero_title][en]`,
          slide.heroTitle?.en || ""
        );
        formData.append(
          `slides[${index}][hero_description][ar]`,
          slide.heroDescription?.ar || ""
        );
        formData.append(
          `slides[${index}][hero_description][en]`,
          slide.heroDescription?.en || ""
        );

        if (slide.heroSubtitle?.ar) {
          formData.append(
            `slides[${index}][hero_subtitle][ar]`,
            slide.heroSubtitle.ar
          );
        }
        if (slide.heroSubtitle?.en) {
          formData.append(
            `slides[${index}][hero_subtitle][en]`,
            slide.heroSubtitle.en
          );
        }
      }
    });

    return apiRequest<HeroResponse>("/homepage", {
      method: "POST",
      body: formData,
    });
  },

  deleteSlide: async (
    slideId: number
  ): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(
      `/homepage/slides/${slideId}`,
      {
        method: "DELETE",
      }
    );
  },

  updateAboutSection: async (data: {
    title_ar: string;
    title_en: string;
    description_ar: string;
    description_en: string;
  }): Promise<HeroResponse> => {
    const formData = new FormData();
    formData.append("title[ar]", data.title_ar);
    formData.append("title[en]", data.title_en);
    formData.append("description[ar]", data.description_ar);
    formData.append("description[en]", data.description_en);

    return apiRequest<HeroResponse>("/homepage/", {
      method: "POST",
      body: formData,
    });
  },
};
