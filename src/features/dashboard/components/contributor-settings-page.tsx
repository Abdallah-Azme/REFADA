"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Settings, User2 } from "lucide-react";
import SettingsPasswordTab from "./settings-password-tab";
import ContributorSettingsProfileTab from "./contributor-settings-profile-tab";

export default function ContributorSettingsPage() {
  return (
    <div className="w-full  gap-6 p-8 bg-gray-50 min-h-screen">
      {" "}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg flex gap-1 font-semibold text-gray-900">
          <Settings />
          الإعدادات
        </h3>
      </div>
      <Tabs
        defaultValue="profile"
        className="flex flex-row gap-6 w-full items-start"
      >
        {/* SIDEBAR */}
        <TabsList className="items-start flex-col justify-start gap-3 rounded-xl border border-gray-200 shadow-sm bg-white rounded-md p-3 h-auto md:self-stretch md:w-56 shrink-0">
          <TabsTrigger
            value="profile"
            className="flex-none gap-2 flex items-center justify-start w-full rounded-lg py-2 px-3 h-auto data-[state=active]:text-[#4F4F4F] data-[state=active]:bg-[#F5F5F5]  "
          >
            <User2 className="h-5 w-5" />

            <span className="text-base font-medium hidden md:block">
              الملف الشخصي
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="password"
            className="flex-none gap-2 flex items-center justify-start w-full rounded-lg py-2 px-3 h-auto data-[state=active]:text-[#4F4F4F] data-[state=active]:bg-[#F5F5F5]  "
          >
            <Lock className="h-5 w-5" />

            <span className="text-base font-medium hidden md:block">
              تغيير كلمة المرور
            </span>
          </TabsTrigger>
        </TabsList>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          {/* PROFILE TAB */}
          <TabsContent value="profile" className="mt-0">
            <ContributorSettingsProfileTab />
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
