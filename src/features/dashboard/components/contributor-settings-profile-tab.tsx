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
import { Pencil } from "lucide-react";

// ----------------------
// ZOD SCHEMA
// ----------------------
const contributorProfileSchema = z.object({
  name: z.string().min(3, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().min(7, "رقم الجوال غير صالح"),
  backupNumber: z.string().optional(),
});

// infer the type from schema
type ContributorProfileFormValues = z.infer<typeof contributorProfileSchema>;

// ----------------------
// COMPONENT
// ----------------------
export default function ContributorSettingsProfileTab() {
  const [isEditing, setIsEditing] = useState(false);

  const profileForm = useForm<ContributorProfileFormValues>({
    resolver: zodResolver(contributorProfileSchema),
    defaultValues: {
      name: "أحمد محمد عبد الله",
      email: "ahmed123@gmail.com",
      phone: "+972 000112233",
      backupNumber: "+972 000112233",
    },
  });

  const onProfileSubmit = (data: ContributorProfileFormValues) => {
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
