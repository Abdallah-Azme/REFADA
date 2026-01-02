"use client";

import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
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

import { Users, Trash2, UserPlus, Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { familySchema, Family } from "@/features/families/types/family.schema";
import { useUpdateFamily } from "@/features/families/hooks/use-families";
import { useCreateFamilyMember } from "@/features/families/hooks/use-create-family-member";
import { useUpdateFamilyMember } from "@/features/families/hooks/use-update-family-member";
import { useDeleteFamilyMember } from "@/features/families/hooks/use-delete-family-member";
import { useFamilyMembers } from "@/features/families/hooks/use-family-members";
import { useCamps } from "@/features/camps";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import { useRelationships } from "@/features/families/hooks/use-relationships";
import { useMaritalStatuses } from "@/features/families/hooks/use-marital-statuses";
import { useMedicalConditions } from "@/features/families/hooks/use-medical-conditions";
import { DeleteConfirmDialog } from "@/features/marital-status";

interface EditFamilyDialogProps {
  family: Family | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Extended member type to track existing members
interface MemberFormData {
  id?: number; // If present, it's an existing member
  name: string;
  nationalId: string;
  originalNationalId?: string; // Track original national_id for existing members
  gender: "male" | "female";
  dob: string;
  relationshipId: string;
  medicalConditionId?: string;
}

export default function EditFamilyDialog({
  family,
  open,
  onOpenChange,
}: EditFamilyDialogProps) {
  const t = useTranslations("families");
  const [membersToDelete, setMembersToDelete] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{
    index: number;
    id?: number;
  } | null>(null);
  // Track original national_id values to avoid backend unique validation errors
  const [originalFamilyNationalId, setOriginalFamilyNationalId] =
    useState<string>("");
  // Track "Other" medical condition selection for head of family
  const [headOtherMedical, setHeadOtherMedical] = useState("");
  // Track "Other" medical condition selection for each member (by index)
  const [memberOtherMedicals, setMemberOtherMedicals] = useState<
    Record<number, string>
  >({});

  const { mutateAsync: updateFamily, isPending } = useUpdateFamily();
  const { mutateAsync: createFamilyMember, isPending: isCreatingMember } =
    useCreateFamilyMember();
  const { mutateAsync: updateFamilyMember, isPending: isUpdatingMember } =
    useUpdateFamilyMember();
  const { mutateAsync: deleteFamilyMember, isPending: isDeletingMember } =
    useDeleteFamilyMember();

  // Fetch existing members when family changes
  const { data: membersData, isLoading: isLoadingMembers } = useFamilyMembers(
    open && family ? family.id : null
  );

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
      gender: "male",
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

      // Store the original national_id for the family
      setOriginalFamilyNationalId(family.nationalId || "");

      form.reset({
        familyName: family.familyName || "",
        nationalId: family.nationalId || "",
        dob: family.dob || "",
        phone: family.phone || "",
        backupPhone: family.backupPhone || "",
        gender: "male", // Default to male for head of family when editing
        totalMembers: family.totalMembers || 1,
        tentNumber: family.tentNumber || "",
        location: family.location || "",
        notes: family.notes || "",
        campId: foundCamp ? foundCamp.id.toString() : "",
        maritalStatusId: foundMS ? foundMS.id.toString() : "",
        medicalConditionId: "none",
        members: [],
      });

      // Clear members to delete when dialog opens
      setMembersToDelete([]);
    }
  }, [family, open, camps, maritalStatuses, form]);

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "members",
  });

  // Populate existing members when membersData loads
  useEffect(() => {
    if (membersData?.data && relationships.length > 0 && open) {
      // Filter out head of family (relationship "أب" or id 1) since they're already in the main form
      const nonHeadMembers = membersData.data.filter((member) => {
        const foundRelationship = relationships.find(
          (r) => r.name === member.relationship
        );
        // Skip if this is the head of family (relationship_id = 1)
        return foundRelationship?.id !== 1;
      });

      const existingMembers = nonHeadMembers.map((member) => {
        // Find relationship ID by matching name
        const foundRelationship = relationships.find(
          (r) => r.name === member.relationship
        );
        // Find medical condition ID by matching name
        const foundMedicalCondition = member.medicalCondition
          ? medicalConditions.find((m) => m.name === member.medicalCondition)
          : null;

        return {
          id: member.id, // Track existing member ID
          name: member.name,
          nationalId: member.nationalId,
          originalNationalId: member.nationalId, // Store original for comparison
          gender: member.gender,
          dob: member.dob,
          relationshipId: foundRelationship
            ? foundRelationship.id.toString()
            : "",
          medicalConditionId: foundMedicalCondition
            ? foundMedicalCondition.id.toString()
            : "none",
        };
      });

      // Use replace from useFieldArray for proper synchronization
      replace(existingMembers as any);
      form.setValue("totalMembers", existingMembers.length);
    }
  }, [membersData, relationships, medicalConditions, open, replace, form]);

  const onSubmit = async (values: z.infer<typeof familySchema>) => {
    if (!family) return;

    try {
      // 1. Update the family basic info
      await updateFamily({
        id: family.id,
        data: values,
        originalNationalId: originalFamilyNationalId,
      });

      // 2. Delete members marked for deletion
      for (const memberId of membersToDelete) {
        await deleteFamilyMember({ familyId: family.id, memberId });
      }

      // 3. Process members (create new, update existing)
      if (values.members && values.members.length > 0) {
        for (const member of values.members as MemberFormData[]) {
          if (member.name && member.nationalId) {
            const memberData = {
              name: member.name,
              nationalId: member.nationalId,
              gender: member.gender,
              dob: member.dob,
              relationshipId: member.relationshipId,
              medicalConditionId: member.medicalConditionId,
              medicalConditionText:
                member.medicalConditionId === "other"
                  ? (member as any).medicalConditionText ||
                    memberOtherMedicals[
                      (values.members as any[]).indexOf(member)
                    ]
                  : undefined,
            };

            if (member.id) {
              // Update existing member - pass original national_id to avoid unique validation error
              await updateFamilyMember({
                familyId: family.id,
                memberId: member.id,
                data: memberData,
                originalNationalId: member.originalNationalId,
              });
            } else {
              // Create new member
              await createFamilyMember({
                familyId: family.id,
                data: memberData,
              });
            }
          }
        }
      }

      toast.success("تم تعديل بيانات العائلة بنجاح");
      onOpenChange(false);
      form.reset();
      setMembersToDelete([]);
      setHeadOtherMedical("");
      setMemberOtherMedicals({});
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

  const handleDeleteMember = (index: number) => {
    const member = fields[index] as any;
    if (member.id) {
      // Existing member - show confirmation dialog
      setMemberToDelete({ index, id: member.id });
      setDeleteDialogOpen(true);
    } else {
      // New member - just remove from form
      remove(index);
      form.setValue("totalMembers", fields.length - 1);
    }
  };

  const confirmDeleteMember = () => {
    if (memberToDelete) {
      if (memberToDelete.id) {
        // Add to delete list (will be deleted on save)
        setMembersToDelete((prev) => [...prev, memberToDelete.id!]);
      }
      remove(memberToDelete.index);
      form.setValue("totalMembers", fields.length - 1);
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const isSubmitting =
    isPending || isCreatingMember || isUpdatingMember || isDeletingMember;

  return (
    <>
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
              onSubmit={form.handleSubmit(onSubmit)}
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

                {/* النوع (رب الأسرة) */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
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
                              ? (() => {
                                  const camp = camps.find(
                                    (c) => c.id.toString() === field.value
                                  );
                                  if (!camp) return t("camp");
                                  const name = camp.name;
                                  return typeof name === "string"
                                    ? name
                                    : name?.ar || name?.en || t("camp");
                                })()
                              : t("camp")}
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
                          disabled
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
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value !== "other") {
                              setHeadOtherMedical("");
                            }
                          }}
                          value={field.value || "none"}
                        >
                          <SelectTrigger className="w-full bg-white">
                            {field.value === "other"
                              ? "أخرى"
                              : field.value && field.value !== "none"
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
                            <SelectItem value="other">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Custom medical condition input for "Other" selection */}
                {form.watch("medicalConditionId") === "other" && (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="أدخل الحالة الصحية"
                        value={headOtherMedical}
                        onChange={(e) => setHeadOtherMedical(e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
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

                {/* Loading State */}
                {isLoadingMembers && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="mr-2 text-sm text-gray-600">
                      جاري تحميل أفراد العائلة...
                    </span>
                  </div>
                )}

                {/* Member Rows */}
                {!isLoadingMembers && fields.length > 0 && (
                  <div className="space-y-3">
                    {fields.map((field, index) => {
                      const isExisting = !!(field as any).id;
                      return (
                        <div
                          key={field.id}
                          className={`grid grid-cols-1 sm:grid-cols-7 gap-3 items-start bg-white p-3 rounded-lg ${
                            isExisting ? "border-r-4 border-primary" : ""
                          }`}
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
                                    value={field.value}
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
                                      <SelectItem value="female">
                                        أنثى
                                      </SelectItem>
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
                                    value={field.value}
                                  >
                                    <SelectTrigger className="w-full">
                                      {field.value
                                        ? relationships.find(
                                            (r) =>
                                              r.id.toString() === field.value
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
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      if (value !== "other") {
                                        setMemberOtherMedicals((prev) => {
                                          const updated = { ...prev };
                                          delete updated[index];
                                          return updated;
                                        });
                                      }
                                    }}
                                    value={field.value || "none"}
                                  >
                                    <SelectTrigger className="w-full">
                                      {field.value === "other"
                                        ? "أخرى"
                                        : field.value && field.value !== "none"
                                        ? medicalConditions.find(
                                            (m) =>
                                              m.id.toString() === field.value
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
                                      <SelectItem value="other">
                                        أخرى
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Custom medical condition input for "Other" selection for members */}
                          {form.watch(`members.${index}.medicalConditionId`) ===
                            "other" && (
                            <FormItem className="sm:col-span-7 mt-2">
                              <FormControl>
                                <Input
                                  placeholder="أدخل الحالة الصحية"
                                  value={memberOtherMedicals[index] || ""}
                                  onChange={(e) =>
                                    setMemberOtherMedicals((prev) => ({
                                      ...prev,
                                      [index]: e.target.value,
                                    }))
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}

                          {/* Delete Button */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMember(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 self-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!isLoadingMembers && fields.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    اضغط على &quot;إضافة فرد&quot; لإضافة أفراد العائلة
                  </p>
                )}

                {membersToDelete.length > 0 && (
                  <p className="text-sm text-amber-600 text-center">
                    سيتم حذف {membersToDelete.length} فرد عند حفظ التغييرات
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
                  disabled={isSubmitting}
                  className="bg-primary text-white px-8"
                >
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  حفظ التغييرات
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Member Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteMember}
        title="حذف فرد من العائلة"
        description="هل أنت متأكد من حذف هذا الفرد؟ سيتم حذفه نهائياً عند حفظ التغييرات."
        isPending={false}
      />
    </>
  );
}
