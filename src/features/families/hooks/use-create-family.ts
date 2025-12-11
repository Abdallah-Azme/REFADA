import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFamilyApi } from "../api/families.api";
import { toast } from "sonner";
import { FamilyFormValues } from "../types/family.schema";

export const useCreateFamily = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FamilyFormValues) => createFamilyApi(data),
    onSuccess: () => {
      toast.success("تم إضافة العائلة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة العائلة");
    },
  });
};
