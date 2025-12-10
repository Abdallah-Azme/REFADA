import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileApi } from "../api/profile.api";
import {
  UpdateProfileFormValues,
  ChangePasswordFormValues,
} from "../types/profile.schema";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: profileApi.getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileFormValues) =>
      profileApi.updateProfile(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم تحديث الملف الشخصي بنجاح");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordFormValues) =>
      profileApi.changePassword(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم تغيير كلمة المرور بنجاح");
    },
  });
}
