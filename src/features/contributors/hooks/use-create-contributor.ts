import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContributorApi } from "../api/contributors.api";
import { toast } from "sonner";
import { CreateContributorFormValues } from "../types/create-contributor.schema";

export const useCreateContributor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContributorFormValues) =>
      createContributorApi(data),
    onSuccess: () => {
      toast.success("تم إضافة المساهم بنجاح");
      queryClient.invalidateQueries({ queryKey: ["contributors"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة المساهم");
    },
  });
};
