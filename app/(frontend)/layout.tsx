import Header from "@/components/header";
import Footer from "@/components/shared/footer";
import FloatingWhatsapp from "@/components/shared/floating-whatsapp";
import { settingsApi } from "@/features/settings/api/settings.api";
import React from "react";

async function getSettings() {
  try {
    const response = await settingsApi.get();
    // API returns { success: true, message: "...", data: {...} }
    // settingsApi.get() already returns response.data which IS the settings object?
    // Let's check settings.api.ts implementation.
    // settingsApi.get() returns `response.data`.
    // And `response.data` is of type `SettingsResponse`.
    // Wait, the API definition was:
    // interface SettingsResponse { success: boolean; data: Settings; }
    // api.get<SettingsResponse> returns AxiosResponse<SettingsResponse>
    // response.data is SettingsResponse.
    // So settingsApi.get() returns SettingsResponse object.
    // WE NEED settingsApi.get().data which is the Settings object.

    // Actually, looking at previous API usage patterns in this codebase (e.g. campsApi),
    // usually the repository method returns the inner data array/object directly if abstracted well,
    // or returns the full response.
    // My implementation of settingsApi.get returned `response.data` which is `SettingsResponse`.
    // So I need to access `.data` property of that result.

    return response;
  } catch (error) {
    return null;
  }
}

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settingsResponse = await getSettings();
  const settings = settingsResponse?.data;

  return (
    <div>
      <Header settings={settings} />
      <div className="min-h-screen">{children}</div>
      <FloatingWhatsapp phoneNumber={settings?.whatsapp} />
      <Footer settings={settings} />
    </div>
  );
}
