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
import { useMemo } from "react";
import { useTranslations } from "next-intl";

export default function CampProjects({
  camps = [],
  dashboard = false,
}: {
  camps?: Camp[];
  dashboard?: boolean;
}) {
  const t = useTranslations("camp_projects");
  const form = useForm({
    defaultValues: {
      region: "",
      campName: "",
      campTitle: "",
      shelterName: "",
    },
  });

  const { data: governoratesData, isLoading: isLoadingGovernorates } =
    useGovernorates();
  const watchedValues = form.watch();

  // Get unique governorates from camps and API
  const governorates = useMemo(() => {
    const apiGovernorates = governoratesData?.data || [];
    const campGovernorates = camps
      .map((camp) => {
        if (!camp.governorate) return null;
        if (typeof camp.governorate === "string") {
          return { id: 0, name: camp.governorate };
        }
        return camp.governorate;
      })
      .filter((gov) => gov !== null) as { id: number; name: string }[];

    // Combine and deduplicate by name
    const allGovernorates = [...apiGovernorates, ...campGovernorates];
    const uniqueGovernorates = Array.from(
      new Map(allGovernorates.map((gov) => [gov.name, gov])).values(),
    );
    return uniqueGovernorates;
  }, [governoratesData, camps]);

  // Get unique camp names
  const campNames = useMemo(() => {
    return camps.map((camp) => ({
      id: camp.id,
      name: camp.name,
      slug: camp.slug,
    }));
  }, [camps]);

  // Filter camps based on form values
  const filteredCamps = useMemo(() => {
    let filtered = [...camps];

    // Filter by governorate/region
    if (watchedValues.region) {
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
    if (watchedValues.shelterName) {
      filtered = filtered.filter(
        (camp) => camp.name === watchedValues.shelterName,
      );
    }

    // Filter by camp title (if needed - this might need to be based on project types or other criteria)
    // For now, we'll skip this as it's not clear what campTitle refers to in the data structure

    return filtered;
  }, [camps, watchedValues.region, watchedValues.shelterName]);

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
                <Select onValueChange={field.onChange} value={field.value}>
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
                          value={governorate.name}
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

          {/* Shelter Name */}
          <FormField
            control={form.control}
            name="shelterName"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px] max-w-[300px]">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-[#F8F6F2] border border-[#E5E3DC] rounded-md h-10 text-gray-700 focus:ring-0">
                      <SelectValue placeholder={t("shelter_name")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {campNames.length > 0 ? (
                      campNames.map((camp) => (
                        <SelectItem key={camp.id} value={camp.name}>
                          {camp.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>
                        {t("no_shelters")}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
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
              title={camp.name}
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
