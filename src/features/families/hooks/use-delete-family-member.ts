import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFamilyMemberApi } from "../api/families.api";
import { toast } from "sonner";

export const useDeleteFamilyMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      familyId,
      memberId,
    }: {
      familyId: number;
      memberId: number;
    }) => deleteFamilyMemberApi(familyId, memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      queryClient.invalidateQueries({
        queryKey: ["family-members", variables.familyId],
      });
      toast.success("تم حذف الفرد بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء حذف الفرد");
    },
  });
};
