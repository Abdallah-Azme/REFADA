"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  governorateSchema,
  GovernorateFormValues,
  Governorate,
} from "../types/governorates.schema";

interface GovernorateFormDialogProps {
  initialData: Governorate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: GovernorateFormValues) => void;
}

export default function GovernorateFormDialog({
  initialData,
  open,
  onOpenChange,
  onSubmit,
}: GovernorateFormDialogProps) {
  const form = useForm<GovernorateFormValues>({
    resolver: zodResolver(governorateSchema),
    defaultValues: {
      name_ar: "",
      name_en: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name_ar: initialData.name_ar || initialData.name,
          name_en: initialData.name_en || "",
        });
      } else {
        form.reset({
          name_ar: "",
          name_en: "",
        });
      }
    }
  }, [initialData, open, form]);

  const handleSubmit = (data: GovernorateFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md!">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "تعديل المحافظة" : "إضافة محافظة جديدة"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم (بالعربية)</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الاسم بالعربية" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم (باللغة الإنجليزية)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name in English" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">حفظ</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
