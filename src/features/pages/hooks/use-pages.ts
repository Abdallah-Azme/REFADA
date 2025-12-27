import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { pagesApi } from "../api/pages.api";
import { aboutUsApi } from "../api/about-us.api";
import { PageUpdateFormValues } from "../types/page.schema";

export function usePages() {
  return useQuery({
    queryKey: ["pages"],
    queryFn: pagesApi.getAll,
  });
}

export function usePage(pageType: string) {
  return useQuery({
    queryKey: ["page", pageType],
    queryFn: () => pagesApi.getByType(pageType),
    enabled: !!pageType,
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageType,
      data,
    }: {
      pageType: string;
      data: PageUpdateFormValues;
    }) => pagesApi.update(pageType, data),
    onSuccess: (response, variables) => {
      toast.success(response.message || "تم تحديث الصفحة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["page", variables.pageType] });
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      // Also invalidate about-us query since mission/vision/goals come from /about-us endpoint
      queryClient.invalidateQueries({ queryKey: ["about-us"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث الصفحة");
    },
  });
}

export function useAboutUs() {
  return useQuery({
    queryKey: ["about-us"],
    queryFn: aboutUsApi.get,
  });
}
