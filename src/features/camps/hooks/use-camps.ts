import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { campsApi } from "../api/camp.api";
import { CampFormValues } from "../types/camp.schema";

export function useCamps() {
  return useQuery({
    queryKey: ["camps"],
    queryFn: campsApi.getAll,
  });
}

export function useCreateCamp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CampFormValues) => campsApi.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم إنشاء المخيم بنجاح");
      queryClient.invalidateQueries({ queryKey: ["camps"] });
    },
    // Global error handler will catch errors
  });
}

export function useUpdateCamp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: CampFormValues }) =>
      campsApi.update(slug, data),
    onSuccess: (response) => {
      toast.success(response.message || "تم تحديث المخيم بنجاح");
      queryClient.invalidateQueries({ queryKey: ["camps"] });
    },
    // Global error handler will catch errors
  });
}

export function useDeleteCamp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slug,
      deleteRelated,
    }: {
      slug: string;
      deleteRelated?: boolean;
    }) => campsApi.delete(slug, deleteRelated),
    onSuccess: (response) => {
      toast.success(response.message || "تم حذف المخيم بنجاح");
      queryClient.invalidateQueries({ queryKey: ["camps"] });
    },
    // Global error handler will catch errors
  });
}

export function useCampDetails(slug: string | null) {
  return useQuery({
    queryKey: ["camp", slug],
    queryFn: () => campsApi.getCampBySlug(slug!),
    enabled: !!slug,
  });
}

export function useCampStatistics() {
  return useInfiniteQuery({
    queryKey: ["camp-statistics"],
    queryFn: ({ pageParam = 1 }) => campsApi.getStatistics(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.current_page < lastPage.pagination.last_page) {
        return lastPage.pagination.current_page + 1;
      }
      return undefined;
    },
  });
}

export function useCampFamilyStatistics() {
  return useQuery({
    queryKey: ["camp-family-statistics"],
    queryFn: campsApi.getFamilyStatistics,
  });
}
