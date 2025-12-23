"use client";

import { useTranslations } from "next-intl";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

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
  CirclePlus,
  FileSpreadsheet,
  PlusCircle,
  Users,
  X,
  Trash2,
  UserPlus,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { familySchema } from "@/features/families/types/family.schema";
import { useCreateFamily } from "@/features/families/hooks/use-create-family";
import { useCamps } from "@/features/camps";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import { useRelationships } from "@/features/families/hooks/use-relationships";
import { useMaritalStatuses } from "@/features/families/hooks/use-marital-statuses";
import { useMedicalConditions } from "@/features/families/hooks/use-medical-conditions";

export default function AddFamilyDialog() {
  const t = useTranslations("families");
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const { mutateAsync: createFamily, isPending } = useCreateFamily();

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
      gender: "male", // Default to male for head of family
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

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "members",
  });

  // Watch totalMembers to auto-generate rows
  const totalMembers = useWatch({
    control: form.control,
    name: "totalMembers",
  });

  // Auto-generate member rows when totalMembers changes
  const prevTotalMembersRef = React.useRef<number | undefined>(undefined);

  useEffect(() => {
    // Skip initial render
    if (prevTotalMembersRef.current === undefined) {
      prevTotalMembersRef.current = totalMembers;
      return;
    }

    if (
      totalMembers &&
      totalMembers > 0 &&
      totalMembers !== prevTotalMembersRef.current
    ) {
      prevTotalMembersRef.current = totalMembers;
      const currentCount = fields.length;
      // targetCount is totalMembers - 1 because the head of family is already counted in totalMembers
      const targetCount = Math.max(0, totalMembers - 1);

      if (targetCount > currentCount) {
        // Add more rows
        const newMembers = Array(targetCount - currentCount)
          .fill(null)
          .map(() => ({
            name: "",
            nationalId: "",
            gender: "male" as const,
            dob: "",
            relationshipId: "",
            medicalConditionId: "none",
          }));
        newMembers.forEach((member) => append(member));
      } else if (targetCount < currentCount) {
        // Remove excess rows from the end
        for (let i = currentCount - 1; i >= targetCount; i--) {
          remove(i);
        }
      }
    }
  }, [totalMembers]);

  const onError = (errors: any) => console.log("❌ FORM ERRORS:", errors);

  const onSubmit = async (values: z.infer<typeof familySchema>) => {
    try {
      // Create the family with members in a single request
      // The API now accepts members[] array alongside family data
      const familyPayload = {
        ...values,
        file: file,
        // members are already in values from the form
      };

      await createFamily(familyPayload);

      setOpen(false);
      form.reset();
      setFile(null);
    } catch (error: any) {
      console.error("Error creating family:", error);
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
    // Update totalMembers to match: current members + new member + head of family
    form.setValue("totalMembers", fields.length + 2);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* TRIGGER BUTTON */}
      <DialogTrigger asChild>
        <Button className="bg-[#1F423B] text-white px-6 py-2 rounded-xl flex items-center gap-2 text-sm font-medium h-11">
          {t("add_family")} <PlusCircle className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      {/* DIALOG CONTENT */}
      <DialogContent className="rounded-md overflow-hidden max-w-4xl">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold flex gap-1 items-center">
            <Users className="mx-1 text-primary" />
            {t("add_family")}
          </DialogTitle>
        </div>

        {/* FORM */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto bg-white">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              {/* MAIN GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-[#F4F4F4] gap-4 p-4 rounded-xl">
                {/* الاسم الرباعي */}
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
                          placeholder="تاريخ الميلاد"
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

                {/* رقم الهاتف الثانوي */}
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

                {/* النوع (رب الأسرة) */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full bg-white">
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

                {/* الحالة الاجتماعية */}
                <FormField
                  control={form.control}
                  name="maritalStatusId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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

                {/* المخيم */}
                <FormField
                  control={form.control}
                  name="campId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full bg-white">
                            {field.value
                              ? (() => {
                                  const camp = camps.find(
                                    (c) => c.id.toString() === field.value
                                  );
                                  if (!camp) return t("camp_placeholder");
                                  const name = camp.name;
                                  return typeof name === "string"
                                    ? name
                                    : name?.ar ||
                                        name?.en ||
                                        t("camp_placeholder");
                                })()
                              : t("camp_placeholder")}
                          </SelectTrigger>
                          <SelectContent>
                            {camps.map((camp) => {
                              const displayName =
                                typeof camp.name === "string"
                                  ? camp.name
                                  : camp.name?.ar || camp.name?.en || "";
                              return (
                                <SelectItem
                                  key={camp.id}
                                  value={camp.id.toString()}
                                >
                                  {displayName}
                                </SelectItem>
                              );
                            })}
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

                {/* الحالة الصحية للرئيس العائلة */}
                <FormField
                  control={form.control}
                  name="medicalConditionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || "none"}
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

                        {/* ملف الحالة الصحية - يظهر فقط إذا تم اختيار حالة مرضية */}
                        {form.watch(`members.${index}.medicalConditionId`) &&
                          form.watch(`members.${index}.medicalConditionId`) !==
                            "none" && (
                            <FormField
                              control={form.control}
                              name={`members.${index}.medicalConditionFile`}
                              render={({
                                field: { onChange, value, ...field },
                              }) => (
                                <FormItem className="sm:col-span-7 mt-2">
                                  <FormControl>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) onChange(file);
                                        }}
                                        className="bg-gray-50"
                                        {...field}
                                      />
                                      {value && (
                                        <span className="text-xs text-gray-500">
                                          {(value as File).name}
                                        </span>
                                      )}
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                        {/* Delete Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            remove(index);
                            // After removing, totalMembers = remaining members + head of family
                            form.setValue("totalMembers", fields.length);
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
                    قم بإدخال عدد الأفراد أو اضغط على "إضافة فرد" لإضافة أفراد
                    العائلة
                  </p>
                )}
              </div>

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
                    <FormItem className="sm:col-span-2">
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

                {/* الملاحظات */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="col-span-1 sm:col-span-2 lg:col-span-3">
                      <FormControl>
                        <Textarea
                          className="bg-white"
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

              {/* FOOTER BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 mx-auto w-full sm:w-fit">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto bg-primary min-w-[172px] text-white px-8 rounded-xl"
                >
                  <CirclePlus className="mr-2 h-4 w-4" />
                  {isPending ? t("adding") : t("add_family")}
                </Button>

                <DialogClose asChild>
                  <Button
                    type="button"
                    className="w-full sm:w-auto bg-secondary min-w-[172px] text-black px-8 rounded-xl"
                  >
                    {t("cancel")}
                  </Button>
                </DialogClose>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
