import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFamiliesApi,
  getFamilyApi,
  createFamilyApi,
  updateFamilyApi,
  deleteFamilyApi,
} from "../api/families.api";
import { FamilyFormValues } from "../types/family.schema";
import {
  FamiliesQueryParams,
  buildFamiliesQueryString,
  DEFAULT_FAMILIES_QUERY,
} from "../types/families-query.types";
import { toast } from "sonner";

export function useFamilies(
  params: FamiliesQueryParams = DEFAULT_FAMILIES_QUERY,
) {
  const queryString = buildFamiliesQueryString(params);
  return useQuery({
    queryKey: ["families", params],
    queryFn: () => getFamiliesApi(queryString),
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
      headMemberId,
    }: {
      id: number;
      data: FamilyFormValues;
      originalNationalId?: string;
      headMemberId?: number;
    }) => updateFamilyApi(id, data, originalNationalId, headMemberId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      queryClient.invalidateQueries({ queryKey: ["family", id] });
      queryClient.invalidateQueries({ queryKey: ["family-members", id] });
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

export function useFamilyStatistics(familyId: number | null) {
  return useQuery({
    queryKey: ["familyStatistics", familyId],
    queryFn: async () => {
      const { getFamilyStatisticsApi } = await import("../api/families.api");
      return getFamilyStatisticsApi(familyId!);
    },
    enabled: !!familyId,
  });
}

export function useBulkDeleteFamilies() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      familyIds: number[];
      deleteReason: string;
    }) => {
      const { bulkDeleteFamiliesApi } = await import("../api/families.api");
      return bulkDeleteFamiliesApi(payload);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      toast.success(response?.message || "تم حذف العائلات بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "حدث خطأ أثناء حذف العائلات");
    },
  });
}

export function useDeletedFamilies() {
  return useQuery({
    queryKey: ["deletedFamilies"],
    queryFn: async () => {
      const { getDeletedFamiliesApi } = await import("../api/families.api");
      return getDeletedFamiliesApi();
    },
  });
}

export function useForceDeleteFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (familyId: number) => {
      const { forceDeleteFamilyApi } = await import("../api/families.api");
      return forceDeleteFamilyApi(familyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deletedFamilies"] });
      toast.success("تم حذف العائلة نهائياً بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "حدث خطأ أثناء حذف العائلة");
    },
  });
}
export function useRestoreFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { restoreFamilyApi } = await import("../api/families.api");
      return restoreFamilyApi(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      queryClient.invalidateQueries({ queryKey: ["deletedFamilies"] });
      toast.success("تم استعادة العائلة بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "حدث خطأ أثناء استعادة العائلة");
    },
  });
}
