"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import {
  testimonialSchema,
  TestimonialFormValues,
  Testimonial,
} from "../types/testimonial.schema";
import { useEffect, useState } from "react";
import { Loader2, Upload, User } from "lucide-react";
import Image from "next/image";

interface TestimonialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Testimonial | null;
  onSubmit: (data: TestimonialFormValues) => void;
  isPending?: boolean;
}

export function TestimonialFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending,
}: TestimonialFormDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      userName: "",
      opinion_ar: "",
      opinion_en: "",
      order: 0,
      userImage: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      // If we have initial data, we populate the form.
      // Note: for file inputs, we can't programmatically set the file object from URL.
      // So user_image remains undefined in form state unless user uploads new one.
      // We assume opinion is returned as an object {ar: "", en: ""} or we need to fetch it?
      // For now, assuming standard separate fields or we parse it.
      // If API returns `opinion` as string (standard from previous observation),
      // we might only populate one language or need to fetch full details.
      // But standard "Edit" usually requires fetching full Details.
      // I'll assume `initialData` has opinion_ar and opinion_en if they exist,
      // or we accept that we might be missing English if list only returns localized.
      // Ideally page component passes full data.

      const opinionAr =
        (initialData as any).opinion_ar || initialData.opinion || "";
      const opinionEn = (initialData as any).opinion_en || ""; // Might be missing

      form.reset({
        userName: initialData.userName,
        opinion_ar: opinionAr,
        opinion_en: opinionEn,
        order: initialData.order || 0,
      });

      if (initialData.userImage) {
        setImagePreview(initialData.userImage);
      }
    } else {
      form.reset({
        userName: "",
        opinion_ar: "",
        opinion_en: "",
        order: 0,
        userImage: undefined,
      });
      setImagePreview(null);
    }
  }, [initialData, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("userImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (data: TestimonialFormValues) => {
    onSubmit(data);
    if (!isPending) {
      // Only reset if creating, or parent handles closing
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "تعديل التزكية" : "إضافة تزكية جديدة"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* User Details */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المستخدم</FormLabel>
                    <FormControl>
                      <Input placeholder="اسم صاحب التزكية..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="userImage"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>صورة المستخدم</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <div className="relative h-20 w-20 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center shrink-0">
                          {imagePreview ? (
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <User className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            {...field}
                            className="cursor-pointer"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            يفضل استخدام صورة مربعة بحجم 500x500
                          </p>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Opinions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="opinion_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الرأي (بالعربية)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="اكتب الرأي بالعربية..."
                        className="resize-none h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="opinion_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الرأي (بالإنجليزي)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Opinion in English..."
                        className="resize-none h-32 direction-ltr"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الترتيب</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جاري الحفظ...
                  </>
                ) : initialData ? (
                  "تحديث"
                ) : (
                  "إضافة"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
