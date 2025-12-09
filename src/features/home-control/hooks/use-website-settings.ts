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
    mutationFn: (data: WebsiteSettingsFormValues) => settingsApi.update(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم تحديث الإعدادات بنجاح");
      queryClient.invalidateQueries({ queryKey: ["website-settings"] });
    },
  });
}
