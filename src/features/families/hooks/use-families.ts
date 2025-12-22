import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFamiliesApi,
  getFamilyApi,
  createFamilyApi,
  updateFamilyApi,
  deleteFamilyApi,
} from "../api/families.api";
import { FamilyFormValues } from "../types/family.schema";
import { toast } from "sonner";

export function useFamilies(params?: string) {
  return useQuery({
    queryKey: ["families", params],
    queryFn: () => getFamiliesApi(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useFamily(id: number | null) {
  return useQuery({
    queryKey: ["family", id],
    queryFn: () => getFamilyApi(id!),
    enabled: !!id,
  });
}

export function useCreateFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FamilyFormValues) => createFamilyApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      toast.success("تم إضافة العائلة بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "حدث خطأ أثناء إضافة العائلة");
    },
  });
}

export function useUpdateFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      originalNationalId,
    }: {
      id: number;
      data: FamilyFormValues;
      originalNationalId?: string;
    }) => updateFamilyApi(id, data, originalNationalId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      queryClient.invalidateQueries({ queryKey: ["family", id] });
      toast.success("تم تحديث بيانات العائلة بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "حدث خطأ أثناء تحديث بيانات العائلة");
    },
  });
}

export function useDeleteFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFamilyApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      toast.success("تم حذف العائلة بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "حدث خطأ أثناء حذف العائلة");
    },
  });
}
