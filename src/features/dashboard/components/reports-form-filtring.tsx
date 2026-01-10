"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function ReportsFormFiltring({
  form,
  formSchema,
}: {
  form: UseFormReturn<
    {
      fromDate: string;
      toDate: string;
      reportType: string;
    },
    any,
    {
      fromDate: string;
      toDate: string;
      reportType: string;
    }
  >;
  formSchema: any;
}) {
  function onSubmit(values: z.infer<typeof formSchema>) {}
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full sm:flex-row sm:w-auto items-center gap-3 self-end"
      >
        {/* من التاريخ */}
        <FormField
          control={form.control}
          name="fromDate"
          render={({ field }) => (
            <FormItem className="w-full sm:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full sm:w-[180px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700 font-normal justify-start text-right",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP", { locale: ar })
                      ) : (
                        <span>من التاريخ</span>
                      )}
                      <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(date ? date.toISOString() : "");
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        {/* إلى التاريخ */}
        <FormField
          control={form.control}
          name="toDate"
          render={({ field }) => (
            <FormItem className="w-full sm:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full sm:w-[180px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700 font-normal justify-start text-right",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP", { locale: ar })
                      ) : (
                        <span>إلى التاريخ</span>
                      )}
                      <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(date ? date.toISOString() : "");
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        {/* نوع التقرير */}
        <FormField
          control={form.control}
          name="reportType"
          render={({ field }) => (
            <FormItem className="w-full sm:w-auto">
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700">
                    <SelectValue placeholder="نوع التقرير" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">تقرير شهري</SelectItem>
                    <SelectItem value="weekly">تقرير أسبوعي</SelectItem>
                    <SelectItem value="daily">تقرير يومي</SelectItem>
                    <SelectItem value="custom">تقرير مخصص</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
