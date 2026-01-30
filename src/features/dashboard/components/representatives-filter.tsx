"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, Check, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import React from "react";

interface RepresentativesFilterProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  statusValue: string;
  setStatusValue: (value: string) => void;
  campValue: string;
  setCampValue: (value: string) => void;
  camps: any[];
}

export function RepresentativesFilter({
  searchValue,
  setSearchValue,
  statusValue,
  setStatusValue,
  campValue,
  setCampValue,
  camps,
}: RepresentativesFilterProps) {
  const t = useTranslations("representatives.filters");
  const tCommon = useTranslations("common");

  const clearFilters = () => {
    setSearchValue("");
    setStatusValue("all");
    setCampValue("all");
  };

  const hasFilters =
    searchValue || statusValue !== "all" || campValue !== "all";

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 rtl:right-3 rtl:left-auto" />
        <Input
          placeholder={t("search_placeholder")}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 rtl:pr-10"
        />
      </div>

      <Select value={statusValue} onValueChange={setStatusValue}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("status_label")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("all_statuses")}</SelectItem>
          <SelectItem value="pending">{t("status_pending")}</SelectItem>
          <SelectItem value="approved">{t("status_approved")}</SelectItem>
          <SelectItem value="rejected">{t("status_rejected")}</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[200px] justify-between",
              !campValue && "text-muted-foreground",
            )}
          >
            {campValue && campValue !== "all"
              ? camps.find((camp) => {
                  const campName =
                    typeof camp.name === "string"
                      ? camp.name
                      : camp.name?.ar || camp.name?.en || "";
                  return campName === campValue;
                })
                ? (() => {
                    const camp = camps.find((c) => {
                      const cName =
                        typeof c.name === "string"
                          ? c.name
                          : c.name?.ar || c.name?.en || "";
                      return cName === campValue;
                    });
                    return typeof camp.name === "string"
                      ? camp.name
                      : camp.name?.ar || camp.name?.en || "";
                  })()
                : campValue
              : t("camp_label")}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-hidden p-0"
          onWheel={(e) => e.stopPropagation()}
        >
          <Command>
            <CommandInput placeholder={t("search_camp_placeholder")} />
            <CommandList className="overflow-y-auto">
              <CommandEmpty>{t("no_camps_found")}</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="all"
                  onSelect={() => {
                    setCampValue("all");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0",
                      campValue === "all" ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {t("all_camps")}
                </CommandItem>
                {camps.map((camp) => {
                  const campName =
                    typeof camp.name === "string"
                      ? camp.name
                      : camp.name?.ar || camp.name?.en || "";
                  return (
                    <CommandItem
                      key={camp.id}
                      value={campName}
                      onSelect={(currentValue) => {
                        setCampValue(
                          currentValue === campValue ? "" : currentValue,
                        );
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0",
                          campValue === campName ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {campName}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {hasFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="text-gray-500 border-dashed"
        >
          <X className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
          {tCommon("clear_filters")}
        </Button>
      )}
    </div>
  );
}
