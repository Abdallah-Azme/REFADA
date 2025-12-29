"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useProfile, useUpdateProfile } from "@/features/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, ImageIcon, Pencil, Save, X, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const campSchema = z.object({
  campName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(10),
  whatsappNumber: z.string().optional(),
  representativeName: z.string().min(1),
});

type CampFormValues = z.infer<typeof campSchema>;

export default function EditCampFormData() {
  const t = useTranslations("profile");
  const [isEditing, setIsEditing] = useState(false);
  const { data: profileData, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const user = profileData?.data;
  const userCamp = user?.camp;

  const form = useForm<CampFormValues>({
    resolver: zodResolver(campSchema),
    defaultValues: {
      campName: "",
      email: "",
      phoneNumber: "",
      whatsappNumber: "",
      representativeName: "",
    },
  });

  // Update form when profile data loads
  useEffect(() => {
    if (user) {
      form.reset({
        campName: userCamp?.name || "",
        email: user.email || "",
        phoneNumber: user.phone || "",
        whatsappNumber: user.backupPhone || "",
        representativeName: user.name || "",
      });
    }
  }, [user, userCamp, form]);

  const onSubmit = (data: CampFormValues) => {
    updateProfileMutation.mutate(
      {
        name: data.representativeName,
        email: data.email,
        phone: data.phoneNumber,
        backupPhone: data.whatsappNumber,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancel = () => {
    if (user) {
      form.reset({
        campName: userCamp?.name || "",
        email: user.email || "",
        phoneNumber: user.phone || "",
        whatsappNumber: user.backupPhone || "",
        representativeName: user.name || "",
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="lg:w-1/2 p-4 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="lg:w-1/2 p-4">
      {/* HEADER + FIXED BUTTON SLOT */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          {t("representative")}
        </h3>

        {/* 🔥 FIXED WIDTH to prevent shifting */}
        <div className="flex items-center justify-end w-40">
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Pencil className="w-4 h-4 ml-2" />
              {t("edit")}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-900"
                disabled={updateProfileMutation.isPending}
              >
                <X className="w-4 h-4 ml-2" />
                {t("cancel")}
              </Button>

              <Button
                size="sm"
                onClick={form.handleSubmit(onSubmit)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 ml-2" />
                )}
                {updateProfileMutation.isPending ? t("saving") : t("save")}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ================= VIEW MODE ================= */}
      {!isEditing ? (
        <div className="flex gap-8 items-center border border-gray-200 p-4 rounded-xl">
          <div>
            <Avatar className="w-24 h-24 mb-6 bg-[#C4A962]">
              <AvatarImage
                src={user?.profileImageUrl || ""}
                alt="Camp Representative"
              />
              <AvatarFallback className="bg-[#C4A962] text-white">
                {user?.name?.charAt(0) || <Image className="w-10 h-10" />}
              </AvatarFallback>
            </Avatar>
            <div className="text-center mb-2 text-sm text-gray-500">
              {t("add_image")}
            </div>
          </div>

          <div className="w-full space-y-1.5 mt-6">
            <div className="grid grid-cols-2 items-center pb-3">
              <span className="text-sm text-gray-600">
                {t("representative_name")}:
              </span>
              <span
                className="text-base text-gray-900 font-medium truncate"
                title={user?.name || "-"}
              >
                {user?.name || "-"}
              </span>
            </div>

            <div className="grid grid-cols-2 items-center pb-3">
              <span className="text-sm text-gray-600">{t("email")}:</span>
              <span
                className="text-base text-gray-900 font-medium truncate"
                title={user?.email || "-"}
              >
                {user?.email || "-"}
              </span>
            </div>

            <div className="grid grid-cols-2 items-center pb-3">
              <span className="text-sm text-gray-600">{t("phone")}:</span>
              <span
                className="text-base text-gray-900 font-medium truncate"
                title={user?.phone || "-"}
              >
                {user?.phone || "-"}
              </span>
            </div>

            <div className="grid grid-cols-2 items-center pb-3">
              <span className="text-sm text-gray-600">
                {t("backup_phone")}:
              </span>
              <span
                className="text-base text-gray-900 font-medium truncate"
                title={user?.backupPhone || "-"}
              >
                {user?.backupPhone || "-"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        // ================= EDIT MODE =================
        <div className="w-full  border border-gray-200 rounded-md p-2">
          <div className="flex gap-8 items-center">
            {/* Avatar */}
            <div>
              <Avatar className="w-24 h-24 mb-4 bg-[#C4A962]">
                <AvatarImage
                  src={user?.profileImageUrl || ""}
                  alt="Camp Representative"
                />
                <AvatarFallback className="bg-[#C4A962] text-white">
                  <ImageIcon className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center mb-2 text-sm text-gray-500">
                {t("add_image")}
              </div>
            </div>

            {/* Inputs */}
            <Form {...form}>
              <form className="w-full space-y-1">
                <div className="grid grid-cols-2 items-center pb-3 ">
                  <label className="text-sm text-gray-600">
                    {t("representative_name")}:
                  </label>
                  <FormField
                    control={form.control}
                    name="representativeName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl className="bg-[#f9f9f9]">
                          <Input
                            {...field}
                            className="text-right   border-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 items-center pb-3 ">
                  <label className="text-sm text-gray-600">{t("email")}:</label>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl className="bg-[#f9f9f9]">
                          <Input
                            {...field}
                            className="text-right   border-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 items-center pb-3 ">
                  <label className="text-sm text-gray-600">{t("phone")}:</label>
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl className="bg-[#f9f9f9]">
                          <Input
                            {...field}
                            className="text-right   border-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 items-center pb-3 ">
                  <label className="text-sm text-gray-600">
                    {t("backup_phone")}:
                  </label>
                  <FormField
                    control={form.control}
                    name="whatsappNumber"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl className="bg-[#f9f9f9]">
                          <Input
                            {...field}
                            className="text-right   border-gray-300"
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
