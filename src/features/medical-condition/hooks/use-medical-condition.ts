import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { medicalConditionApi } from "../api/medical-condition.api";
import { MedicalConditionFormValues } from "../types/medical-condition.schema";

export function useMedicalConditions() {
  return useQuery({
    queryKey: ["medical-conditions"],
    queryFn: medicalConditionApi.getAll,
  });
}

export function useMedicalCondition(id: number) {
  return useQuery({
    queryKey: ["medical-condition", id],
    queryFn: () => medicalConditionApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateMedicalCondition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MedicalConditionFormValues) =>
      medicalConditionApi.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم إضافة الحالة الطبية بنجاح");
      queryClient.invalidateQueries({ queryKey: ["medical-conditions"] });
    },
  });
}

export function useUpdateMedicalCondition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: MedicalConditionFormValues;
    }) => medicalConditionApi.update(id, data),
    onSuccess: (response) => {
      toast.success(response.message || "تم تحديث الحالة الطبية بنجاح");
      queryClient.invalidateQueries({ queryKey: ["medical-conditions"] });
    },
  });
}

export function useDeleteMedicalCondition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => medicalConditionApi.delete(id),
    onSuccess: (response) => {
      toast.success(response.message || "تم حذف الحالة الطبية بنجاح");
      queryClient.invalidateQueries({ queryKey: ["medical-conditions"] });
    },
  });
}
