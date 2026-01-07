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
  medicalConditionSchema,
  MedicalConditionFormValues,
  MedicalCondition,
} from "../types/medical-condition.schema";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface MedicalConditionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: MedicalCondition | null;
  onSubmit: (data: MedicalConditionFormValues) => void;
  isPending?: boolean;
}

export function MedicalConditionFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending,
}: MedicalConditionFormDialogProps) {
  const t = useTranslations("medical_condition_page");
  const form = useForm<MedicalConditionFormValues>({
    resolver: zodResolver(medicalConditionSchema),
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

  const handleSubmit = (data: MedicalConditionFormValues) => {
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
            {initialData ? t("edit_title") : t("add_title")}
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
                  <FormLabel>{t("name_label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("placeholder")} {...field} />
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
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    {t("save")}
                  </>
                ) : initialData ? (
                  t("update_btn")
                ) : (
                  t("add_btn")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
