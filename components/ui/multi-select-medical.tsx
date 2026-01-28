"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface MedicalCondition {
  id: number;
  name: string;
}

interface MultiSelectMedicalProps {
  conditions: MedicalCondition[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  otherText?: string;
  onOtherTextChange?: (text: string) => void;
  placeholder?: string;
  healthyLabel?: string;
  otherLabel?: string;
  otherPlaceholder?: string;
  className?: string;
}

export function MultiSelectMedical({
  conditions,
  selectedIds,
  onSelectionChange,
  otherText = "",
  onOtherTextChange,
  placeholder = "اختر الحالة الصحية",
  healthyLabel = "سليم",
  otherLabel = "أخرى",
  otherPlaceholder = "أدخل الحالة الصحية",
  className,
}: MultiSelectMedicalProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const hasOther = selectedIds.includes("other");

  // Filter conditions based on search query
  const filteredConditions = React.useMemo(() => {
    if (!searchQuery.trim()) return conditions;
    const query = searchQuery.toLowerCase();
    return conditions.filter((condition) =>
      condition.name.toLowerCase().includes(query),
    );
  }, [conditions, searchQuery]);

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      // Remove the ID
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      // Add the ID
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleRemove = (id: string) => {
    onSelectionChange(selectedIds.filter((i) => i !== id));
    if (id === "other") {
      onOtherTextChange?.("");
    }
  };

  const getConditionName = (id: string): string => {
    if (id === "other") return otherLabel;
    const condition = conditions.find((c) => c.id.toString() === id);
    return condition?.name || id;
  };

  // Reset search when popover closes
  React.useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white font-normal"
          >
            <span className="truncate">
              {selectedIds.length === 0
                ? placeholder
                : selectedIds.length === 1
                  ? getConditionName(selectedIds[0])
                  : `${selectedIds.length} حالات محددة`}
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 min-w-[var(--radix-popover-trigger-width)] max-w-[280px] w-auto"
          align="start"
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="p-2 border-b">
            <Input
              placeholder="ابحث عن حالة صحية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Scrollable list */}
          <div
            ref={scrollRef}
            className="overflow-y-scroll overscroll-contain"
            style={{
              maxHeight: "240px",
              overflowY: "scroll",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-y",
            }}
          >
            {/* Medical conditions */}
            {filteredConditions.map((condition) => {
              const isSelected = selectedIds.includes(condition.id.toString());
              return (
                <div
                  key={condition.id}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-secondary",
                    isSelected && "bg-secondary",
                  )}
                  onClick={() => handleToggle(condition.id.toString())}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    {isSelected && <Check className="h-4 w-4" />}
                  </div>
                  <span>{condition.name}</span>
                </div>
              );
            })}

            {/* No results message */}
            {filteredConditions.length === 0 && searchQuery.trim() && (
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                لا توجد نتائج
              </div>
            )}

            {/* Other option */}
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-secondary",
                hasOther && "bg-secondary",
              )}
              onClick={() => handleToggle("other")}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                {hasOther && <Check className="h-4 w-4" />}
              </div>
              <span>{otherLabel}</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected badges (only show if more than one condition selected) */}
      {selectedIds.length > 1 && (
        <div className="flex flex-wrap gap-1">
          {selectedIds.map((id) => (
            <Badge
              key={id}
              variant="secondary"
              className="flex items-center gap-1 text-xs"
            >
              {getConditionName(id)}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => handleRemove(id)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Other text input */}
      {hasOther && (
        <Input
          placeholder={otherPlaceholder}
          value={otherText}
          onChange={(e) => onOtherTextChange?.(e.target.value)}
          className="bg-white"
        />
      )}
    </div>
  );
}
