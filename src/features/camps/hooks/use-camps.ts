import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
