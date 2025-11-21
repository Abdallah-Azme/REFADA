"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, ImageIcon, Pencil, Save, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Zod Schema
const campSchema = z.object({
  campName: z.string().min(1, "اسم المخيم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phoneNumber: z.string().min(10, "رقم الهاتف غير صحيح"),
  whatsappNumber: z.string().min(10, "رقم الواتساب غير صحيح"),
  representativeName: z.string().min(1, "اسم المندوب مطلوب"),
});

type CampFormValues = z.infer<typeof campSchema>;
const initialData: CampFormValues = {
  campName: "أحمد محمد عبد الله",
  email: "ahmed123@gmail.com",
  phoneNumber: "+972 000112233",
  whatsappNumber: "+972 000112233",
  representativeName: "أحمد محمد عبد الله",
};

export default function ContributorForm() {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<CampFormValues>({
    resolver: zodResolver(campSchema),
    defaultValues: initialData,
  });

  const onSubmit = (data: CampFormValues) => {
    console.log("Form submitted:", data);
    setIsEditing(false);
    // Here you would typically make an API call to save the data
  };

  const handleCancel = () => {
    form.reset(initialData);
    setIsEditing(false);
  };
  return (
    <div className="lg:w-1/2 px-8  ">
      <div className="flex justify-between ">
        <h3 className="text-lg font-semibold text-[#333333]  ">
          بيانات المساهم
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
              تعديل
            </Button>
          )}
        </div>
      </div>

      {!isEditing ? (
        // View Mode
        <div className="flex gap-8 items-center border border-gray-200 p-4  rounded-xl ">
          <div className="w-full space-y-3 mt-6">
            <div className="grid grid-cols-2 items-center justify-between border-gray-200 pb-3">
              <span className="text-sm text-gray-600">اسم المندوب:</span>
              <span className="text-base text-gray-900 font-medium">
                {form.getValues("representativeName")}
              </span>
            </div>

            <div className="grid grid-cols-2 items-center justify-between border-gray-200 pb-3">
              <span className="text-sm text-gray-600">البريد الالكتروني:</span>

              <span className="text-base text-gray-900 font-medium">
                {form.getValues("email")}
              </span>
            </div>

            <div className="grid grid-cols-2 items-center justify-between border-gray-200 pb-3">
              <span className="text-sm text-gray-600">رقم الجوال:</span>

              <span className="text-base text-gray-900 font-medium">
                {form.getValues("phoneNumber")}
              </span>
            </div>

            <div className="grid grid-cols-2 items-center gri justify-between border-gray-200 pb-3">
              <span className="text-sm text-gray-600">
                رقم الجوال الاحتياطي:
              </span>
              <span className="text-base text-gray-900 font-medium">
                {form.getValues("whatsappNumber")}
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
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="w-4 h-4 ml-2" />
              إلغاء
            </Button>

            <Button
              size="sm"
              onClick={form.handleSubmit(onSubmit)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 ml-2" />
              حفظ
            </Button>
          </div>

          <div className="flex gap-8 items-start">
            {/* Inputs side */}
            <Form {...form}>
              <form className="w-full space-y-3">
                {/* Name */}
                <div className="grid grid-cols-2 items-center pb-3 border-b border-gray-200">
                  <label className="text-sm text-gray-600">اسم المندوب:</label>
                  <FormField
                    control={form.control}
                    name="representativeName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            {...field}
                            className="text-right bg-white border-gray-300"
                            placeholder="اسم المندوب"
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
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            {...field}
                            className="text-right bg-white border-gray-300"
                            placeholder="رقم الجوال"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* WhatsApp */}
                <div className="grid grid-cols-2 items-center pb-3 border-b border-gray-200">
                  <label className="text-sm text-gray-600">
                    رقم الجوال الاحتياطي:
                  </label>
                  <FormField
                    control={form.control}
                    name="whatsappNumber"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            {...field}
                            className="text-right bg-white border-gray-300"
                            placeholder="رقم الجوال الاحتياطي"
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
