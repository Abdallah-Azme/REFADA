import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsApi } from "../api/settings.api";
import { WebsiteSettingsFormValues } from "../types/settings.schema";

export function useWebsiteSettings() {
  return useQuery({
    queryKey: ["website-settings"],
    queryFn: settingsApi.get,
  });
}

export function useUpdateWebsiteSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WebsiteSettingsFormValues) => {
      console.log("Updating settings with data:", data);
      return settingsApi.update(data);
    },
    onSuccess: (response) => {
      console.log("Settings update success:", response);
      toast.success(response.message || "تم تحديث الإعدادات بنجاح");
      queryClient.invalidateQueries({ queryKey: ["website-settings"] });
    },
    onError: (error: any) => {
      console.error("Settings update error:", error);
      toast.error(error?.message || "حدث خطأ أثناء تحديث الإعدادات");
    },
  });
}
