import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFamilyMemberApi,
  CreateFamilyMemberPayload,
} from "../api/families.api";
import { toast } from "sonner";

export const useCreateFamilyMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      familyId,
      data,
    }: {
      familyId: number;
      data: CreateFamilyMemberPayload;
    }) => createFamilyMemberApi(familyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة الفرد");
    },
  });
};
