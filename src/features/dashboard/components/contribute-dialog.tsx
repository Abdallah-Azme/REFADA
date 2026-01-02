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
import { Search, Send, ChevronDown, Check, Loader2 } from "lucide-react";
import { Project } from "../table-cols/project-contribution-cols";
import { useState, useEffect } from "react";
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

interface ContributeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  campId?: number;
}

const contributeSchema = z.object({
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "يرجى إدخال كمية صالحة",
  }),
  notes: z.string().optional(),
  families: z.array(z.number()).optional(),
});

type ContributeFormValues = z.infer<typeof contributeSchema>;

export default function ContributeDialog({
  isOpen,
  onClose,
  project,
  campId,
}: ContributeDialogProps) {
  const params = useParams();

  // Keep local state for data that is fetched (options)
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
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
    if (isOpen && effectiveCampId) {
      fetchFamilies();
    }
  }, [isOpen, effectiveCampId]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        quantity: "",
        notes: "",
        families: [],
      });
      setSelectedFilters([]);
    }
  }, [isOpen, form]);

  // Fetch medical conditions when dialog opens
  useEffect(() => {
    if (isOpen && medicalConditions.length === 0) {
      fetchMedicalConditions();
    }
  }, [isOpen]);

  const fetchFamilies = async () => {
    if (!effectiveCampId) return;

    setIsLoadingFamilies(true);
    try {
      const response = await getCampFamiliesApi(effectiveCampId);
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
      toast.error("فشل في جلب قائمة العائلات");
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
        toast.success(response.message || "تم إرسال المساهمة بنجاح");
        onClose();
      }
    } catch (error: any) {
      console.error("Failed to submit contribution:", error);
      toast.error(error?.message || "فشل في إرسال المساهمة");
    }
  };

  if (!project) return null;

  const toggleFilter = (id: number) => {
    setSelectedFilters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
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

  const selectedFamilies = form.watch("families") || [];

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden bg-white rounded-3xl">
        <div className="p-6">
          <DialogHeader className="flex flex-row items-center justify-between mb-6">
            <DialogTitle className="text-xl font-bold text-center w-full text-gray-800">
              {project.name}
            </DialogTitle>
          </DialogHeader>

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
                        من فضلك ادخل الكمية التي تريد المساهمة بها
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="العدد"
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
                    العائلات المستفيدة
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Popover
                        open={openFamilySearch}
                        onOpenChange={setOpenFamilySearch}
                      >
                        <PopoverTrigger asChild>
                          <div className="relative w-full">
                            <Input
                              placeholder="ادخل اسم العائلة"
                              className="bg-white border-gray-200 text-right h-12 rounded-xl pr-10 cursor-pointer"
                              readOnly
                              value={
                                selectedFamilies.length > 0
                                  ? selectedFamilies.length === 1
                                    ? "تم اختيار عائلة واحدة"
                                    : `تم اختيار ${selectedFamilies.length} عائلات`
                                  : ""
                              }
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-3.5" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[300px]" align="end">
                          <Command>
                            <CommandInput
                              placeholder="بحث عن عائلة..."
                              className="text-right"
                            />
                            <CommandList>
                              {isLoadingFamilies ? (
                                <div className="flex items-center justify-center py-6">
                                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                              ) : (
                                <>
                                  <CommandEmpty>لا توجد نتائج.</CommandEmpty>
                                  <CommandGroup>
                                    {families.map((family) => (
                                      <CommandItem
                                        key={family.id}
                                        value={`${family.familyName} ${family.nationalId}`}
                                        onSelect={() => toggleFamily(family.id)}
                                        className="flex items-center justify-between cursor-pointer"
                                      >
                                        <div className="flex flex-col text-right flex-1">
                                          <span>{family.familyName}</span>
                                          <span className="text-xs text-gray-500">
                                            {family.nationalId} -{" "}
                                            {family.totalMembers} أفراد
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

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-[100px] bg-white border-gray-200 h-12 rounded-xl flex flex-row-reverse justify-between items-center px-3 text-gray-500 font-normal"
                        >
                          <ChevronDown className="h-4 w-4 opacity-50" />
                          <span>تنفية</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[160px] p-2 bg-white rounded-xl shadow-lg"
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
                                onClick={() => toggleFilter(condition.id)}
                              >
                                <label
                                  htmlFor={String(condition.id)}
                                  className="text-sm text-gray-700 cursor-pointer select-none"
                                >
                                  {condition.name}
                                </label>
                                <Checkbox
                                  id={String(condition.id)}
                                  checked={selectedFilters.includes(
                                    condition.id
                                  )}
                                  onCheckedChange={() =>
                                    toggleFilter(condition.id)
                                  }
                                  className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-2">
                              لا توجد حالات
                            </p>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
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
                          placeholder="اكتب ملاحظة"
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
                      جاري الارسال...
                    </>
                  ) : (
                    <>
                      ارسال
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
