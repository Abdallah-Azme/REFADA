import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aboutUsApi } from "../api/about-us.api";
import { toast } from "sonner";

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
