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
import {
  useProfile,
  useUpdateProfile,
  UpdateProfileFormValues,
} from "@/features/profile";

// Zod Schema for contributor form
const contributorFormSchema = z.object({
  name: z.string().min(1, "اسم المساهم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(10, "رقم الهاتف غير صحيح"),
  backupPhone: z.string().optional(),
});

type ContributorFormValues = z.infer<typeof contributorFormSchema>;

export default function ContributorForm() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: profileData, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

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
      backupPhone: data.backupPhone,
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
          بيانات المساهم
        </h3>
        <div className="flex items-center justify-center py-12 border border-gray-200 rounded-xl">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mr-3 text-gray-600">جاري تحميل البيانات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:w-1/2 px-8">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold text-[#333333]">بيانات المساهم</h3>

        <div className="flex items-center justify-end mb-2">
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Pencil className="w-4 h-4 ml-2" />
              تعديل
            </Button>
          )}
        </div>
      </div>

      {!isEditing ? (
        // View Mode
        <div className="flex gap-8 items-center border border-gray-200 p-4 rounded-xl">
          <div className="w-full space-y-3 mt-6">
            <div className="grid grid-cols-2 items-center justify-between border-gray-200 pb-3">
              <span className="text-sm text-gray-600">اسم المساهم:</span>
              <span
                className="text-base text-gray-900 font-medium truncate"
                title={form.getValues("name") || "-"}
              >
                {form.getValues("name") || "-"}
              </span>
            </div>

            <div className="grid grid-cols-2 items-center justify-between border-gray-200 pb-3">
              <span className="text-sm text-gray-600">البريد الالكتروني:</span>
              <span
                className="text-base text-gray-900 font-medium truncate"
                title={form.getValues("email") || "-"}
              >
                {form.getValues("email") || "-"}
              </span>
            </div>

            <div className="grid grid-cols-2 items-center justify-between border-gray-200 pb-3">
              <span className="text-sm text-gray-600">رقم الجوال:</span>
              <span
                className="text-base text-gray-900 font-medium truncate"
                title={form.getValues("phone") || "-"}
              >
                {form.getValues("phone") || "-"}
              </span>
            </div>

            <div className="grid grid-cols-2 items-center justify-between border-gray-200 pb-3">
              <span className="text-sm text-gray-600">
                رقم الجوال الاحتياطي:
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
              إلغاء
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
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ
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
                  <label className="text-sm text-gray-600">اسم المساهم:</label>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            {...field}
                            className="text-right bg-white border-gray-300"
                            placeholder="اسم المساهم"
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
                    البريد الإلكتروني:
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
                            placeholder="البريد الإلكتروني"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone */}
                <div className="grid grid-cols-2 items-center pb-3 border-b border-gray-200">
                  <label className="text-sm text-gray-600">رقم الجوال:</label>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <PhoneInput
                            className="[&_input]:text-right [&_input]:bg-white [&_input]:border-gray-300 [&_button]:bg-white [&_button]:border-gray-300"
                            placeholder="رقم الجوال"
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
                    رقم الجوال الاحتياطي:
                  </label>
                  <FormField
                    control={form.control}
                    name="backupPhone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <PhoneInput
                            className="[&_input]:text-right [&_input]:bg-white [&_input]:border-gray-300 [&_button]:bg-white [&_button]:border-gray-300"
                            placeholder="رقم الجوال الاحتياطي"
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
