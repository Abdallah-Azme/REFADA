import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutApi } from "../api";
import { useAuth } from "../context/auth-context";
import { ApiErrorResponse } from "../types/auth.schema";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout: contextLogout } = useAuth();

  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: (response) => {
      // Clear auth data using context logout (this also calls authService.logout())
      contextLogout();

      // Clear all queries
      queryClient.clear();

      // Show success message
      toast.success(response.message || "تم تسجيل الخروج بنجاح");

      // Redirect to login
      router.push("/signin");
    },
    onError: (error: ApiErrorResponse) => {
      // Even if API fails, clear local auth data
      contextLogout();
      queryClient.clear();

      toast.error(error.message || "حدث خطأ أثناء تسجيل الخروج");

      // Still redirect to login
      router.push("/signin");
    },
  });
}
