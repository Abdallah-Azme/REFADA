"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  approveRepresentativeApi,
  rejectRepresentativeApi,
  changeRepresentativePasswordApi,
} from "../api/representatives.api";
import { toast } from "sonner";

export function useApproveRepresentative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, campId }: { userId: number; campId: number }) =>
      approveRepresentativeApi(userId, campId),
    onSuccess: (data) => {
      toast.success(data.message || "تم قبول المندوب بنجاح");
      queryClient.invalidateQueries({ queryKey: ["representatives"] });
      queryClient.invalidateQueries({ queryKey: ["pending-users"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء قبول المندوب");
    },
  });
}

export function useRejectRepresentative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => rejectRepresentativeApi(userId),
    onSuccess: (data) => {
      toast.success(data.message || "تم رفض المندوب بنجاح");
      queryClient.invalidateQueries({ queryKey: ["representatives"] });
      queryClient.invalidateQueries({ queryKey: ["pending-users"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء رفض المندوب");
    },
  });
}

export function useChangeRepresentativePassword() {
  return useMutation({
    mutationFn: ({
      userId,
      password,
      passwordConfirmation,
    }: {
      userId: number;
      password: string;
      passwordConfirmation: string;
    }) =>
      changeRepresentativePasswordApi(userId, password, passwordConfirmation),
    onSuccess: (data) => {
      toast.success(data.message || "تم تغيير كلمة المرور بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء تغيير كلمة المرور");
    },
  });
}
