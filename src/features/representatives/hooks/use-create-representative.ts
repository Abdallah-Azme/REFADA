import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRepresentativeApi } from "../api/representatives.api";
import { toast } from "sonner";
import { CreateRepresentativeFormValues } from "../types/create-representative.schema";

export const useCreateRepresentative = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRepresentativeFormValues) =>
      createRepresentativeApi(data),
    onSuccess: () => {
      toast.success("تم إضافة المندوب بنجاح");
      queryClient.invalidateQueries({ queryKey: ["representatives"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة المندوب");
    },
  });
};
