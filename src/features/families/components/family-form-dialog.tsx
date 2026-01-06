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
      // This is tricky if we don't have the IDs in the initialData.
      // The Family interface has `camp: string` and `maritalStatus: string`.
      // If the backend doesn't provide IDs in the list/show response, we might have a problem editing.
      // However, usually "edit" requires IDs.
      // I'll check the User's SHOW response again.
      // "maritalStatus": "متزوج", "camp": "معسكر السلام".
      // It DOES NOT have maritalStatusId or campId in the SHOW response provided.
      // But usually in real apps, the ID is available or we can find it by name (risky).
      // Wait, standard practice is to return IDs.
      // If not, I can try to find the ID from the list by name match?

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
            {initialData ? "تعديل بيانات العائلة" : "إضافة عائلة جديدة"}
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
                    <FormLabel>اسم العائلة</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="اسم العائلة" />
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
                    <FormLabel>رقم الهوية</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="رقم الهوية (14 رقم)"
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
                    <FormLabel>تاريخ الميلاد</FormLabel>
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
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="رقم الهاتف"
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
                    <FormLabel>رقم هاتف بديل (اختياري)</FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="رقم هاتف بديل"
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
                    <FormLabel>عدد الأفراد</FormLabel>
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
                    <FormLabel>الحالة الاجتماعية</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحالة الاجتماعية" />
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
                    <FormLabel>المعسكر</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المعسكر" />
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
                    <FormLabel>رقم الخيمة</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="رقم الخيمة" />
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
                    <FormLabel>الموقع / العنوان</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="الموقع" />
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
                      <FormLabel>صورة (اختياري)</FormLabel>
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
                      <FormLabel>ملاحظات (اختياري)</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="أي ملاحظات إضافية" />
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
                إلغاء
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "حفظ التغييرات" : "إضافة العائلة"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
