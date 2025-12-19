import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { heroApi } from "../api/hero.api";
import { HeroFormValues } from "../types/hero.schema";

export function useHero() {
  return useQuery({
    queryKey: ["home-hero"],
    queryFn: heroApi.get,
  });
}

export function useUpdateHero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      formValues: HeroFormValues;
      allSlides: any[];
      isNew?: boolean;
    }) => {
      if (params.isNew) {
        return heroApi.create(params.formValues);
      }
      return heroApi.update(params);
    },
    onSuccess: (response) => {
      toast.success(response.message || "تم حفظ بيانات الواجهة الرئيسية بنجاح");
      queryClient.invalidateQueries({ queryKey: ["home-hero"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء حفظ البيانات");
    },
  });
}

export function useDeleteSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slideId: number) => heroApi.deleteSlide(slideId),
    onSuccess: (response) => {
      toast.success(response.message || "تم حذف الشريحة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["home-hero"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء حذف الشريحة");
    },
  });
}

export function useUpdateAboutSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title_ar: string;
      title_en: string;
      description_ar: string;
      description_en: string;
    }) => heroApi.updateAboutSection(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم تحديث قسم من نحن بنجاح");
      queryClient.invalidateQueries({ queryKey: ["home-hero"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث قسم من نحن");
    },
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      sectionIndex: number;
      allSections: Array<{
        id: number;
        title: { ar: string; en: string };
        description: { ar: string; en: string };
        image?: string | null;
      }>;
      title_ar: string;
      title_en: string;
      description_ar: string;
      description_en: string;
      image?: File;
    }) => heroApi.updateSection(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم تحديث القسم بنجاح");
      queryClient.invalidateQueries({ queryKey: ["home-hero"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث القسم");
    },
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title_ar: string;
      title_en: string;
      description_ar: string;
      description_en: string;
      image?: File;
    }) => heroApi.createSection(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم إنشاء القسم بنجاح");
      queryClient.invalidateQueries({ queryKey: ["home-hero"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء القسم");
    },
  });
}
