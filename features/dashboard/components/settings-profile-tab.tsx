"use client";

import { useState } from "react";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";

// ----------------------
// ZOD SCHEMA
// ----------------------
const profileSchema = z.object({
  name: z.string().min(3, "الاسم مطلوب"),
  idNumber: z.string().min(10, "رقم الهوية غير صالح"),
  phone: z.string().min(7, "رقم الجوال غير صالح"),
  backupNumber: z.string().optional(),
  camp: z.string().min(2, "اسم المخيم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  job: z.string().min(2, "الوظيفة مطلوبة"),
});

// infer the type from schema
type ProfileFormValues = z.infer<typeof profileSchema>;

// ----------------------
// COMPONENT
// ----------------------
export default function SettingsProfileTab() {
  const [isEditing, setIsEditing] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "أحمد محمد عبد الله",
      idNumber: "3220123456789098997655454",
      phone: "+972 00 323 9876",
      backupNumber: "3220123456789098997655454",
      camp: "مخيم اجدع",
      email: "Ahmed_mohamed83421@gmail.com",
      job: "مندوب ميداني",
    },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    console.log("Submitted!", data);
    setIsEditing(false);
  };

  return (
    <>
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
            <div className="grid lg:grid-cols-2 gap-6">
              {/* NAME */}
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm font-medium text-gray-700">
                      الاسم
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className="h-11 text-base bg-gray-50 border-gray-200 "
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
                    <FormLabel className=" text-sm font-medium text-gray-700">
                      رقم الهوية
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className="h-11 text-base bg-gray-50 border-gray-200 "
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
                    <FormLabel className=" text-sm font-medium text-gray-700">
                      رقم الجوال
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className="h-11 text-base bg-gray-50 border-gray-200 "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BACKUP NUMBER */}
              <FormField
                control={profileForm.control}
                name="backupNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm font-medium text-gray-700">
                      الرقم الاحتياطي
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className="h-11 text-base bg-gray-50 border-gray-200 "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CAMP */}
              <FormField
                control={profileForm.control}
                name="camp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm font-medium text-gray-700">
                      المخيم
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isEditing}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 text-base bg-gray-50 border-gray-200 ">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="مخيم اجدع">مخيم اجدع</SelectItem>
                        <SelectItem value="مخيم آخر">مخيم آخر</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <FormLabel className=" text-sm font-medium text-gray-700">
                      البريد الإلكتروني
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled={!isEditing}
                        className="h-11 text-base bg-gray-50 border-gray-200 "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* JOB */}
              <FormField
                control={profileForm.control}
                name="job"
                render={({ field }) => (
                  <FormItem className=" ">
                    <FormLabel className=" text-sm font-medium text-gray-700">
                      الوظيفة
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isEditing}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full text-base bg-gray-50 border-gray-200 ">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="مندوب ميداني">
                          مندوب ميداني
                        </SelectItem>
                        <SelectItem value="مدير">مدير</SelectItem>
                        <SelectItem value="موظف">موظف</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-5">
                <Button
                  onClick={profileForm.handleSubmit(onProfileSubmit)}
                  className="bg-[#1B4854] hover:bg-[#1B4854]/90 text-white px-8 py-2.5 rounded-lg text-base shadow-sm"
                >
                  حفظ ✓
                </Button>
                <Button
                  className="bg-[#C4A862] hover:bg-[#C4A862]/90 text-white px-8 py-2.5 rounded-lg text-base shadow-sm"
                  onClick={() => setIsEditing(false)}
                >
                  إلغاء ✗
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}
