"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Search, Send, ChevronDown, Check, Loader2, X } from "lucide-react";
import { Project } from "../table-cols/project-contribution-cols";
import { useState, useEffect, useMemo } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  getCampFamiliesApi,
  submitContributionApi,
  getMedicalConditionsApi,
  CampFamily,
  MedicalCondition,
} from "@/features/contributors/api/contributors.api";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";

interface ContributeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  campId?: number;
}

export default function ContributeDialog({
  isOpen,
  onClose,
  project,
  campId,
}: ContributeDialogProps) {
  const params = useParams();
  const t = useTranslations("contributions.contribute_dialog");
  const tAge = useTranslations("contributions.age_groups");

  // Schema with translations
  const contributeSchema = useMemo(() => {
    return z.object({
      quantity: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: t("quantity_validation"),
        }),
      notes: z.string().optional(),
      families: z.array(z.number()).optional(),
    });
  }, [t]);

  type ContributeFormValues = z.infer<typeof contributeSchema>;

  // Age group filter options
  const ageGroupOptions = [
    { id: "newborns", name: tAge("newborns") },
    { id: "infants", name: tAge("infants") },
    { id: "veryEarlyChildhood", name: tAge("veryEarlyChildhood") },
    { id: "toddlers", name: tAge("toddlers") },
    { id: "earlyChildhood", name: tAge("earlyChildhood") },
    { id: "children", name: tAge("children") },
    { id: "adolescents", name: tAge("adolescents") },
    { id: "youth", name: tAge("youth") },
    { id: "youngAdults", name: tAge("youngAdults") },
    { id: "middleAgeAdults", name: tAge("middleAgeAdults") },
    { id: "lateMiddleAge", name: tAge("lateMiddleAge") },
    { id: "seniors", name: tAge("seniors") },
  ];

  // Keep local state for data that is fetched (options)
  const [selectedAgeFilters, setSelectedAgeFilters] = useState<string[]>([]);
  const [selectedMedicalFilters, setSelectedMedicalFilters] = useState<
    string[]
  >([]);
  const [openFamilySearch, setOpenFamilySearch] = useState(false);
  const [families, setFamilies] = useState<CampFamily[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<
    MedicalCondition[]
  >([]);
  const [isLoadingFamilies, setIsLoadingFamilies] = useState(false);
  const [isLoadingConditions, setIsLoadingConditions] = useState(false);

  // Form setup
  const form = useForm<ContributeFormValues>({
    resolver: zodResolver(contributeSchema),
    defaultValues: {
      quantity: "",
      notes: "",
      families: [],
    },
  });

  const { isSubmitting } = form.formState;

  // Get camp ID from props or URL params
  const effectiveCampId =
    campId || (params?.campId ? parseInt(params.campId as string) : null);

  // Fetch families when dialog opens
  useEffect(() => {
    if (isOpen && effectiveCampId && project) {
      fetchFamilies();
    }
  }, [isOpen, effectiveCampId, project?.id]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        quantity: "",
        notes: "",
        families: [],
      });
      setSelectedAgeFilters([]);
      setSelectedMedicalFilters([]);
    }
  }, [isOpen, form]);

  // Fetch medical conditions when dialog opens
  useEffect(() => {
    if (isOpen && medicalConditions.length === 0) {
      fetchMedicalConditions();
    }
  }, [isOpen]);

  const fetchFamilies = async () => {
    if (!effectiveCampId || !project) return;

    setIsLoadingFamilies(true);
    try {
      const response = await getCampFamiliesApi(effectiveCampId, project.id);
      if (response.success) {
        // @ts-ignore
        const familiesData = response.data?.families || [];
        setFamilies(Array.isArray(familiesData) ? familiesData : []);

        // Also extract medical conditions from here if available
        // @ts-ignore
        const conditionsData = response.data?.medicalConditions || [];
        if (
          Array.isArray(conditionsData) &&
          conditionsData.length > 0 &&
          medicalConditions.length === 0
        ) {
          const mappedConditions = conditionsData.map(
            (name: string, index: number) => ({
              id: index + 2000,
              name: String(name),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
          );
          setMedicalConditions(mappedConditions);
        }
      }
    } catch (error) {
      console.error("Failed to fetch families:", error);
      toast.error(t("fetch_families_error"));
    } finally {
      setIsLoadingFamilies(false);
    }
  };

  const fetchMedicalConditions = async () => {
    setIsLoadingConditions(true);
    try {
      const response = await getMedicalConditionsApi();
      if (response.success) {
        setMedicalConditions(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch medical conditions:", error);
      toast.error(t("fetch_conditions_error"));
    } finally {
      setIsLoadingConditions(false);
    }
  };

  const onSubmit = async (data: ContributeFormValues) => {
    if (!project) return;

    try {
      const response = await submitContributionApi({
        projectId: project.id,
        contributedQuantity: parseInt(data.quantity),
        notes: data.notes || undefined,
        families:
          data.families && data.families.length > 0 ? data.families : undefined,
      });

      if (response.success) {
        toast.success(response.message || t("success_message"));
        onClose();
      }
    } catch (error: any) {
      console.error("Failed to submit contribution:", error);
      toast.error(error?.message || t("error_message"));
    }
  };

  if (!project) return null;

  const toggleAgeFilter = (id: string) => {
    setSelectedAgeFilters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleMedicalFilter = (name: string) => {
    setSelectedMedicalFilters((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  // Helper to toggle family selection in form
  const toggleFamily = (id: number) => {
    const currentFamilies = form.getValues("families") || [];
    const newFamilies = currentFamilies.includes(id)
      ? currentFamilies.filter((item) => item !== id)
      : [...currentFamilies, id];
    form.setValue("families", newFamilies);
  };

  // Filter families based on selected age groups and medical conditions (OR logic)
  const filteredFamilies = families.filter((family) => {
    // If no filters selected, show all families
    if (
      selectedAgeFilters.length === 0 &&
      selectedMedicalFilters.length === 0
    ) {
      return true;
    }

    // Check age group filter
    const matchesAge =
      selectedAgeFilters.length > 0 &&
      family.ageGroups &&
      family.ageGroups.some((age: string) => selectedAgeFilters.includes(age));

    // Check medical condition filter
    const matchesMedical =
      selectedMedicalFilters.length > 0 &&
      family.medicalConditions &&
      family.medicalConditions.some((condition: string) =>
        selectedMedicalFilters.includes(condition)
      );

    // OR logic: show family if it matches age OR medical condition
    return matchesAge || matchesMedical;
  });

  const selectedFamilies = form.watch("families") || [];

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[500px] p-0 bg-white rounded-3xl max-h-[90vh] flex flex-col">
        <div className="shrink-0 p-6 pb-0">
          <DialogHeader className="flex flex-row items-center justify-between mb-6">
            <DialogTitle className="text-xl font-bold text-center w-full text-gray-800">
              {project.name}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6 bg-gray-50/50 p-6 rounded-xl">
                {/* Quantity Input */}
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-600 block text-right">
                        {t("quantity_label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t("quantity_placeholder")}
                          className="bg-white border-gray-200 text-right h-12 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />

                {/* Beneficiary Families Search */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800 block text-right">
                    {t("beneficiary_families")}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Popover
                        open={openFamilySearch}
                        onOpenChange={setOpenFamilySearch}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <div className="relative w-full">
                            <Input
                              placeholder={t("enter_family_name")}
                              className="bg-white border-gray-200 text-right h-12 rounded-xl pr-10 cursor-pointer"
                              readOnly
                              value={
                                selectedFamilies.length > 0
                                  ? selectedFamilies.length === 1
                                    ? t("selected_one")
                                    : t("selected_multiple", {
                                        count: selectedFamilies.length,
                                      })
                                  : ""
                              }
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-3.5" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[300px]" align="end">
                          <Command>
                            <CommandInput
                              placeholder={t("search_family_placeholder")}
                              className="text-right"
                            />
                            <CommandList className="max-h-[300px] overflow-y-auto">
                              {isLoadingFamilies ? (
                                <div className="flex items-center justify-center py-6">
                                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                              ) : (
                                <>
                                  <CommandEmpty>{t("no_results")}</CommandEmpty>
                                  <CommandGroup>
                                    {filteredFamilies.map((family) => (
                                      <CommandItem
                                        key={family.id}
                                        value={`${family.familyName} ${family.nationalId}`}
                                        onSelect={() => toggleFamily(family.id)}
                                        className="flex items-center justify-between cursor-pointer"
                                      >
                                        <div className="flex flex-col text-right flex-1">
                                          <div className="flex items-center gap-2">
                                            <span>{family.familyName}</span>
                                            {family.hasBenefit && (
                                              <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full">
                                                {t("beneficiary_tag")}
                                              </span>
                                            )}
                                          </div>
                                          <span className="text-xs text-gray-500">
                                            {family.nationalId} -{" "}
                                            {t("members_count", {
                                              count: family.totalMembers,
                                            })}
                                          </span>
                                        </div>
                                        <div
                                          className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                            selectedFamilies.includes(family.id)
                                              ? "bg-primary text-primary-foreground"
                                              : "opacity-50 [&_svg]:invisible"
                                          )}
                                        >
                                          <Check className={cn("h-4 w-4")} />
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Age Groups Filter */}
                    <div className="flex items-center gap-1">
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="bg-white border-gray-200 h-12 rounded-xl flex flex-row-reverse justify-between items-center px-3 text-gray-500 font-normal gap-1"
                          >
                            <ChevronDown className="h-4 w-4 opacity-50" />
                            <span>{t("age_group")}</span>
                            {selectedAgeFilters.length > 0 && (
                              <span className="bg-primary text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px]">
                                {selectedAgeFilters.length}
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[200px] p-2 bg-white rounded-xl shadow-lg max-h-[300px] overflow-y-auto"
                          align="end"
                        >
                          <div className="flex flex-col gap-2">
                            {ageGroupOptions.map((ageGroup) => (
                              <div
                                key={ageGroup.id}
                                className="flex items-center justify-between gap-2 p-1 hover:bg-gray-50 rounded-md cursor-pointer"
                                onClick={() => toggleAgeFilter(ageGroup.id)}
                              >
                                <label
                                  htmlFor={ageGroup.id}
                                  className="text-sm text-gray-700 cursor-pointer select-none"
                                >
                                  {ageGroup.name}
                                </label>
                                <Checkbox
                                  id={ageGroup.id}
                                  checked={selectedAgeFilters.includes(
                                    ageGroup.id
                                  )}
                                  onCheckedChange={() =>
                                    toggleAgeFilter(ageGroup.id)
                                  }
                                  className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      {selectedAgeFilters.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500"
                          onClick={() => setSelectedAgeFilters([])}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Medical Conditions Filter */}
                    <div className="flex items-center gap-1">
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="bg-white border-gray-200 h-12 rounded-xl flex flex-row-reverse justify-between items-center px-3 text-gray-500 font-normal gap-1"
                          >
                            <ChevronDown className="h-4 w-4 opacity-50" />
                            <span>{t("medical_condition")}</span>
                            {selectedMedicalFilters.length > 0 && (
                              <span className="bg-primary text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px]">
                                {selectedMedicalFilters.length}
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[200px] p-2 bg-white rounded-xl shadow-lg max-h-[300px] overflow-y-auto"
                          align="end"
                        >
                          <div className="flex flex-col gap-2">
                            {isLoadingConditions ? (
                              <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                              </div>
                            ) : medicalConditions.length > 0 ? (
                              medicalConditions.map((condition) => (
                                <div
                                  key={condition.id}
                                  className="flex items-center justify-between gap-2 p-1 hover:bg-gray-50 rounded-md cursor-pointer"
                                  onClick={() =>
                                    toggleMedicalFilter(condition.name)
                                  }
                                >
                                  <label
                                    htmlFor={`medical-${condition.id}`}
                                    className="text-sm text-gray-700 cursor-pointer select-none"
                                  >
                                    {condition.name}
                                  </label>
                                  <Checkbox
                                    id={`medical-${condition.id}`}
                                    checked={selectedMedicalFilters.includes(
                                      condition.name
                                    )}
                                    onCheckedChange={() =>
                                      toggleMedicalFilter(condition.name)
                                    }
                                    className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                  />
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 text-center py-2">
                                {t("no_conditions")}
                              </p>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                      {selectedMedicalFilters.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500"
                          onClick={() => setSelectedMedicalFilters([])}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes Input */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={t("notes_placeholder")}
                          className="bg-white border-gray-200 text-right min-h-[60px] rounded-xl resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Send Button */}
              <div className="mt-6 flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#1B2540] hover:bg-[#2c3b60] text-white rounded-xl px-12 py-6 text-base font-medium flex items-center gap-2 min-w-[200px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t("submitting")}
                    </>
                  ) : (
                    <>
                      {t("submit")}
                      <Send className="w-5 h-5 rtl:-scale-x-100" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
