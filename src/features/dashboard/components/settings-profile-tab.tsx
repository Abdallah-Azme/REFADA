"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Pencil, Loader2 } from "lucide-react";
import {
  useProfile,
  useUpdateProfile,
  updateProfileSchema,
  UpdateProfileFormValues,
} from "@/features/profile";
import { ImageUpload } from "@/components/ui/image-upload";

export default function SettingsProfileTab() {
  const t = useTranslations("settings.profile");
  const [isEditing, setIsEditing] = useState(false);
  const { data: profileData, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const profileForm = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      idNumber: "",
      phone: "",
      backupPhone: "",
    },
  });

  // Update form when profile data is loaded
  useEffect(() => {
    if (profileData?.data) {
      profileForm.reset({
        name: profileData.data.name || "",
        email: profileData.data.email || "",
        idNumber: profileData.data.idNumber || "",
        phone: profileData.data.phone || "",
        backupPhone: profileData.data.backupPhone || "",
        profile_image: profileData.data.profileImageUrl,
      });
    }
  }, [profileData, profileForm]);

  const onProfileSubmit = (data: UpdateProfileFormValues) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mr-3 text-gray-600">{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-start mb-6">
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-primary hover:bg-primary/90 ms-auto text-white px-8 py-2.5 rounded-lg flex items-center gap-2 text-base shadow-sm"
          >
            <span>{t("edit_button")}</span>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Form {...profileForm}>
        <form
          onSubmit={profileForm.handleSubmit(onProfileSubmit)}
          className="space-y-0"
        >
          {/* Profile Image Upload */}
          <div className="mb-8">
            <FormField
              control={profileForm.control}
              name="profile_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-700 block text-center mb-4">
                    {t("profile_image")}
                  </FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        disabled={!isEditing}
                        placeholder={t("upload_placeholder")}
                        imageClassName="h-40 w-40 rounded-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* NAME */}
            <FormField
              control={profileForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    {t("name")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      className="h-11 text-base bg-gray-50 border-gray-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* EMAIL */}
            <FormField
              control={profileForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    {t("email")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      disabled={!isEditing}
                      className="h-11 text-base bg-gray-50 border-gray-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ID NUMBER */}
            <FormField
              control={profileForm.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    {t("id_number")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      className="h-11 text-base bg-gray-50 border-gray-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PHONE */}
            <FormField
              control={profileForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    {t("phone")}
                  </FormLabel>
                  <FormControl>
                    <PhoneInput
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!isEditing}
                      className="h-11 text-base bg-gray-50 border-gray-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* BACKUP PHONE */}
            <FormField
              control={profileForm.control}
              name="backupPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    {t("backup_phone")}
                  </FormLabel>
                  <FormControl>
                    <PhoneInput
                      value={field.value || ""}
                      onChange={field.onChange}
                      disabled={!isEditing}
                      className="h-11 text-base bg-gray-50 border-gray-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ADMIN POSITION NAME - Read Only */}
            {(profileData?.data as any)?.adminPositionName && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  {t("admin_position")}
                </label>
                <div className="h-11 text-base bg-gray-100 border border-gray-200 rounded-md flex items-center px-3 text-gray-600">
                  {(profileData?.data as any).adminPositionName}
                </div>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-5">
              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="bg-[#1B4854] hover:bg-[#1B4854]/90 text-white px-8 py-2.5 rounded-lg text-base shadow-sm"
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    {t("saving")}
                  </>
                ) : (
                  t("save_button")
                )}
              </Button>
              <Button
                type="button"
                className="bg-[#C4A862] hover:bg-[#C4A862]/90 text-white px-8 py-2.5 rounded-lg text-base shadow-sm"
                onClick={() => {
                  setIsEditing(false);
                  profileForm.reset();
                }}
              >
                {t("cancel_button")}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
