"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTranslations } from "next-intl";
import {
  useProfile,
  useUpdateProfile,
  UpdateProfileFormValues,
} from "@/features/profile";

// Helper function to create schema with translations
const createContributorSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("validation.name_required")),
    email: z.string().email(t("validation.email_invalid")),
    phone: z.string().min(10, t("validation.phone_invalid")),
    backupPhone: z.string().optional(),
  });

type ContributorFormValues = z.infer<
  ReturnType<typeof createContributorSchema>
>;

export default function ContributorForm() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: profileData, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const t = useTranslations("contributors");

  // Create schema using the translation function
  const contributorFormSchema = createContributorSchema(t);

  const form = useForm<ContributorFormValues>({
    resolver: zodResolver(contributorFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      backupPhone: "",
    },
  });

  // Update form when profile data is loaded
  useEffect(() => {
    if (profileData?.data) {
      form.reset({
        name: profileData.data.name || "",
        email: profileData.data.email || "",
        phone: profileData.data.phone || "",
        backupPhone: profileData.data.backupPhone || "",
      });
    }
  }, [profileData, form]);

  const onSubmit = (data: ContributorFormValues) => {
    const updateData: UpdateProfileFormValues = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      backupPhone: data.backupPhone || undefined,
    };

    updateProfile.mutate(updateData, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleCancel = () => {
    if (profileData?.data) {
      form.reset({
        name: profileData.data.name || "",
        email: profileData.data.email || "",
        phone: profileData.data.phone || "",
        backupPhone: profileData.data.backupPhone || "",
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="lg:w-1/2 px-8">
        <h3 className="text-lg font-semibold text-[#333333] mb-4">
          {t("page_title")}
        </h3>
        <div className="flex items-center justify-center py-12 border border-gray-200 rounded-xl">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mr-3 text-gray-600">{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:w-1/2 px-8">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold text-[#333333]">
          {t("page_title")}
        </h3>

        <div className="flex items-center justify-end mb-2">
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Pencil className="w-4 h-4 ml-2" />
              {t("profile.edit")}
            </Button>
          )}
        </div>
      </div>

      {!isEditing ? (
        // View Mode
        <div className="flex gap-8 items-center border border-gray-200 p-4 rounded-xl">
          <div className="w-full space-y-3 mt-6">
            <div className="grid grid-cols-2 items-center justify-between border-gray-200 pb-3">
              <span className="text-sm text-gray-600">{t("table_name")}:</span>
              <span
                className="text-base text-gray-900 font-medium truncate"
                title={form.getValues("name") || "-"}
              >
                {form.getValues("name") || "-"}
              </span>
            </div>

            <div className="grid grid-cols-2 items-center justify-between border-gray-200 pb-3">
              <span className="text-sm text-gray-600">{t("table_email")}:</span>
              <span
                className="text-base text-gray-900 font-medium truncate"
                title={form.getValues("email") || "-"}
              >
                {form.getValues("email") || "-"}
              </span>
            </div>

            <div className="grid grid-cols-2 items-center justify-between border-gray-200 pb-3">
              <span className="text-sm text-gray-600">{t("table_phone")}:</span>
              <span
                className="text-base text-gray-900 font-medium truncate"
                title={form.getValues("phone") || "-"}
              >
                {form.getValues("phone") || "-"}
              </span>
            </div>

            <div className="grid grid-cols-2 items-center justify-between border-gray-200 pb-3">
              <span className="text-sm text-gray-600">
                {t("backup_phone")}:
              </span>
              <span
                className="text-base text-gray-900 font-medium truncate"
                title={form.getValues("backupPhone") || "-"}
              >
                {form.getValues("backupPhone") || "-"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        // Edit Mode
        <div className="w-full bg-gray-50 border border-gray-200 rounded-md p-6">
          <div className="flex justify-end gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={updateProfile.isPending}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="w-4 h-4 ml-2" />
              {t("profile.cancel")}
            </Button>

            <Button
              size="sm"
              onClick={form.handleSubmit(onSubmit)}
              disabled={updateProfile.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  {t("profile.saving")}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 ml-2" />
                  {t("profile.save")}
                </>
              )}
            </Button>
          </div>

          <div className="flex gap-8 items-start">
            {/* Inputs side */}
            <Form {...form}>
              <form className="w-full space-y-3">
                {/* Name */}
                <div className="grid grid-cols-2 items-center pb-3 border-b border-gray-200">
                  <label className="text-sm text-gray-600">
                    {t("table_name")}:
                  </label>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            {...field}
                            className="text-right bg-white border-gray-300"
                            placeholder={t("table_name")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email */}
                <div className="grid grid-cols-2 items-center pb-3 border-b border-gray-200">
                  <label className="text-sm text-gray-600">
                    {t("table_email")}:
                  </label>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className="text-right bg-white border-gray-300"
                            placeholder={t("table_email")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone */}
                <div className="grid grid-cols-2 items-center pb-3 border-b border-gray-200">
                  <label className="text-sm text-gray-600">
                    {t("table_phone")}:
                  </label>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <PhoneInput
                            className="[&_input]:text-right [&_input]:bg-white [&_input]:border-gray-300 [&_button]:bg-white [&_button]:border-gray-300"
                            placeholder={t("table_phone")}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Backup Phone */}
                <div className="grid grid-cols-2 items-center pb-3 border-b border-gray-200">
                  <label className="text-sm text-gray-600">
                    {t("backup_phone")}:
                  </label>
                  <FormField
                    control={form.control}
                    name="backupPhone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <PhoneInput
                            className="[&_input]:text-right [&_input]:bg-white [&_input]:border-gray-300 [&_button]:bg-white [&_button]:border-gray-300"
                            placeholder={t("backup_phone")}
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
