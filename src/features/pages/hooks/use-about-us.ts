import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aboutUsApi } from "../api/about-us.api";
import { toast } from "sonner";
import { PageUpdateFormValues } from "../types/page.schema";

export const useAboutUs = () => {
  return useQuery({
    queryKey: ["about-us"],
    queryFn: aboutUsApi.get,
  });
};

export const useUpdateAboutUs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: aboutUsApi.update,
    onSuccess: () => {
      toast.success("تم تحديث بيانات من نحن بنجاح");
      queryClient.invalidateQueries({ queryKey: ["about-us"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء التحديث");
    },
  });
};

// Hook for updating mission/vision/goals sections via /about-us/{pageType}
export const useUpdateAboutUsSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageType,
      data,
    }: {
      pageType: string;
      data: PageUpdateFormValues;
    }) => aboutUsApi.updateSection(pageType, data),
    onSuccess: (response, variables) => {
      toast.success(response.message || "تم تحديث القسم بنجاح");
      queryClient.invalidateQueries({ queryKey: ["about-us"] });
      queryClient.invalidateQueries({ queryKey: ["page", variables.pageType] });
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء التحديث");
    },
  });
};
