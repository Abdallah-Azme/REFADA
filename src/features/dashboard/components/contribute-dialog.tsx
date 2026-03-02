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
import { format, subYears, startOfYear, endOfYear } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Search,
  ChevronDown,
  X,
  Check,
  Loader2,
  Calendar as CalendarIcon,
  ChevronRight,
  User,
  Send,
} from "lucide-react";
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
      members: z.array(z.number()).optional(),
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
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [youngerThanLimit, setYoungerThanLimit] = useState<Date | undefined>(
    undefined,
  );
  const [olderThanLimit, setOlderThanLimit] = useState<Date | undefined>(
    undefined,
  );
  const [openFamilySearch, setOpenFamilySearch] = useState(false);
  const [expandedFamilies, setExpandedFamilies] = useState<number[]>([]);
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
      members: [],
    },
  });

  const { isSubmitting } = form.formState;

  // Get camp ID from props or URL params
  const effectiveCampId =
    campId || (params?.campId ? parseInt(params.campId as string) : null);

  // Fetch families when dialog opens or filters change
  useEffect(() => {
    if (isOpen && effectiveCampId && project) {
      const timer = setTimeout(() => {
        fetchFamilies();
      }, 500); // 500ms debounce
      return () => clearTimeout(timer);
    }
  }, [
    isOpen,
    effectiveCampId,
    project?.id,
    youngerThanLimit,
    olderThanLimit,
    dateFrom,
    dateTo,
  ]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        quantity: "",
        notes: "",
        families: [],
        members: [],
      });
      setSelectedAgeFilters([]);
      setSelectedMedicalFilters([]);
      setDateFrom(undefined);
      setDateTo(undefined);
      setYoungerThanLimit(undefined);
      setOlderThanLimit(undefined);
      setExpandedFamilies([]);
    }
  }, [isOpen, form]);

  // Fetch medical conditions when dialog opens
  useEffect(() => {
    if (isOpen && medicalConditions.length === 0) {
      fetchMedicalConditions();
    }
  }, [isOpen]);

  const fetchFamilies = async (extraParams: any = {}) => {
    if (!effectiveCampId || !project) return;

    setIsLoadingFamilies(true);
    try {
      const today = new Date();
      let from: string | undefined;
      let to: string | undefined;

      // Helper to format date for Laravel
      const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

      // 1. Direct dates
      if (dateFrom) from = formatDate(dateFrom);
      if (dateTo) to = formatDate(dateTo);

      // 2. Younger than (Born after selected date)
      if (youngerThanLimit) {
        const calculatedFrom = formatDate(youngerThanLimit);
        if (from === undefined || calculatedFrom > from) from = calculatedFrom;
        if (to === undefined) to = formatDate(today);
      }

      // 3. Older than (Born before selected date)
      if (olderThanLimit) {
        const calculatedTo = formatDate(olderThanLimit);
        if (to === undefined || calculatedTo < to) to = calculatedTo;
        if (from === undefined) from = "1900-01-01";
      }

      // 4. Fill defaults
      if (from !== undefined && to === undefined) to = formatDate(today);
      if (to !== undefined && from === undefined) from = "1900-01-01";

      const response = await getCampFamiliesApi(effectiveCampId, {
        projectId: project.id,
        year_from: from,
        year_to: to,
        ...extraParams,
      });
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
            }),
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
        members:
          data.members && data.members.length > 0 ? data.members : undefined,
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
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleMedicalFilter = (name: string) => {
    setSelectedMedicalFilters((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
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

  const toggleMember = (id: number) => {
    const currentMembers = form.getValues("members") || [];
    const newMembers = currentMembers.includes(id)
      ? currentMembers.filter((item) => item !== id)
      : [...currentMembers, id];
    form.setValue("members", newMembers);
  };

  const toggleExpandFamily = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setExpandedFamilies((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
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
        selectedMedicalFilters.includes(condition),
      );

    // OR logic: show family if it matches age OR medical condition
    return matchesAge || matchesMedical;
  });

  const selectedFamilies = form.watch("families") || [];
  const selectedMembers = form.watch("members") || [];

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[95vw] sm:w-[500px] p-0 bg-white rounded-3xl max-h-[90vh] flex flex-col">
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
                  <div className="flex flex-col gap-3">
                    <div className="relative w-full">
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
                                selectedFamilies.length > 0 ||
                                selectedMembers.length > 0
                                  ? t("selected_multiple", {
                                      count:
                                        selectedFamilies.length +
                                        selectedMembers.length,
                                    })
                                  : ""
                              }
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-3.5" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent
                          side="bottom"
                          sideOffset={8}
                          avoidCollisions={false}
                          className="w-(--radix-popover-trigger-width) min-w-[min(100%,300px)] md:min-w-[400px] max-h-[400px] overflow-hidden p-0"
                          align="end"
                          onWheel={(e) => e.stopPropagation()}
                        >
                          <Command>
                            <CommandInput
                              placeholder={t("search_family_placeholder")}
                              className="text-right"
                            />
                            <CommandList className="overflow-y-auto min-h-[min(200px,40vh)]">
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
                                        className="flex flex-col items-stretch cursor-pointer data-[selected=true]:text-white data-[selected=true]:bg-primary group [&[data-selected=true]_.text-gray-500]:text-white/90 [&[data-selected=true]_.text-gray-400]:text-white/80 [&[data-selected=true]_button]:text-white/90"
                                      >
                                        <div className="flex items-center justify-between w-full">
                                          {/* Right Side: Expand Button + Text Info */}
                                          <div className="flex items-center gap-2 flex-1 overflow-hidden">
                                            {/* Expand Button */}
                                            {family.members &&
                                              family.members.length > 0 && (
                                                <button
                                                  type="button"
                                                  onPointerDown={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleExpandFamily(
                                                      e,
                                                      family.id,
                                                    );
                                                  }}
                                                  className="p-1 shrink-0 hover:bg-gray-100 group-data-[selected=true]:hover:bg-white/20 rounded-full transition-colors"
                                                >
                                                  {expandedFamilies.includes(
                                                    family.id,
                                                  ) ? (
                                                    <ChevronDown className="h-4 w-4 text-gray-400 group-data-[selected=true]:text-white/90" />
                                                  ) : (
                                                    <ChevronRight className="h-4 w-4 text-gray-400 group-data-[selected=true]:text-white/90 rtl:rotate-180" />
                                                  )}
                                                </button>
                                              )}

                                            {/* Spacer if no expand button to align text? Optional, but keep text start aligned */}
                                            {(!family.members ||
                                              family.members.length === 0) && (
                                              <div className="w-6 shrink-0" />
                                            )}

                                            <div className="flex flex-col text-right flex-1 min-w-0">
                                              <div className="flex items-center justify-start gap-2 truncate">
                                                <span className="truncate">
                                                  {family.familyName}
                                                </span>
                                                {family.hasBenefit && (
                                                  <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full group-data-[selected=true]:bg-white/20 group-data-[selected=true]:text-white shrink-0">
                                                    {t("beneficiary_tag")}
                                                  </span>
                                                )}
                                              </div>
                                              <span className="text-xs text-gray-500 truncate">
                                                {family.nationalId} -{" "}
                                                {t("members_count", {
                                                  count: family.totalMembers,
                                                })}
                                              </span>
                                            </div>
                                          </div>

                                          {/* Left Side: Checkbox */}
                                          <div className="flex items-center justify-center shrink-0 ml-2">
                                            <div
                                              className={cn(
                                                "flex h-5 w-5 items-center justify-center rounded-sm border border-primary",
                                                selectedFamilies.includes(
                                                  family.id,
                                                )
                                                  ? "bg-primary text-primary-foreground group-data-[selected=true]:border-white group-data-[selected=true]:bg-white group-data-[selected=true]:text-primary"
                                                  : "opacity-50 group-data-[selected=true]:border-white/50",
                                              )}
                                            >
                                              <Check
                                                className={cn(
                                                  "h-3.5 w-3.5",
                                                  selectedFamilies.includes(
                                                    family.id,
                                                  )
                                                    ? "visible"
                                                    : "invisible",
                                                )}
                                              />
                                            </div>
                                          </div>
                                        </div>

                                        {/* Members List */}
                                        {expandedFamilies.includes(family.id) &&
                                          family.members &&
                                          family.members.length > 0 && (
                                            <div className="mt-2 mr-4 sm:mr-8 border-r-2 border-gray-100 group-data-[selected=true]:border-white/20 pr-4 space-y-2">
                                              {family.members.map((member) => (
                                                <div
                                                  key={member.id}
                                                  className="flex items-center justify-between w-full p-2 hover:bg-gray-50 group-data-[selected=true]:hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                                                  onPointerDown={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleMember(member.id);
                                                  }}
                                                >
                                                  {/* Right Side: Text Info */}
                                                  <div className="flex flex-col text-right flex-1 min-w-0">
                                                    <div className="flex items-center justify-start gap-2">
                                                      <User className="w-3.5 h-3.5 text-gray-400 group-data-[selected=true]:text-white/80 shrink-0" />
                                                      <span className="text-sm truncate">
                                                        {member.name}
                                                      </span>
                                                    </div>
                                                    <div className="flex gap-2 justify-start pr-5">
                                                      <span className="text-[10px] text-gray-400 group-data-[selected=true]:text-white/70">
                                                        {member.ageGroup &&
                                                          tAge(member.ageGroup)}
                                                      </span>
                                                    </div>
                                                  </div>

                                                  {/* Left Side: Checkbox */}
                                                  <div className="flex items-center gap-2 ml-2">
                                                    <div
                                                      className={cn(
                                                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                        selectedMembers.includes(
                                                          member.id,
                                                        )
                                                          ? "bg-primary text-primary-foreground group-data-[selected=true]:border-white group-data-[selected=true]:bg-white group-data-[selected=true]:text-primary"
                                                          : "opacity-50 group-data-[selected=true]:border-white/50",
                                                      )}
                                                    >
                                                      <Check
                                                        className={cn(
                                                          "h-3 w-3",
                                                          selectedMembers.includes(
                                                            member.id,
                                                          )
                                                            ? "visible"
                                                            : "invisible",
                                                        )}
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
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

                    <div className="flex flex-col gap-2">
                      {/* Year Filters */}
                      <div className="flex items-center gap-2 flex-1">
                        <div className="relative flex-1 group">
                          <DatePicker
                            value={dateFrom ? format(dateFrom, "d-M-yyyy") : ""}
                            onChange={(val) => {
                              if (!val) {
                                setDateFrom(undefined);
                                return;
                              }
                              const [d, m, y] = val.split("-").map(Number);
                              setDateFrom(new Date(y, m - 1, d));
                            }}
                            placeholder={t("date_from") || "تاريخ البداية"}
                            className="bg-white border-gray-200 h-10 rounded-xl"
                          />
                          {dateFrom && (
                            <Button
                              type="button"
                              onClick={() => setDateFrom(undefined)}
                              variant="ghost"
                              size="icon"
                              className="absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-red-500 rounded-full bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <div className="relative flex-1 group">
                          <DatePicker
                            value={dateTo ? format(dateTo, "d-M-yyyy") : ""}
                            onChange={(val) => {
                              if (!val) {
                                setDateTo(undefined);
                                return;
                              }
                              const [d, m, y] = val.split("-").map(Number);
                              setDateTo(new Date(y, m - 1, d));
                            }}
                            placeholder={t("date_to") || "تاريخ النهاية"}
                            className="bg-white border-gray-200 h-10 rounded-xl"
                          />
                          {dateTo && (
                            <Button
                              type="button"
                              onClick={() => setDateTo(undefined)}
                              variant="ghost"
                              size="icon"
                              className="absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-red-500 rounded-full bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Age Filters */}
                      <div className="flex items-center gap-2 flex-1">
                        <div className="relative flex-1 group">
                          <DatePicker
                            value={
                              youngerThanLimit
                                ? format(youngerThanLimit, "d-M-yyyy")
                                : ""
                            }
                            onChange={(val) => {
                              if (!val) {
                                setYoungerThanLimit(undefined);
                                return;
                              }
                              const [d, m, y] = val.split("-").map(Number);
                              setYoungerThanLimit(new Date(y, m - 1, d));
                            }}
                            placeholder={t("younger_than") || "أصغر من"}
                            className="bg-white border-gray-200 h-10 rounded-xl"
                          />
                          {youngerThanLimit && (
                            <Button
                              type="button"
                              onClick={() => setYoungerThanLimit(undefined)}
                              variant="ghost"
                              size="icon"
                              className="absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-red-500 rounded-full bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <div className="relative flex-1 group">
                          <DatePicker
                            value={
                              olderThanLimit
                                ? format(olderThanLimit, "d-M-yyyy")
                                : ""
                            }
                            onChange={(val) => {
                              if (!val) {
                                setOlderThanLimit(undefined);
                                return;
                              }
                              const [d, m, y] = val.split("-").map(Number);
                              setOlderThanLimit(new Date(y, m - 1, d));
                            }}
                            placeholder={t("older_than") || "أكبر من"}
                            className="bg-white border-gray-200 h-10 rounded-xl"
                          />
                          {olderThanLimit && (
                            <Button
                              type="button"
                              onClick={() => setOlderThanLimit(undefined)}
                              variant="ghost"
                              size="icon"
                              className="absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-red-500 rounded-full bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row gap-2">
                      {/* Age Groups Filter */}
                      <div className="flex items-center gap-1 flex-1">
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="bg-white border-gray-200 h-12 rounded-xl flex flex-row-reverse justify-between items-center px-3 text-gray-500 font-normal gap-1 w-full"
                            >
                              <ChevronDown className="h-4 w-4 opacity-50" />
                              <span className="truncate">{t("age_group")}</span>
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
                            onWheel={(e) => e.stopPropagation()}
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
                                      ageGroup.id,
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
                            className="h-8 w-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 shrink-0"
                            onClick={() => setSelectedAgeFilters([])}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {/* Medical Conditions Filter */}
                      <div className="flex items-center gap-1 flex-1">
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="bg-white border-gray-200 h-12 rounded-xl flex flex-row-reverse justify-between items-center px-3 text-gray-500 font-normal gap-1 w-full"
                            >
                              <ChevronDown className="h-4 w-4 opacity-50" />
                              <span className="truncate">
                                {t("medical_condition")}
                              </span>
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
                            onWheel={(e) => e.stopPropagation()}
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
                                        condition.name,
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
                            className="h-8 w-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 shrink-0"
                            onClick={() => setSelectedMedicalFilters([])}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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
