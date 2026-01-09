"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

export default function ContributorSettingsProfileTab() {
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
      adminPosition: "",
      licenseNumber: "",
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
        adminPosition: profileData.data.adminPosition || "",
        licenseNumber: profileData.data.licenseNumber || "",
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
          <span className="mr-3 text-gray-600">جاري تحميل البيانات...</span>
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
            <span>تعديل</span>
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
                    صورة الملف الشخصي
                  </FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        disabled={!isEditing}
                        placeholder="اضغط لرفع صورة الملف الشخصي"
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
                    الاسم
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
                    البريد الإلكتروني
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
                    رقم الهوية
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
                    رقم الجوال
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
                    الرقم الاحتياطي
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

            {/* ADMIN POSITION - Only show if exists */}
            {profileData?.data?.adminPosition && (
              <FormField
                control={profileForm.control}
                name="adminPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      الصفة الإدارية
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={true}
                        className="h-11 text-base bg-gray-100 border-gray-200"
                        value={
                          profileData?.data?.adminPosition || field.value || ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* LICENSE NUMBER - Only show if admin position is association or if it exists */}
            {(profileData?.data?.adminPosition === "جمعية" ||
              profileData?.data?.licenseNumber) && (
              <FormField
                control={profileForm.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      رقم الترخيص
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
                    جاري الحفظ...
                  </>
                ) : (
                  "حفظ ✓"
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
                إلغاء ✗
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
