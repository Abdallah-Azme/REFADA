import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FamilyFilteringForm({
  form,
}: {
  form: UseFormReturn<
    {
      familyName: string;
      status: string;
      caseStatus: string;
    },
    any,
    {
      familyName: string;
      status: string;
      caseStatus: string;
    }
  >;
}) {
  const formSchema = z.object({
    familyName: z.string().optional(),
    status: z.string().optional(),
    caseStatus: z.string().optional(),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-3 self-end"
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
      </form>
    </Form>
  );
}
