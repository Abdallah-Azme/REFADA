import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteContributorApi } from "../api/contributors.api";
import { toast } from "sonner";

export const useDeleteContributor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteContributorApi(id),
    onSuccess: () => {
      toast.success("تم حذف المساهم بنجاح");
      queryClient.invalidateQueries({ queryKey: ["contributors"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء حذف المساهم");
    },
  });
};
