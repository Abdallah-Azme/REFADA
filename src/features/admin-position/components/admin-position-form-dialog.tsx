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
import {
  adminPositionSchema,
  AdminPositionFormValues,
  AdminPosition,
} from "../types/admin-position.schema";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AdminPositionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: AdminPosition | null;
  onSubmit: (data: AdminPositionFormValues) => void;
  isPending?: boolean;
}

export function AdminPositionFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending,
}: AdminPositionFormDialogProps) {
  const form = useForm<AdminPositionFormValues>({
    resolver: zodResolver(adminPositionSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: AdminPositionFormValues) => {
    onSubmit(data);
    if (!isPending) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]!">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "تعديل الصفة الإدارية" : "إضافة صفة إدارية جديدة"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: مشرف" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
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
