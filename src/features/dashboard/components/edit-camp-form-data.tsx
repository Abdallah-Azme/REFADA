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

const campSchema = z.object({
  campName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(10),
  whatsappNumber: z.string().min(10),
  representativeName: z.string().min(1),
});

type CampFormValues = z.infer<typeof campSchema>;

const initialData: CampFormValues = {
  campName: "أحمد محمد عبد الله",
  email: "ahmed123@gmail.com",
  phoneNumber: "+972 000112233",
  whatsappNumber: "+972 000112233",
  representativeName: "أحمد محمد عبد الله",
};

export default function EditCampFormData() {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<CampFormValues>({
    resolver: zodResolver(campSchema),
    defaultValues: initialData,
  });

  const onSubmit = (data: CampFormValues) => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.reset(initialData);
    setIsEditing(false);
  };

  return (
    <div className="lg:w-1/2 p-4">
      {/* HEADER + FIXED BUTTON SLOT */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">المندوب</h3>

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
              تعديل
            </Button>
          ) : (
            <div className="flex gap-2">
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
          )}
        </div>
      </div>

      {/* ================= VIEW MODE ================= */}
      {!isEditing ? (
        <div className="flex gap-8 items-center border border-gray-200 p-4 rounded-xl">
          <div>
            <Avatar className="w-24 h-24 mb-6 bg-[#C4A962]">
              <AvatarImage src="" alt="Camp Representative" />
              <AvatarFallback className="bg-[#C4A962] text-white">
                <Image className="w-10 h-10" />
              </AvatarFallback>
            </Avatar>
            <div className="text-center mb-2 text-sm text-gray-500">
              اضافة صورة
            </div>
          </div>

          <div className="w-full space-y-1.5 mt-6">
            <div className="grid grid-cols-2 items-center pb-3">
              <span className="text-sm text-gray-600">اسم المندوب:</span>
              <span className="text-base text-gray-900 font-medium">
                {form.getValues("representativeName")}
              </span>
            </div>

            <div className="grid grid-cols-2 items-center pb-3">
              <span className="text-sm text-gray-600">البريد الإلكتروني:</span>
              <span className="text-base text-gray-900 font-medium">
                {form.getValues("email")}
              </span>
            </div>

            <div className="grid grid-cols-2 items-center pb-3">
              <span className="text-sm text-gray-600">رقم الجوال:</span>
              <span className="text-base text-gray-900 font-medium">
                {form.getValues("phoneNumber")}
              </span>
            </div>

            <div className="grid grid-cols-2 items-center pb-3">
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
        // ================= EDIT MODE =================
        <div className="w-full  border border-gray-200 rounded-md p-2">
          <div className="flex gap-8 items-center">
            {/* Avatar */}
            <div>
              <Avatar className="w-24 h-24 mb-4 bg-[#C4A962]">
                <AvatarImage src="" alt="Camp Representative" />
                <AvatarFallback className="bg-[#C4A962] text-white">
                  <ImageIcon className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center mb-2 text-sm text-gray-500">
                اضافة صورة
              </div>
            </div>

            {/* Inputs */}
            <Form {...form}>
              <form className="w-full space-y-1">
                <div className="grid grid-cols-2 items-center pb-3 ">
                  <label className="text-sm text-gray-600">اسم المندوب:</label>
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
                  <label className="text-sm text-gray-600">
                    البريد الإلكتروني:
                  </label>
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
                  <label className="text-sm text-gray-600">رقم الجوال:</label>
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
                    رقم الجوال الاحتياطي:
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
