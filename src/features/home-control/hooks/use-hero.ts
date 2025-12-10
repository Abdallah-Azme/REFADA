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
