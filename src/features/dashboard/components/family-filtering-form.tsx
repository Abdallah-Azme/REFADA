import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

export default function FamilyFilteringForm({
  form,
}: {
  form: UseFormReturn<
    {
      familyName?: string;
      status?: string;
      caseStatus?: string;
      familySize?: string;
      hasChildren?: string;
      ageFrom?: Date;
      ageTo?: Date;
    },
    any,
    {
      familyName?: string;
      status?: string;
      caseStatus?: string;
      familySize?: string;
      hasChildren?: string;
      ageFrom?: Date;
      ageTo?: Date;
    }
  >;
}) {
  const formSchema = z.object({
    familyName: z.string().optional(),
    status: z.string().optional(),
    caseStatus: z.string().optional(),
    familySize: z.string().optional(),
    hasChildren: z.string().optional(),
    ageFrom: z.date().optional(),
    ageTo: z.date().optional(),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {}
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-wrap items-center gap-3 self-end"
      >
        {/* اسم العائلة */}
        <FormField
          control={form.control}
          name="familyName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[160px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700">
                    <SelectValue placeholder="اسم العائلة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="1">عائلة 1</SelectItem>
                    <SelectItem value="2">عائلة 2</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* الحالات المرضية */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[160px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700">
                    <SelectValue placeholder="الحالات المرضية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">لا يوجد</SelectItem>
                    <SelectItem value="chronic">أمراض مزمنة</SelectItem>
                    <SelectItem value="disability">إعاقة</SelectItem>
                    <SelectItem value="urgent">حالة حرجة</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* الحالة */}
        <FormField
          control={form.control}
          name="caseStatus"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[140px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* حجم العائلة */}
        <FormField
          control={form.control}
          name="familySize"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[160px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700">
                    <SelectValue placeholder="حجم العائلة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="1-2">1-2 أفراد</SelectItem>
                    <SelectItem value="3">3 أفراد</SelectItem>
                    <SelectItem value="4">4 أفراد</SelectItem>
                    <SelectItem value="5">5 أفراد</SelectItem>
                    <SelectItem value="6+">6+ أفراد</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* لديهم أطفال */}
        <FormField
          control={form.control}
          name="hasChildren"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[160px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700">
                    <SelectValue placeholder="لديهم أطفال" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* العمر من */}
        <FormField
          control={form.control}
          name="ageFrom"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[160px] h-10 justify-start text-right font-normal bg-white border border-gray-300 text-sm",
                        !field.value && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "yyyy/MM/dd")
                      ) : (
                        <span>العمر من</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
            </FormItem>
          )}
        />

        {/* العمر إلى */}
        <FormField
          control={form.control}
          name="ageTo"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[160px] h-10 justify-start text-right font-normal bg-white border border-gray-300 text-sm",
                        !field.value && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "yyyy/MM/dd")
                      ) : (
                        <span>العمر إلى</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
