"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "اختر التاريخ",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse the string value to a Date object for the calendar
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    try {
      // Try to parse DD-M-YYYY format
      const parsed = parse(value, "d-M-yyyy", new Date());
      if (!isNaN(parsed.getTime())) return parsed;
    } catch {
      // Ignore parsing errors
    }
    return undefined;
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Format to DD-M-YYYY as expected by the backend
      const formatted = format(date, "d-M-yyyy");
      onChange(formatted);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-right font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="ml-2 h-4 w-4" />
          {value ? value : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleSelect}
          captionLayout="dropdown"
          fromYear={1900}
          toYear={new Date().getFullYear()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
