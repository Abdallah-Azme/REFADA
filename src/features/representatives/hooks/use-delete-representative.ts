import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRepresentativeApi } from "../api/representatives.api";
import { toast } from "sonner";

export const useDeleteRepresentative = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRepresentativeApi(id),
    onSuccess: () => {
      toast.success("تم حذف المندوب بنجاح");
      queryClient.invalidateQueries({ queryKey: ["representatives"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء حذف المندوب");
    },
  });
};
