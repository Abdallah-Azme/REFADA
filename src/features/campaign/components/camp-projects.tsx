"use client";

import { motion } from "framer-motion";
import { Tent, Search } from "lucide-react";
import { CampCard } from "./camp-card";
import { Camp } from "@/features/camps/types/camp.schema";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useGovernorates } from "@/features/dashboard/hooks/use-governorates";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useCampNamesList } from "@/features/camps/hooks/use-camps";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper function to get camp name as string
function getCampNameString(
  name: string | { ar?: string; en?: string },
): string {
  if (typeof name === "string") {
    return name;
  }
  return name.ar || name.en || "";
}

export default function CampProjects({
  camps = [],
  dashboard = false,
  selectedGovernorate,
  onGovernorateChange,
  selectedSearchName,
  onSearchNameChange,
}: {
  camps?: Camp[];
  dashboard?: boolean;
  selectedGovernorate?: string;
  onGovernorateChange?: (value: string) => void;
  selectedSearchName?: string;
  onSearchNameChange?: (value: string) => void;
}) {
  const t = useTranslations("camp_projects");
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      region: selectedGovernorate || "",
      campName: "",
      campTitle: "",
      shelterName: selectedSearchName || "",
    },
  });

  const { data: governoratesData, isLoading: isLoadingGovernorates } =
    useGovernorates();
  const { data: campNamesData, isLoading: isLoadingCampNames } =
    useCampNamesList();
  const watchedValues = form.watch();

  // Sync prop with form state
  useMemo(() => {
    if (
      selectedGovernorate !== undefined &&
      selectedGovernorate !== form.getValues().region
    ) {
      form.setValue("region", selectedGovernorate);
    }
  }, [selectedGovernorate, form]);

  useMemo(() => {
    if (
      selectedSearchName !== undefined &&
      selectedSearchName !== form.getValues().shelterName
    ) {
      form.setValue("shelterName", selectedSearchName);
    }
  }, [selectedSearchName, form]);

  // Handle server-side filter change
  useMemo(() => {
    if (onGovernorateChange && watchedValues.region !== selectedGovernorate) {
      // Debounce or direct call? Select is usually instant.
      // However, we avoid infinite loop by checking equality above.
      // But wait, watchedValues.region updates on render.
      // Better to use onValueChange in the Select component directly or use an effect.
    }
  }, [watchedValues.region]);

  // Actually, simpler: Attach onValueChange handler to the Select component directly
  // and keep the form for other fields.

  const governorates = useMemo(() => {
    const apiGovernorates = governoratesData?.data || [];
    // Only use API governorates for server-side mode to assure complete list
    if (onGovernorateChange) return apiGovernorates;

    const campGovernorates = camps
      .map((camp) => {
        if (!camp.governorate) return null;
        if (typeof camp.governorate === "string") {
          return { id: 0, name: camp.governorate };
        }
        return camp.governorate;
      })
      .filter((gov) => gov !== null) as { id: number; name: string }[];

    const allGovernorates = [...apiGovernorates, ...campGovernorates];
    return Array.from(
      new Map(allGovernorates.map((gov) => [gov.name, gov])).values(),
    );
  }, [governoratesData, camps, onGovernorateChange]);

  // Get unique camp names
  const campNames = useMemo(() => {
    if (campNamesData?.data) {
      return campNamesData.data.map((item: any) => ({
        id: item.id,
        name: item.name.ar || item.name.en,
      }));
    }
    // Fallback to local
    return camps.map((camp) => ({
      id: camp.id,
      name: getCampNameString(camp.name),
      slug: camp.slug,
    }));
  }, [campNamesData, camps]);

  // Filter camps based on form values
  const filteredCamps = useMemo(() => {
    let filtered = [...camps];

    // Filter by governorate/region (Only if NOT server-side filtering)
    if (watchedValues.region && !onGovernorateChange) {
      filtered = filtered.filter((camp) => {
        if (!camp.governorate) return false;
        const governorateName =
          typeof camp.governorate === "string"
            ? camp.governorate
            : camp.governorate.name;
        return governorateName === watchedValues.region;
      });
    }

    // Filter by camp name (shelterName)
    if (watchedValues.shelterName && !onSearchNameChange) {
      filtered = filtered.filter(
        (camp) => getCampNameString(camp.name) === watchedValues.shelterName,
      );
    }

    return filtered;
  }, [
    camps,
    watchedValues.region,
    watchedValues.shelterName,
    onGovernorateChange,
    onSearchNameChange,
  ]);

  const onSubmit = (data: any) => {
    // Form submission is handled by real-time filtering via watch()
  };

  const handleClearFilters = () => {
    form.reset({
      region: "",
      campName: "",
      campTitle: "",
      shelterName: "",
    });
    if (onGovernorateChange) {
      onGovernorateChange("all");
    }
    if (onSearchNameChange) {
      onSearchNameChange("");
    }
  };

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        className="flex items-center gap-2 my-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Tent className="text-[#4A8279]" />
        <h1 className="text-xl font-bold text-[#1E1E1E]">{t("title")}</h1>
      </motion.div>

      {/* Form Section */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-wrap items-center gap-3 bg-[#FBFBF8] p-4 rounded-2xl shadow-sm"
          dir="rtl"
        >
          <p className="text-gray-700 font-medium whitespace-nowrap px-2">
            {t("search_by")}
          </p>

          {/* Governorate */}
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px] max-w-[300px]">
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (onGovernorateChange) {
                      // The value in SelectItem below needs to lead to ID for the API
                      // If value is name, we must find ID.
                      // However, let's update SelectItem to use ID if we are in server mode?
                      // Or just pass the value if it's the ID.
                      onGovernorateChange(value);
                    }
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full bg-[#F8F6F2] border border-[#E5E3DC] rounded-md h-10 text-gray-700 focus:ring-0">
                      <SelectValue placeholder={t("governorate")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingGovernorates ? (
                      <SelectItem value="loading" disabled>
                        {t("loading")}
                      </SelectItem>
                    ) : governorates.length > 0 ? (
                      governorates.map((governorate) => (
                        <SelectItem
                          key={governorate.id || governorate.name}
                          // If onGovernorateChange is present, we prefer ID.
                          // But existing components might prefer Name?
                          // The API implementation requires ID.
                          // So we must use ID here if onGovernorateChange is active.
                          value={
                            onGovernorateChange
                              ? governorate.id.toString()
                              : governorate.name
                          }
                        >
                          {governorate.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>
                        {t("no_governorates")}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Shelter Name Combobox with Search */}
          <FormField
            control={form.control}
            name="shelterName"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px] max-w-[300px]">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-[#F8F6F2] border border-[#E5E3DC] rounded-md h-10 text-gray-700 hover:bg-[#F8F6F2] hover:text-gray-700"
                      >
                        {field.value
                          ? campNames.find((camp) => camp.name === field.value)
                              ?.name
                          : t("shelter_name")}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder={t("search_shelter")} />
                      <CommandEmpty>{t("no_shelters")}</CommandEmpty>
                      <CommandGroup className="max-h-[200px] overflow-auto">
                        {campNames.map((camp) => (
                          <CommandItem
                            key={camp.id}
                            value={camp.name}
                            onSelect={(currentValue) => {
                              const newValue =
                                currentValue === field.value
                                  ? ""
                                  : currentValue;
                              field.onChange(newValue);
                              if (onSearchNameChange) {
                                onSearchNameChange(newValue);
                              }
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === camp.name
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {camp.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          {/* Search Button */}
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="flex items-center gap-1 bg-[#CBBF8C] text-gray-800 hover:bg-[#b2a672] transition-colors h-10 px-4 mr-auto"
          >
            <Search className="w-4 h-4" />
            {t("search")}
          </Button>

          {/* Clear Filters Button */}
          {(watchedValues.region ||
            watchedValues.shelterName ||
            watchedValues.campTitle) && (
            <Button
              type="button"
              onClick={handleClearFilters}
              variant="outline"
              className="flex items-center gap-1 h-10 px-4 border-gray-300"
            >
              {t("clear")}
            </Button>
          )}
        </form>
      </Form>

      {/* Subtitle */}
      <motion.p
        className="mt-6 text-gray-700"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {t("donation_message")}
      </motion.p>

      {/* Camps Grid */}
      {filteredCamps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
          {filteredCamps.map((camp, index) => (
            <CampCard
              key={camp.id}
              id={camp.id}
              title={getCampNameString(camp.name)}
              location={camp.location || ""}
              families={
                camp.statistics?.familyCount ||
                camp.families?.length ||
                camp.familyCount ||
                0
              }
              image={camp.campImg || "/placeholder.jpg"}
              index={index}
              slug={camp.slug}
              dashboard={dashboard}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 mt-8">
          <p className="text-gray-500 text-lg">
            {watchedValues.region ||
            watchedValues.shelterName ||
            watchedValues.campTitle
              ? t("no_matching_results")
              : t("no_camps_available")}
          </p>
        </div>
      )}
    </section>
  );
}
