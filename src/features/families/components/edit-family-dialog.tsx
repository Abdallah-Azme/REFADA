"use client";

import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  FileSpreadsheet,
  Users,
  X,
  Trash2,
  UserPlus,
  Loader2,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { familySchema, Family } from "@/features/families/types/family.schema";
import { useUpdateFamily } from "@/features/families/hooks/use-families";
import { useCamps } from "@/features/camps";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import { useRelationships } from "@/features/families/hooks/use-relationships";
import { useMaritalStatuses } from "@/features/families/hooks/use-marital-statuses";
import { useMedicalConditions } from "@/features/families/hooks/use-medical-conditions";

interface EditFamilyDialogProps {
  family: Family | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditFamilyDialog({
  family,
  open,
  onOpenChange,
}: EditFamilyDialogProps) {
  const t = useTranslations("families");
  const [file, setFile] = useState<File | null>(null);
  const { mutateAsync: updateFamily, isPending } = useUpdateFamily();

  // Load camps for the select
  const { data: campsData } = useCamps();
  const camps = campsData?.data || [];

  // Load relationships for the select
  const { data: relationshipsData } = useRelationships();
  const relationships = relationshipsData?.data || [];

  // Load marital statuses for the select
  const { data: maritalStatusesData } = useMaritalStatuses();
  const maritalStatuses = maritalStatusesData?.data || [];

  // Load medical conditions for the select
  const { data: medicalConditionsData } = useMedicalConditions();
  const medicalConditions = medicalConditionsData?.data || [];

  const form = useForm<z.infer<typeof familySchema>>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      familyName: "",
      nationalId: "",
      dob: undefined,
      phone: "",
      backupPhone: undefined,
      totalMembers: 1,
      tentNumber: undefined,
      location: undefined,
      notes: undefined,
      campId: undefined,
      maritalStatusId: undefined,
      medicalConditionId: "none",
      members: [],
    },
  });

  // Populate form when family data changes
  useEffect(() => {
    if (family && open && camps.length > 0 && maritalStatuses.length > 0) {
      // Find IDs by matching names
      const foundCamp = camps.find((c) => c.name === family.camp);
      const foundMS = maritalStatuses.find(
        (m) => m.name === family.maritalStatus
      );

      form.reset({
        familyName: family.familyName || "",
        nationalId: family.nationalId || "",
        dob: family.dob || "",
        phone: family.phone || "",
        backupPhone: family.backupPhone || "",
        totalMembers: family.totalMembers || 1,
        tentNumber: family.tentNumber || "",
        location: family.location || "",
        notes: family.notes || "",
        campId: foundCamp ? foundCamp.id.toString() : "",
        maritalStatusId: foundMS ? foundMS.id.toString() : "",
        medicalConditionId: "none", // We don't have this in the response
        members: [],
      });
    }
  }, [family, open, camps, maritalStatuses, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const onError = (errors: any) => console.log("❌ FORM ERRORS:", errors);

  const onSubmit = async (values: z.infer<typeof familySchema>) => {
    if (!family) return;

    try {
      const familyPayload = {
        ...values,
        file: file,
      };

      await updateFamily({ id: family.id, data: familyPayload });
      toast.success("تم تعديل بيانات العائلة بنجاح");
      onOpenChange(false);
      form.reset();
      setFile(null);
    } catch (error: any) {
      console.error("Error updating family:", error);
      toast.error("حدث خطأ أثناء تعديل البيانات");
    }
  };

  const addMember = () => {
    append({
      name: "",
      nationalId: "",
      gender: "male",
      dob: "",
      relationshipId: "",
      medicalConditionId: "none",
    });
    form.setValue("totalMembers", fields.length + 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-md overflow-hidden max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold flex gap-1 items-center">
            <Users className="w-6 h-6 text-primary" />
            تعديل بيانات العائلة
          </DialogTitle>
        </div>

        {/* FORM */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-6 p-6"
          >
            {/* PERSONAL INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#F4F4F4] p-4 rounded-xl gap-4">
              {/* اسم العائلة */}
              <FormField
                control={form.control}
                name="familyName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="الاسم الرباعي"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* رقم الهوية */}
              <FormField
                control={form.control}
                name="nationalId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder={t("national_id")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* تاريخ الميلاد */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DatePicker
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder={t("dob")}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* رقم الهاتف */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder={t("phone")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* رقم الهاتف الاحتياطي */}
              <FormField
                control={form.control}
                name="backupPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder={t("backup_phone")}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* الحالة الاجتماعية */}
              <FormField
                control={form.control}
                name="maritalStatusId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full bg-white">
                          {field.value
                            ? maritalStatuses.find(
                                (s) => s.id.toString() === field.value
                              )?.name || t("marital_status")
                            : t("marital_status")}
                        </SelectTrigger>
                        <SelectContent>
                          {maritalStatuses.map((status) => (
                            <SelectItem
                              key={status.id}
                              value={status.id.toString()}
                            >
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* المعسكر */}
              <FormField
                control={form.control}
                name="campId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full bg-white">
                          {field.value
                            ? camps.find((c) => c.id.toString() === field.value)
                                ?.name || t("camp")
                            : t("camp")}
                        </SelectTrigger>
                        <SelectContent>
                          {camps.map((camp) => (
                            <SelectItem
                              key={camp.id}
                              value={camp.id.toString()}
                            >
                              {camp.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* عدد الأفراد */}
              <FormField
                control={form.control}
                name="totalMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        className="bg-white"
                        placeholder={t("members_count")}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* الحالة الصحية */}
              <FormField
                control={form.control}
                name="medicalConditionId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || "none"}
                      >
                        <SelectTrigger className="w-full bg-white">
                          {field.value && field.value !== "none"
                            ? medicalConditions.find(
                                (m) => m.id.toString() === field.value
                              )?.name || "الحالة الصحية"
                            : "سليم"}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">سليم</SelectItem>
                          {medicalConditions.map((condition) => (
                            <SelectItem
                              key={condition.id}
                              value={condition.id.toString()}
                            >
                              {condition.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* FILE UPLOAD - Only shown when medical condition is selected */}
            {form.watch("medicalConditionId") &&
              form.watch("medicalConditionId") !== "none" && (
                <div className="bg-[#F4F4F4] p-4 rounded-xl flex flex-col items-start gap-3">
                  <p className="text-sm font-medium ml-4">
                    ملف الحالة الصحية *
                  </p>
                  <div className="flex items-center gap-3 w-full">
                    {!file ? (
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setFile(f);
                        }}
                        className="bg-white w-full sm:w-auto"
                      />
                    ) : (
                      <div className="flex items-center bg-white border gap-2 rounded-xl px-4 py-2 shadow-sm">
                        <span className="ml-2 bg-green-500 text-white rounded-xl p-1">
                          <FileSpreadsheet className="w-4 h-4" />
                        </span>
                        <span className="text-xs text-gray-700">
                          {file.name}
                        </span>
                        <button
                          className="text-gray-500 hover:text-gray-700 mr-2"
                          onClick={() => setFile(null)}
                          type="button"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* LOCATION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-[#F4F4F4] p-4 rounded-xl gap-4">
              {/* رقم الخيمة */}
              <FormField
                control={form.control}
                name="tentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder={t("tent_number")}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* الموقع */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder={t("location")}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ملاحظات */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-1 sm:col-span-2 lg:col-span-1">
                    <FormControl>
                      <Textarea
                        className="bg-white min-h-[40px]"
                        placeholder={t("notes")}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* FAMILY MEMBERS SECTION */}
            <div className="bg-[#F4F4F4] p-4 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">أفراد العائلة</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMember}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <UserPlus className="w-4 h-4 ml-2" />
                  إضافة فرد
                </Button>
              </div>

              {/* Member Rows */}
              {fields.length > 0 && (
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-start bg-white p-3 rounded-lg"
                    >
                      {/* الاسم */}
                      <FormField
                        control={form.control}
                        name={`members.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="الاسم" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* رقم الهوية */}
                      <FormField
                        control={form.control}
                        name={`members.${index}.nationalId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="رقم الهوية" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* النوع */}
                      <FormField
                        control={form.control}
                        name={`members.${index}.gender`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  {field.value === "male"
                                    ? "ذكر"
                                    : field.value === "female"
                                    ? "أنثى"
                                    : "النوع"}
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">ذكر</SelectItem>
                                  <SelectItem value="female">أنثى</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* صلة القرابة */}
                      <FormField
                        control={form.control}
                        name={`members.${index}.relationshipId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  {field.value
                                    ? relationships.find(
                                        (r) => r.id.toString() === field.value
                                      )?.name || "صلة القرابة"
                                    : "صلة القرابة"}
                                </SelectTrigger>
                                <SelectContent>
                                  {relationships.map((rel) => (
                                    <SelectItem
                                      key={rel.id}
                                      value={rel.id.toString()}
                                    >
                                      {rel.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* تاريخ الميلاد */}
                      <FormField
                        control={form.control}
                        name={`members.${index}.dob`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="تاريخ الميلاد"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* الحالة الصحية */}
                      <FormField
                        control={form.control}
                        name={`members.${index}.medicalConditionId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value || "none"}
                              >
                                <SelectTrigger className="w-full">
                                  {field.value && field.value !== "none"
                                    ? medicalConditions.find(
                                        (m) => m.id.toString() === field.value
                                      )?.name || "الحالة الصحية"
                                    : "سليم"}
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">سليم</SelectItem>
                                  {medicalConditions.map((condition) => (
                                    <SelectItem
                                      key={condition.id}
                                      value={condition.id.toString()}
                                    >
                                      {condition.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Delete Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          remove(index);
                          form.setValue("totalMembers", fields.length - 1);
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 self-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {fields.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  اضغط على &quot;إضافة فرد&quot; لإضافة أفراد العائلة
                </p>
              )}
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 mx-auto w-full sm:w-fit">
              <Button
                type="button"
                variant="outline"
                className="border-gray-300 text-gray-600 px-8"
                onClick={() => onOpenChange(false)}
              >
                إلغاء
              </Button>

              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary text-white px-8"
              >
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                حفظ التغييرات
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
