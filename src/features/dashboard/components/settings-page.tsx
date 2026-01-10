"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Settings, User2 } from "lucide-react";
import SettingsPasswordTab from "./settings-password-tab";
import SettingsProfileTab from "./settings-profile-tab";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const t = useTranslations("settings");

  return (
    <div className="w-full  gap-6 p-8 bg-gray-50 min-h-screen">
      {" "}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg flex gap-1 font-semibold text-gray-900">
          <Settings />
          {t("title")}
        </h3>
      </div>
      <Tabs
        defaultValue="profile"
        className="flex flex-col md:flex-row gap-6 w-full items-start"
      >
        {/* SIDEBAR */}
        <TabsList className="flex flex-row md:flex-col items-center md:items-start justify-start gap-3 rounded-xl border border-gray-200 shadow-sm bg-white p-3 h-auto w-full md:self-stretch md:w-56 shrink-0 overflow-x-auto">
          <TabsTrigger
            value="profile"
            className="flex-none gap-2 flex items-center justify-center md:justify-start w-auto md:w-full rounded-lg py-2 px-3 h-auto data-[state=active]:text-[#4F4F4F] data-[state=active]:bg-[#F5F5F5]"
          >
            <User2 className="h-5 w-5" />

            <span className="text-base font-medium block">
              {t("profile_tab")}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="password"
            className="flex-none gap-2 flex items-center justify-center md:justify-start w-auto md:w-full rounded-lg py-2 px-3 h-auto data-[state=active]:text-[#4F4F4F] data-[state=active]:bg-[#F5F5F5]"
          >
            <Lock className="h-5 w-5" />

            <span className="text-base font-medium block">
              {t("password_tab")}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          {/* PROFILE TAB */}
          <TabsContent value="profile" className="mt-0">
            <SettingsProfileTab />
          </TabsContent>

          {/* PASSWORD TAB */}
          <TabsContent value="password" className="mt-0">
            <SettingsPasswordTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
