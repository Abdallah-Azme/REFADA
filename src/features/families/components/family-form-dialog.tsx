"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/shared/ui/form";
import { Input } from "@/src/shared/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/src/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/ui/select";
import { Textarea } from "@/src/shared/ui/textarea";

import { Family, FamilyFormValues, familySchema } from "../types/family.schema";
import { useCreateFamily, useUpdateFamily } from "../hooks/use-families";
import { useCamps } from "@/features/camps";
import { useMaritalStatuses } from "@/features/marital-status";
import { useTranslations } from "next-intl";

interface FamilyFormDialogProps {
  initialData?: Family | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FamilyFormDialog({
  initialData,
  open,
  onOpenChange,
}: FamilyFormDialogProps) {
  const t = useTranslations("families");
  const tCommon = useTranslations("common");
  const createMutation = useCreateFamily();
  const updateMutation = useUpdateFamily();

  // Fetch dependencies
  const { data: campsData } = useCamps();
  const { data: maritalStatusesData } = useMaritalStatuses();

  const camps = campsData?.data || [];
  const maritalStatuses = maritalStatusesData?.data || [];

  const form = useForm<FamilyFormValues>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      familyName: "",
      nationalId: "",
      dob: "",
      phone: "",
      backupPhone: "",
      totalMembers: 1,
      tentNumber: "",
      location: "",
      notes: "",
      campId: "",
      maritalStatusId: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      // We need to map the initial data (which has names for camp/maritalStatus) to IDs
      const foundCamp = camps.find((c) => c.name === initialData.camp);
      const foundMS = maritalStatuses.find(
        (m) => m.name === initialData.maritalStatus
      );

      form.reset({
        familyName: initialData.familyName,
        nationalId: initialData.nationalId,
        dob: initialData.dob,
        phone: initialData.phone,
        backupPhone: initialData.backupPhone,
        totalMembers: initialData.totalMembers,
        tentNumber: initialData.tentNumber,
        location: initialData.location,
        notes: initialData.notes || "",
        campId: foundCamp ? foundCamp.id.toString() : "",
        maritalStatusId: foundMS ? foundMS.id.toString() : "",
      });
    } else {
      form.reset({
        familyName: "",
        nationalId: "",
        dob: "",
        phone: "",
        backupPhone: "",
        totalMembers: 1,
        tentNumber: "",
        location: "",
        notes: "",
        campId: "",
        maritalStatusId: "",
      });
    }
  }, [initialData, form, camps, maritalStatuses]);

  const onSubmit = (data: FamilyFormValues) => {
    if (initialData) {
      updateMutation.mutate(
        { id: initialData.id, data },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("update_family_title") : t("add_family_title")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="familyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("family_name")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("family_name")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("national_id")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("national_id_placeholder_14")}
                        maxLength={14}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dob_label")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phone")}</FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder={t("phone")}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backupPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("backup_phone_optional")}</FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder={t("backup_phone")}
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("members_count_label")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={1} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maritalStatusId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("marital_status")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("choose_status")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {maritalStatuses.map((status: any) => (
                          <SelectItem
                            key={status.id}
                            value={status.id.toString()}
                          >
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="campId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("camp")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("choose_camp")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {camps.map((camp: any) => (
                          <SelectItem key={camp.id} value={camp.id.toString()}>
                            {camp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("tent_number")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("tent_number")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("location")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("location")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-1 md:col-span-2">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>{t("image_optional")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="file"
                          onChange={(event) => {
                            onChange(
                              event.target.files && event.target.files[0]
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("notes_optional")}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={t("notes_placeholder_extra")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {tCommon("cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? t("save_changes") : t("add_family_btn")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
