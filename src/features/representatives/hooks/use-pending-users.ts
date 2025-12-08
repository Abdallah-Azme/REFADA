import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getPendingUsersApi,
  approveUserApi,
  rejectUserApi,
} from "../api/pending-users.api";
import { ApproveUserRequest } from "../types/pending-users.schema";

/**
 * Hook to fetch pending users
 */
export function usePendingUsers(role?: "delegate" | "contributor") {
  return useQuery({
    queryKey: ["pending-users", role],
    queryFn: () => getPendingUsersApi(role),
  });
}

/**
 * Hook to approve a user
 */
export function useApproveUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: number;
      data?: ApproveUserRequest;
    }) => approveUserApi(userId, data),
    onSuccess: (response) => {
      toast.success(response.message || "تم قبول المستخدم بنجاح");
      // Invalidate pending users query to refetch
      queryClient.invalidateQueries({ queryKey: ["pending-users"] });
    },
    onError: (error: any) => {
      // Global error handler will pick this up too, but local toast is fine for specificity
      toast.error(error.message || "حدث خطأ أثناء قبول المستخدم");
    },
  });
}

/**
 * Hook to reject a user
 */
export function useRejectUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => rejectUserApi(userId),
    onSuccess: (response) => {
      toast.success(response.message || "تم رفض المستخدم بنجاح");
      // Invalidate pending users query to refetch
      queryClient.invalidateQueries({ queryKey: ["pending-users"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء رفض المستخدم");
    },
  });
}
