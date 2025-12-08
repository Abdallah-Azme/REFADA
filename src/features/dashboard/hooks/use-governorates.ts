import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { governoratesApi } from "../api/governorates.api";
import { GovernorateFormValues } from "../types/governorates.schema";

export function useGovernorates() {
  return useQuery({
    queryKey: ["governorates"],
    queryFn: governoratesApi.getAll,
  });
}

export function useCreateGovernorate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GovernorateFormValues) => governoratesApi.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم إضافة المحافظة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["governorates"] });
    },
  });
}

export function useUpdateGovernorate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GovernorateFormValues }) =>
      governoratesApi.update(id, data),
    onSuccess: (response) => {
      toast.success(response.message || "تم تحديث المحافظة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["governorates"] });
    },
  });
}

export function useDeleteGovernorate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => governoratesApi.delete(id),
    onSuccess: (response) => {
      toast.success(response.message || "تم حذف المحافظة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["governorates"] });
    },
  });
}
