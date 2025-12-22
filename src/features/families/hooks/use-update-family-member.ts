import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateFamilyMemberApi,
  CreateFamilyMemberPayload,
} from "../api/families.api";
import { toast } from "sonner";

export const useUpdateFamilyMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      familyId,
      memberId,
      data,
      originalNationalId,
    }: {
      familyId: number;
      memberId: number;
      data: CreateFamilyMemberPayload;
      originalNationalId?: string;
    }) => updateFamilyMemberApi(familyId, memberId, data, originalNationalId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      queryClient.invalidateQueries({
        queryKey: ["family-members", variables.familyId],
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء تعديل بيانات الفرد");
    },
  });
};
