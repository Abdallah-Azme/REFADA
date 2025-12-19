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
  pageUpdateSchema,
  PageUpdateFormValues,
  PageData,
} from "../types/page.schema";
import { useEffect, useState, lazy, Suspense } from "react";
import { Loader2, Upload, FileText, ImageIcon } from "lucide-react";

const RichTextEditor = lazy(() => import("@/components/rich-text-editor"));
import Image from "next/image";

interface PageEditFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageData: PageData;
  onSubmit: (data: PageUpdateFormValues) => void;
  isPending?: boolean;
}

export function PageEditFormDialog({
  open,
  onOpenChange,
  pageData,
  onSubmit,
  isPending,
}: PageEditFormDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const form = useForm<PageUpdateFormValues>({
    resolver: zodResolver(pageUpdateSchema),
    defaultValues: {
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
      image: undefined,
      file: undefined,
    },
  });

  useEffect(() => {
    if (pageData && open) {
      // Assuming pageData contains current values.
      // If API only returns localized, we fill what we have.
      // Ideally we should have both languages.
      // For now, I'll populate both fields with the same value if we don't have separate.
      // But typically for "Update", we start with empty or current.
      // If returning separate fields:
      const titleAr = pageData.title_ar || pageData.title || "";
      const titleEn = pageData.title_en || ""; // Might be missing
      const descAr = pageData.description_ar || pageData.description || "";
      const descEn = pageData.description_en || ""; // Might be missing

      form.reset({
        title_ar: titleAr,
        title_en: titleEn,
        description_ar: descAr,
        description_en: descEn,
        image: undefined,
        file: undefined,
      });

      if (pageData.image) {
        setImagePreview(pageData.image);
      }

      if (pageData.file) {
        setFilePreview(pageData.file);
      }
    }
  }, [pageData, open, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("file", file);
      setFilePreview(file.name);
    }
  };

  const handleSubmit = (data: PageUpdateFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تعديل محتوى الصفحة: {pageData.title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Document Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>صورة الصفحة</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      {imagePreview && (
                        <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
                          <ImageIcon className="h-5 w-5 text-primary" />
                          <a
                            href={imagePreview}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            عرض الصورة الحالية
                          </a>
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          {...field}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          يمكنك رفع صور: JPG, PNG, GIF, WEBP
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload */}
            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>ملف الصفحة</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      {filePreview && (
                        <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                          {filePreview.startsWith("http") ? (
                            <a
                              href={filePreview}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              عرض الملف الحالي
                            </a>
                          ) : (
                            <span className="text-sm text-gray-700">
                              {filePreview}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleFileChange}
                          {...field}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          يمكنك رفع ملفات: PDF, DOC, DOCX, TXT
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان (بالعربية)</FormLabel>
                    <FormControl>
                      <Input placeholder="العنوان بالعربية..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان (بالإنجليزي)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="English Title..."
                        className="direction-ltr"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Descriptions */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="description_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف (بالعربية)</FormLabel>
                    <FormControl>
                      <Suspense
                        fallback={
                          <div className="h-40 w-full animate-pulse bg-gray-100 rounded-md" />
                        }
                      >
                        <RichTextEditor
                          content={field.value}
                          onChange={field.onChange}
                          placeholder="الوصف بالعربية..."
                        />
                      </Suspense>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف (بالإنجليزي)</FormLabel>
                    <FormControl>
                      <Suspense
                        fallback={
                          <div className="h-40 w-full animate-pulse bg-gray-100 rounded-md" />
                        }
                      >
                        <RichTextEditor
                          content={field.value}
                          onChange={field.onChange}
                          placeholder="English Description..."
                        />
                      </Suspense>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                ) : (
                  "حفظ التعديلات"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
