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
  FormLabel,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Users, Trash2, UserPlus, Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { MultiSelectMedical } from "@/components/ui/multi-select-medical";
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
  hideCamp?: boolean;
}

// Extended member type to track existing members (matches schema fields)
interface MemberFormData {
  id?: number; // If present, it's an existing member (database ID) - matches schema
  name: string;
  nationalId: string;
  originalNationalId?: string; // Track original national_id for existing members
  gender: "male" | "female";
  dob: string;
  relationshipId: string;
  medicalConditionIds?: string[];
  medicalConditionText?: string;
}

// ... existing interfaces ...

export default function EditFamilyDialog({
  family,
  open,
  onOpenChange,
  hideCamp = false,
}: EditFamilyDialogProps) {
  // ... existing code ...

  const t = useTranslations("families");
  const tCommon = useTranslations("common");

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
  // Track the head of family's member ID for the update API
  const [headMemberId, setHeadMemberId] = useState<number | undefined>(
    undefined,
  );

  const { mutateAsync: updateFamily, isPending } = useUpdateFamily();
  const { mutateAsync: createFamilyMember, isPending: isCreatingMember } =
    useCreateFamilyMember();
  const { mutateAsync: updateFamilyMember, isPending: isUpdatingMember } =
    useUpdateFamilyMember();
  const { mutateAsync: deleteFamilyMember, isPending: isDeletingMember } =
    useDeleteFamilyMember();

  // Fetch existing members when family changes
  const { data: membersData, isLoading: isLoadingMembers } = useFamilyMembers(
    open && family ? family.id : null,
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
      medicalConditionIds: [],
      members: [],
    },
  });

  // Populate form when family data changes
  useEffect(() => {
    if (
      family &&
      open &&
      maritalStatuses.length > 0 &&
      medicalConditions.length > 0
    ) {
      // Find IDs by matching names
      const foundCamp = camps.find((c) => c.name === family.camp);
      const foundMS = maritalStatuses.find(
        (m) => m.name === family.maritalStatus,
      );

      // Get head of family data from first member in members array
      const headMember = family.members?.[0];

      // Store the original national_id for the family (use head member's nationalId)
      setOriginalFamilyNationalId(headMember?.nationalId || family.nationalId);

      // Map head of family's medical conditions (names) to IDs
      let headMedicalConditionIds: string[] = [];
      let headMedicalConditionText: string | undefined = undefined;

      // Use head member's medical conditions if available, otherwise use family's
      const medicalConditionsToMap =
        headMember?.medicalConditions || family.medicalConditions;

      if (medicalConditionsToMap && medicalConditionsToMap.length > 0) {
        medicalConditionsToMap.forEach((conditionName: string) => {
          const foundCondition = medicalConditions.find(
            (m) => m.name === conditionName,
          );
          if (foundCondition) {
            headMedicalConditionIds.push(foundCondition.id.toString());
          } else if (conditionName) {
            // Custom condition not in list
            if (!headMedicalConditionIds.includes("other")) {
              headMedicalConditionIds.push("other");
            }
            headMedicalConditionText = conditionName;
          }
        });
      }

      // Set the "other" text if needed
      if (headMedicalConditionText) {
        setHeadOtherMedical(headMedicalConditionText);
      }

      form.reset({
        familyName: headMember?.name || family.familyName || "",
        nationalId: headMember?.nationalId || family.nationalId || "",
        dob: headMember?.dob || family.dob || "",
        phone: family.phone || "",
        backupPhone: family.backupPhone || "",
        gender: headMember?.gender || "male",
        totalMembers: family.totalMembers || 1,
        tentNumber:
          family.tentNumber === "undefined" ? "" : family.tentNumber || "",
        location: family.location === "undefined" ? "" : family.location || "",
        notes: family.notes === "undefined" ? "" : family.notes || "",
        campId: foundCamp ? foundCamp.id.toString() : "",
        maritalStatusId: foundMS ? foundMS.id.toString() : "",
        medicalConditionIds: headMedicalConditionIds,
        members: [],
      });
    }
  }, [family, open, camps, maritalStatuses, medicalConditions]);

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "members",
  });

  // Populate existing members when membersData loads
  useEffect(() => {
    if (
      membersData?.data &&
      relationships.length > 0 &&
      medicalConditions.length > 0 &&
      open
    ) {
      // Find the head of family member (relationship_id = 1) and store their ID
      const headMember = membersData.data.find((member) => {
        const foundRelationship = relationships.find(
          (r) => r.name === member.relationship,
        );
        return foundRelationship?.id === 1;
      });

      if (headMember) {
        setHeadMemberId(headMember.id);

        // Populate head of family form fields from member data
        // Map head member's medical conditions to IDs
        let headMedicalConditionIds: string[] = [];
        let headMedicalConditionText: string | undefined = undefined;

        if (
          headMember.medicalConditions &&
          headMember.medicalConditions.length > 0
        ) {
          headMember.medicalConditions.forEach((conditionName: string) => {
            const foundCondition = medicalConditions.find(
              (m) => m.name === conditionName,
            );
            if (foundCondition) {
              headMedicalConditionIds.push(foundCondition.id.toString());
            } else if (conditionName) {
              // Custom condition not in list
              if (!headMedicalConditionIds.includes("other")) {
                headMedicalConditionIds.push("other");
              }
              headMedicalConditionText = conditionName;
            }
          });
        }

        // Set the "other" text if needed
        if (headMedicalConditionText) {
          setHeadOtherMedical(headMedicalConditionText);
        }

        // Update form with head member data
        form.setValue("familyName", headMember.name || "");
        form.setValue("nationalId", headMember.nationalId || "");
        form.setValue("dob", headMember.dob || "");
        form.setValue("medicalConditionIds", headMedicalConditionIds);
      }

      // Filter out head of family (relationship "أب" or id 1) since they're already in the main form
      const nonHeadMembers = membersData.data.filter((member) => {
        const foundRelationship = relationships.find(
          (r) => r.name === member.relationship,
        );
        // Skip if this is the head of family (relationship_id = 1)
        return foundRelationship?.id !== 1;
      });

      const existingMembers = nonHeadMembers.map((member) => {
        // Find relationship ID by matching name
        const foundRelationship = relationships.find(
          (r) => r.name === member.relationship,
        );

        // Handle medical condition mapping - support both array and legacy string format
        let medicalConditionIds: string[] = [];
        let medicalConditionText: string | undefined = undefined;

        // Get conditions from API response, fallback to family prop if missing (since list API might be more up-to-date)
        let memberConditions = member.medicalConditions;
        if (!memberConditions || memberConditions.length === 0) {
          const propMember = family?.members?.find((m) => m.id === member.id);
          if (
            propMember?.medicalConditions &&
            propMember.medicalConditions.length > 0
          ) {
            memberConditions = propMember.medicalConditions;
          }
        }

        // Check for new array format first (medicalConditions)
        if (memberConditions && memberConditions.length > 0) {
          // Map each condition name to its ID
          memberConditions.forEach((conditionName: string) => {
            const foundCondition = medicalConditions.find(
              (m) => m.name === conditionName,
            );
            if (foundCondition) {
              medicalConditionIds.push(foundCondition.id.toString());
            } else if (conditionName) {
              // Custom condition not in list
              if (!medicalConditionIds.includes("other")) {
                medicalConditionIds.push("other");
              }
              medicalConditionText = conditionName;
            }
          });
        } else if (member.medicalCondition) {
          // Legacy single string format fallback
          const foundMedicalCondition = medicalConditions.find(
            (m) => m.name === member.medicalCondition,
          );

          if (foundMedicalCondition) {
            medicalConditionIds = [foundMedicalCondition.id.toString()];
          } else {
            medicalConditionIds = ["other"];
            medicalConditionText = member.medicalCondition;
          }
        }
        // If both null/empty, leave medicalConditionIds as empty array (no conditions selected)

        return {
          id: member.id, // Track existing member database ID (matches schema)
          name: member.name,
          nationalId: member.nationalId,
          originalNationalId: member.nationalId, // Store original for comparison
          gender: member.gender,
          dob: member.dob,
          relationshipId: foundRelationship
            ? foundRelationship.id.toString()
            : "",
          medicalConditionIds,
          medicalConditionText,
        };
      });

      // Use replace from useFieldArray for proper synchronization
      replace(existingMembers as any);
      form.setValue("totalMembers", existingMembers.length + 1);
    }
  }, [membersData, relationships, medicalConditions, open, replace, form]);

  const onSubmit = async (values: z.infer<typeof familySchema>) => {
    if (!family) return;

    try {
      // Prepare form values - send everything through single endpoint
      const dataToSubmit = {
        ...values,
        // Add the head of family's custom medical condition text if "other" is selected
        medicalConditionText: values.medicalConditionIds?.includes("other")
          ? headOtherMedical
          : undefined,
        // Transform members to include their database IDs and correct format
        members: (values.members as MemberFormData[] | undefined)?.map(
          (member) => ({
            id: member.id, // Use id as the database ID (undefined for new members)
            name: member.name,
            nationalId: member.nationalId,
            originalNationalId: member.originalNationalId,
            gender: member.gender,
            dob: member.dob,
            relationshipId: member.relationshipId,
            medicalConditionIds: member.medicalConditionIds || [],
            medicalConditionText: member.medicalConditionIds?.includes("other")
              ? member.medicalConditionText
              : undefined,
          }),
        ),
      };

      // Update family with all data in one request per backend spec
      await updateFamily({
        id: family.id,
        data: dataToSubmit,
        originalNationalId: originalFamilyNationalId,
        headMemberId: headMemberId,
      });

      toast.success(t("toast.update_success"));
      onOpenChange(false);
      // Reset form with default values
      form.reset({
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
        medicalConditionIds: [],
        members: [],
      });
      // Clear the members array
      replace([]);
      setHeadOtherMedical("");
      setHeadMemberId(undefined);
      setOriginalFamilyNationalId("");
    } catch (error: any) {
      console.error("Error updating family:", error);
      toast.error(t("toast.update_error"));
    }
  };

  const addMember = () => {
    append({
      name: "",
      nationalId: "",
      gender: "male",
      dob: "",
      relationshipId: "",
      medicalConditionIds: [],
    });
    form.setValue("totalMembers", fields.length + 2);
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
      form.setValue("totalMembers", fields.length);
    }
  };

  const confirmDeleteMember = async () => {
    if (memberToDelete) {
      if (memberToDelete.id) {
        // Immediately delete via API
        try {
          await deleteFamilyMember({
            familyId: family!.id,
            memberId: memberToDelete.id,
          });
        } catch (error) {
          toast.error(t("toast.member_delete_error"));
          setDeleteDialogOpen(false);
          setMemberToDelete(null);
          return; // Don't remove from form if API call failed
        }
      }
      remove(memberToDelete.index);
      form.setValue("totalMembers", fields.length);
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const isSubmitting =
    isPending || isCreatingMember || isUpdatingMember || isDeletingMember;

  // Handle dialog close - reset form when closing
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      // Reset form when dialog closes
      form.reset({
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
        medicalConditionIds: [],
        members: [],
      });
      replace([]);
      setHeadOtherMedical("");
      setOriginalFamilyNationalId("");
      setMemberToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="rounded-md overflow-hidden max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <DialogTitle className="text-xl font-semibold flex gap-1 items-center">
              <Users className="w-6 h-6 text-primary" />
              {t("update_family_title")}
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
                      <FormLabel className="text-xs text-gray-600">
                        {t("full_name")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder={t("full_name")}
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
                      <FormLabel className="text-xs text-gray-600">
                        {t("national_id")}
                      </FormLabel>
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
                      <FormLabel className="text-xs text-gray-600">
                        {t("dob_label")}
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder={t("dob_label")}
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
                      <FormLabel className="text-xs text-gray-600">
                        {t("phone")}
                      </FormLabel>
                      <FormControl>
                        <PhoneInput
                          className="[&_input]:bg-white [&_button]:bg-white"
                          placeholder={t("phone")}
                          value={field.value}
                          onChange={field.onChange}
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
                      <FormLabel className="text-xs text-gray-600">
                        {t("backup_phone")}
                      </FormLabel>
                      <FormControl>
                        <PhoneInput
                          className="[&_input]:bg-white [&_button]:bg-white"
                          placeholder={t("backup_phone")}
                          value={field.value || ""}
                          onChange={field.onChange}
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
                      <FormLabel className="text-xs text-gray-600">
                        {t("gender")}
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full bg-white">
                            {field.value === "male"
                              ? t("male")
                              : field.value === "female"
                                ? t("female")
                                : t("gender")}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">{t("male")}</SelectItem>
                            <SelectItem value="female">
                              {t("female")}
                            </SelectItem>
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
                      <FormLabel className="text-xs text-gray-600">
                        {t("marital_status")}
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full bg-white">
                            {field.value
                              ? maritalStatuses.find(
                                  (s) => s.id.toString() === field.value,
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
                {!hideCamp && (
                  <FormField
                    control={form.control}
                    name="campId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-600">
                          {t("camp")}
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full bg-white">
                              {field.value
                                ? (() => {
                                    const camp = camps.find(
                                      (c) => c.id.toString() === field.value,
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
                )}

                {/* عدد الأفراد */}
                <FormField
                  control={form.control}
                  name="totalMembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-gray-600">
                        {t("members_count_label")}
                      </FormLabel>
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
                  name="medicalConditionIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-gray-600">
                        {t("medical_condition")}
                      </FormLabel>
                      <FormControl>
                        <MultiSelectMedical
                          conditions={medicalConditions}
                          selectedIds={field.value || []}
                          onSelectionChange={(ids) => {
                            field.onChange(ids);
                            if (!ids.includes("other")) {
                              setHeadOtherMedical("");
                            }
                          }}
                          otherText={headOtherMedical}
                          onOtherTextChange={setHeadOtherMedical}
                          placeholder={t("medical_condition")}
                          healthyLabel={t("healthy")}
                          otherLabel={t("other")}
                          otherPlaceholder={t("enter_medical_condition")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* LOCATION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-[#F4F4F4] p-4 rounded-xl gap-4">
                {/* رقم الخيمة */}
                <FormField
                  control={form.control}
                  name="tentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-gray-600">
                        {t("tent_number")}{" "}
                        <span className="text-gray-400">({t("optional")})</span>
                      </FormLabel>
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
                      <FormLabel className="text-xs text-gray-600">
                        {t("location")}{" "}
                        <span className="text-gray-400">({t("optional")})</span>
                      </FormLabel>
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
                      <FormLabel className="text-xs text-gray-600">
                        {t("notes_title")}{" "}
                        <span className="text-gray-400">({t("optional")})</span>
                      </FormLabel>
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
                  <p className="text-sm font-medium">
                    {t("family_members_section")}
                  </p>
                </div>

                {/* Loading State */}
                {isLoadingMembers && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="mr-2 text-sm text-gray-600">
                      {tCommon("loading")}
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
                                  <Input
                                    placeholder={t("name_label")}
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
                            name={`members.${index}.nationalId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder={t("national_id")}
                                    {...field}
                                  />
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
                                        ? t("male")
                                        : field.value === "female"
                                          ? t("female")
                                          : t("gender")}
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="male">
                                        {t("male")}
                                      </SelectItem>
                                      <SelectItem value="female">
                                        {t("female")}
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
                                              r.id.toString() === field.value,
                                          )?.name || t("relationship")
                                        : t("relationship")}
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
                                    placeholder={t("dob_label")}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* الحالة الصحية */}
                          <FormField
                            control={form.control}
                            name={`members.${index}.medicalConditionIds`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <MultiSelectMedical
                                    conditions={medicalConditions}
                                    selectedIds={field.value || []}
                                    onSelectionChange={(ids) => {
                                      field.onChange(ids);
                                      if (!ids.includes("other")) {
                                        form.setValue(
                                          `members.${index}.medicalConditionText`,
                                          undefined,
                                        );
                                      }
                                    }}
                                    otherText={
                                      form.watch(
                                        `members.${index}.medicalConditionText`,
                                      ) || ""
                                    }
                                    onOtherTextChange={(text) =>
                                      form.setValue(
                                        `members.${index}.medicalConditionText`,
                                        text,
                                      )
                                    }
                                    placeholder={t("medical_condition")}
                                    healthyLabel={t("healthy")}
                                    otherLabel={t("other")}
                                    otherPlaceholder={t(
                                      "enter_medical_condition",
                                    )}
                                  />
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
                    {t("add_member_prompt")}
                  </p>
                )}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMember}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    <UserPlus className="w-4 h-4 ml-2" />
                    {t("add_member_btn")}
                  </Button>
                </div>
              </div>

              {/* FOOTER BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 mx-auto w-full sm:w-fit">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 text-gray-600 px-8"
                  onClick={() => onOpenChange(false)}
                >
                  {tCommon("cancel")}
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-white px-8"
                >
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {t("save_changes")}
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
        title={t("delete_member_title")}
        description={t("delete_member_desc")}
        isPending={false}
      />
    </>
  );
}
