import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutApi } from "../api";
import { authService } from "../services/auth.service";
import { ApiErrorResponse } from "../types/auth.schema";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: (response) => {
      // Clear auth data
      authService.logout();

      // Clear all queries
      queryClient.clear();

      // Show success message
      toast.success(response.message || "تم تسجيل الخروج بنجاح");

      // Redirect to login
      router.push("/signin");
    },
    onError: (error: ApiErrorResponse) => {
      // Even if API fails, clear local auth data
      authService.logout();
      queryClient.clear();

      toast.error(error.message || "حدث خطأ أثناء تسجيل الخروج");

      // Still redirect to login
      router.push("/signin");
    },
  });
}
