import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { relationshipApi } from "../api/relationship.api";
import { RelationshipFormValues } from "../types/relationship.schema";

export function useRelationships() {
  return useQuery({
    queryKey: ["relationships"],
    queryFn: relationshipApi.getAll,
  });
}

export function useRelationship(id: number) {
  return useQuery({
    queryKey: ["relationship", id],
    queryFn: () => relationshipApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateRelationship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RelationshipFormValues) => relationshipApi.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم إضافة العلاقة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["relationships"] });
    },
  });
}

export function useUpdateRelationship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RelationshipFormValues }) =>
      relationshipApi.update(id, data),
    onSuccess: (response) => {
      toast.success(response.message || "تم تحديث العلاقة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["relationships"] });
    },
  });
}

export function useDeleteRelationship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => relationshipApi.delete(id),
    onSuccess: (response) => {
      toast.success(response.message || "تم حذف العلاقة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["relationships"] });
    },
  });
}
