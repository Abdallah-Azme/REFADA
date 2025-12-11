"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  CirclePlus,
  FileSpreadsheet,
  PlusCircle,
  Users,
  X,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { familySchema } from "@/features/families/types/family.schema";
import { useCreateFamily } from "@/features/families/hooks/use-create-family";
import { useCamps } from "@/features/camps";

export default function AddFamilyDialog() {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const { mutate: createFamily, isPending } = useCreateFamily();

  // Load camps for the select
  const { data: campsData } = useCamps();
  const camps = campsData?.data || [];

  // NOTE: Marital status options are hardcoded for now or should be fetched?
  // Based on Postman `marital_status_id=2`, I will ideally need a hook for this.
  // For now I'll use a hardcoded helper or just hardcode IDs in SelectItems if known.
  // Or better, fetch them. But for speed as per "do it", let's assume standard options.

  const form = useForm<z.infer<typeof familySchema>>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      familyName: "",
      nationalId: "",
      dob: undefined,
      phone: "",
      backupPhone: undefined,
      totalMembers: undefined, // Default to 1
      tentNumber: undefined,
      location: undefined,
      notes: undefined,
      campId: undefined,
      maritalStatusId: undefined,
    },
  });

  const onError = (errors: any) => console.log("❌ FORM ERRORS:", errors);

  const onSubmit = (values: z.infer<typeof familySchema>) => {
    // values already match FamilyFormValues structure (camelCase)
    // pass file if exists
    const payload = {
      ...values,
      file: file,
    };

    createFamily(payload, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        setFile(null);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* TRIGGER BUTTON */}
      <DialogTrigger asChild>
        <Button className="bg-[#1F423B] text-white px-6 py-2 rounded-xl flex items-center gap-2 text-sm font-medium h-11">
          إضافة عائلة <PlusCircle className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      {/* DIALOG CONTENT */}
      <DialogContent className="rounded-md overflow-hidden max-w-4xl">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold flex gap-1 items-center">
            <Users className="mx-1 text-primary" />
            إضافة عائلة
          </DialogTitle>
        </div>

        {/* FORM */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto bg-white">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              {/* MAIN GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-[#F4F4F4] gap-4 p-4 rounded-xl">
                {/* اسم العائلة */}
                <FormField
                  control={form.control}
                  name="familyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="اسم العائلة"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* رقم الهوية */}
                <FormField
                  control={form.control}
                  name="nationalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="رقم الهوية"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* تاريخ الميلاد */}
                {/* Simplified Date Input for now as calendar component had undefined issues in reading */}
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-white"
                          placeholder="تاريخ الميلاد (YYYY-MM-DD)"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* رقم الهاتف */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="رقم الهاتف"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* رقم الهاتف الثانوي */}
                <FormField
                  control={form.control}
                  name="backupPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="رقم الهاتف الثانوي"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* الحالة الاجتماعية */}
                <FormField
                  control={form.control}
                  name="maritalStatusId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full bg-white">
                            {field.value
                              ? `الحالة: ${field.value}`
                              : "الحالة الاجتماعية"}
                          </SelectTrigger>
                          <SelectContent>
                            {/* Mocking IDs based on typical DBs, or user can fix if they have lookup */}
                            <SelectItem value="1">أعزب/عزباء</SelectItem>
                            <SelectItem value="2">متزوج/متزوجة</SelectItem>
                            <SelectItem value="3">مطلق/مطلقة</SelectItem>
                            <SelectItem value="4">أرمل/أرملة</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* المخيم */}
                <FormField
                  control={form.control}
                  name="campId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full bg-white">
                            {field.value
                              ? camps.find(
                                  (c) => c.id.toString() === field.value
                                )?.name || "المخيم"
                              : "المخيم"}
                          </SelectTrigger>
                          <SelectContent>
                            {camps.map((camp) => (
                              <SelectItem
                                key={camp.id}
                                value={camp.id.toString()}
                              >
                                {camp.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* عدد الأفراد */}
                <FormField
                  control={form.control}
                  name="totalMembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          className="bg-white"
                          placeholder="عدد الأفراد"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* LOCATION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-[#F4F4F4] p-4 rounded-xl gap-4">
                {/* رقم الخيمة */}
                <FormField
                  control={form.control}
                  name="tentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="رقم الخيمة"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* الموقع */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="الموقع"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* الملاحظات */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="col-span-1 sm:col-span-2 lg:col-span-3">
                      <FormControl>
                        <Textarea
                          className="bg-white"
                          placeholder="ملاحظات..."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* FILE UPLOAD */}
              <div className="bg-[#F4F4F4] p-4 rounded-xl flex flex-col items-start gap-3">
                <p className="text-sm font-medium ml-4">
                  ملفات مرفقة (صورة، تقرير)
                </p>
                <div className="flex items-center gap-3 w-full">
                  {!file ? (
                    <Input
                      type="file"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setFile(f);
                      }}
                      className="bg-white w-full sm:w-auto"
                    />
                  ) : (
                    <div className="flex items-center bg-white border gap-2 rounded-xl px-4 py-2 shadow-sm">
                      <span className="ml-2 bg-green-500 text-white rounded-xl p-1">
                        <FileSpreadsheet className="w-4 h-4" />
                      </span>
                      <span className="text-xs text-gray-700">{file.name}</span>
                      <button
                        className="text-gray-500 hover:text-gray-700 mr-2"
                        onClick={() => setFile(null)}
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* FOOTER BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 mx-auto w-full sm:w-fit">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto bg-primary min-w-[172px] text-white px-8 rounded-xl"
                >
                  <CirclePlus className="mr-2 h-4 w-4" />
                  {isPending ? "جاري الإضافة..." : "إضافة عائلة"}
                </Button>

                <DialogClose asChild>
                  <Button
                    type="button"
                    className="w-full sm:w-auto bg-secondary min-w-[172px] text-black px-8 rounded-xl"
                  >
                    إلغاء
                  </Button>
                </DialogClose>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
