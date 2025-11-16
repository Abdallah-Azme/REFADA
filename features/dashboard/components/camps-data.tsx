"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil, Save, X, Image, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CampsDetails from "./camps-details";

// Zod Schema
const campSchema = z.object({
  campName: z.string().min(1, "اسم المخيم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phoneNumber: z.string().min(10, "رقم الهاتف غير صحيح"),
  whatsappNumber: z.string().min(10, "رقم الواتساب غير صحيح"),
  representativeName: z.string().min(1, "اسم المندوب مطلوب"),
});

type CampFormValues = z.infer<typeof campSchema>;

// Initial data
const initialData: CampFormValues = {
  campName: "أحمد محمد عبد الله",
  email: "ahmed123@gmail.com",
  phoneNumber: "+972 000112233",
  whatsappNumber: "+972 000112233",
  representativeName: "أحمد محمد عبد الله",
};

const campStats = [
  { label: "اسم المخيم", value: "اضافه" },
  { label: "عدد العائلات", value: "320 عائلة" },
  { label: "عدد الأطفال", value: "3120 طفل" },
  { label: "عدد كبار السن", value: "32 شيخ" },
];

export default function CampsData() {
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
    <div className="w-full bg-[#F8F9FA] rounded-2xl">
      <div className="flex flex-col lg:flex-row">
        {/* Right Section - Camp Stats */}
        <CampsDetails campStats={campStats} />

        {/* Left Section - Representative Info */}
        <div className="lg:w-1/2 p-8 bg-[#F8F9FA] rounded-l-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">المندوب</h3>
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

          {!isEditing ? (
            // View Mode
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-6 bg-[#C4A962]">
                <AvatarImage src="" alt="Camp Representative" />
                <AvatarFallback className="bg-[#C4A962] text-white">
                  <Image className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center mb-2 text-sm text-gray-500">
                اضافة صورة
              </div>

              <div className="w-full space-y-5 mt-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-base text-gray-900 font-medium">
                    {form.getValues("representativeName")}
                  </span>
                  <span className="text-sm text-gray-600">اسم المندوب:</span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-base text-gray-900 font-medium">
                    {form.getValues("email")}
                  </span>
                  <span className="text-sm text-gray-600">
                    البريد الالكتروني:
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-base text-gray-900 font-medium">
                    {form.getValues("phoneNumber")}
                  </span>
                  <span className="text-sm text-gray-600">رقم الجوال:</span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-base text-gray-900 font-medium">
                    {form.getValues("whatsappNumber")}
                  </span>
                  <span className="text-sm text-gray-600">
                    رقم الجوال الاحتياطي:
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div>
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
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 ml-2" />
                  حفظ
                </Button>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="flex justify-center mb-6">
                    <Avatar className="w-24 h-24 bg-[#C4A962]">
                      <AvatarImage src="" alt="Camp Representative" />
                      <AvatarFallback className="bg-[#C4A962] text-white">
                        <ImageIcon className="w-10 h-10" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-center mb-6 text-sm text-gray-500">
                    اضافة صورة
                  </div>

                  <FormField
                    control={form.control}
                    name="representativeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-600">
                          اسم المندوب
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="text-right bg-white"
                            placeholder="اسم المندوب"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-600">
                          البريد الإلكتروني
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className="text-right bg-white"
                            placeholder="البريد الإلكتروني"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-600">
                          رقم الجوال
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="text-right bg-white"
                            placeholder="رقم الجوال"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whatsappNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-600">
                          رقم الجوال الاحتياطي
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="text-right bg-white"
                            placeholder="رقم الجوال الاحتياطي"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
