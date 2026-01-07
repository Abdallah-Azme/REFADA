"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  TestimonialFormValues,
  Testimonial,
} from "../types/testimonial.schema";
import { useEffect, useState, useMemo } from "react";
import { Loader2, User } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("testimonials_page");

  const testimonialSchema = useMemo(
    () =>
      z.object({
        userName: z.string().min(2, t("validation.name_required")),
        userImage: z.any().optional(),
        opinion_ar: z.string().min(5, t("validation.content_ar_required")),
        opinion_en: z.string().min(5, t("validation.content_en_required")),
        order: z
          .string()
          .or(z.number())
          .transform((val) => Number(val))
          .optional(),
      }),
    [t]
  );

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
      const opinionAr =
        (initialData as any).opinion_ar ||
        (typeof initialData.opinion === "object"
          ? (initialData.opinion as any).ar
          : initialData.opinion) ||
        "";
      const opinionEn =
        (initialData as any).opinion_en ||
        (typeof initialData.opinion === "object"
          ? (initialData.opinion as any).en
          : "") ||
        "";

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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t("dialog_form.title_edit")
              : t("dialog_form.title_add")}
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
                    <FormLabel>{t("dialog_form.name_label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("dialog_form.name_placeholder")}
                        {...field}
                      />
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
                    <FormLabel>{t("dialog_form.image_label")}</FormLabel>
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
                            {t("dialog_form.image_hint")}
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
                    <FormLabel>{t("dialog_form.content_label_ar")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("dialog_form.content_placeholder_ar")}
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
                    <FormLabel>{t("dialog_form.content_label_en")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("dialog_form.content_placeholder_en")}
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
                  <FormLabel>{t("dialog_form.rating_label")}</FormLabel>
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
                {t("dialog_form.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    {t("actions.saving")}
                  </>
                ) : initialData ? (
                  t("dialog_form.update")
                ) : (
                  t("dialog_form.add")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
