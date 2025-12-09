import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { maritalStatusApi } from "../api/marital-status.api";
import { MaritalStatusFormValues } from "../types/marital-status.schema";

export function useMaritalStatuses() {
  return useQuery({
    queryKey: ["marital-statuses"],
    queryFn: maritalStatusApi.getAll,
  });
}

export function useMaritalStatus(id: number) {
  return useQuery({
    queryKey: ["marital-status", id],
    queryFn: () => maritalStatusApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateMaritalStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MaritalStatusFormValues) =>
      maritalStatusApi.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم إضافة الحالة الاجتماعية بنجاح");
      queryClient.invalidateQueries({ queryKey: ["marital-statuses"] });
    },
  });
}

export function useUpdateMaritalStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MaritalStatusFormValues }) =>
      maritalStatusApi.update(id, data),
    onSuccess: (response) => {
      toast.success(response.message || "تم تحديث الحالة الاجتماعية بنجاح");
      queryClient.invalidateQueries({ queryKey: ["marital-statuses"] });
    },
  });
}

export function useDeleteMaritalStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => maritalStatusApi.delete(id),
    onSuccess: (response) => {
      toast.success(response.message || "تم حذف الحالة الاجتماعية بنجاح");
      queryClient.invalidateQueries({ queryKey: ["marital-statuses"] });
    },
  });
}
