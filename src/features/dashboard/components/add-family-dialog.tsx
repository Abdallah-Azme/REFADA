"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
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
  ChevronDownIcon,
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
import { familySchema } from "../schemas/family-schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

export default function AddFamilyDialog() {
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof familySchema>>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      firstName: "",
      dateOfBirth: "",
      idNumber: "",
      phone: "",
      secondaryPhone: "",
      medicalCondition: "",
      status: "",
      childrenCount: "",
      familyMembers: [],
      location: "",
      locationNumber: "",
      note: "",
    },
  });

  const childrenCount = form.watch("childrenCount"); // watch the selected number

  // Sync the familyMembers array whenever childrenCount changes
  useEffect(() => {
    const count = Number(childrenCount || 0);

    if (count > fields.length) {
      // Add new members
      for (let i = fields.length; i < count; i++) {
        append({ name: "", idNumber: "", gender: "", dateOfBirth: "" });
      }
    } else if (count < fields.length) {
      // Remove extra members
      for (let i = fields.length; i > count; i--) {
        remove(i - 1);
      }
    }
  }, [childrenCount]); // re-run whenever childrenCount changes

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "familyMembers",
  });

  const onError = (errors: any) => console.log("❌ FORM ERRORS:", errors);

  const onSubmit = (values: z.infer<typeof familySchema>) => {
    console.log(values);
  };

  return (
    <Dialog>
      {/* TRIGGER BUTTON */}
      <DialogTrigger asChild>
        <Button className="bg-[#1F423B] text-white px-6 py-2 rounded-xl flex items-center gap-2 text-sm font-medium h-11">
          إضافة عائلة <PlusCircle className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      {/* DIALOG CONTENT */}
      <DialogContent className="rounded-md overflow-hidden">
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
              {/* MAIN GRID — RESPONSIVE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-[#F4F4F4] gap-4 p-4 rounded-xl">
                {/* اسم العائلة */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="اسم العائلة رباعي"
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
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="رقم الهوية"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* تاريخ الميلاد */}
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => {
                    const date = field.value
                      ? new Date(field.value)
                      : undefined;

                    return (
                      <FormItem className="flex flex-col gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="bg-white w-full justify-between font-normal"
                            >
                              تاريخ الميلاد{" "}
                              <ChevronDownIcon className="h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent
                            className="w-auto p-0 overflow-hidden z-[9999]"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              captionLayout="dropdown"
                              onSelect={(selected) => {
                                field.onChange(selected?.toISOString() || "");
                              }}
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
                    </FormItem>
                  )}
                />

                {/* البريد الإلكتروني */}
                <FormField
                  control={form.control}
                  name="secondaryPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="رقم الهاتف الثانوي"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* الحالات المرضية */}
                <FormField
                  control={form.control}
                  name="medicalCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full bg-white">
                            {field.value || "الحالات المرضية"}
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

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full bg-white">
                            {field.value || "الحالة الاجتماعية"}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">لا يوجد</SelectItem>
                            <SelectItem value="one">شخص واحد</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* أطفال رضع */}
                <FormField
                  control={form.control}
                  name="childrenCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full bg-white">
                            {field.value || "عدد األفراد"}
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 20 }, (_, i) => i + 1).map(
                              (num) => (
                                <SelectItem key={num} value={String(num)}>
                                  {num}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* ADD MEMBER BUTTON */}
              <div className="flex mb-4">
                <Button
                  type="button"
                  onClick={() =>
                    append({
                      name: "",
                      idNumber: "",
                      gender: "",
                      dateOfBirth: "",
                    })
                  }
                  className="bg-[#1F423B] text-white rounded-xl px-6 py-2 h-11 flex items-center gap-2 text-sm"
                >
                  إضافة فرد +
                </Button>
              </div>

              {/* FAMILY MEMBERS — RESPONSIVE */}
              {fields.map((member, index) => (
                <div
                  key={member.id}
                  className="flex flex-col lg:flex-row items-center gap-4 bg-[#F4F4F4] p-4 rounded-xl mb-2"
                >
                  {/* الاسم */}
                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1 w-full">
                        <FormControl>
                          <Input
                            className="bg-white"
                            placeholder="الاسم"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* رقم الهوية */}
                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.idNumber`}
                    render={({ field }) => (
                      <FormItem className="flex-1 w-full">
                        <FormControl>
                          <Input
                            className="bg-white"
                            placeholder="رقم الهوية"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* النوع */}
                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.gender`}
                    render={({ field }) => (
                      <FormItem className="flex-1 w-full">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full bg-white">
                              {field.value || "النوع"}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">ذكر</SelectItem>
                              <SelectItem value="female">أنثى</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.gender`}
                    render={({ field }) => (
                      <FormItem className="flex-1 w-full">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full bg-white">
                              {field.value || "صلة القرابة"}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="father">أب</SelectItem>
                              <SelectItem value="mother">أم</SelectItem>
                              <SelectItem value="son">ابن</SelectItem>
                              <SelectItem value="daughter">بنت</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* تاريخ الميلاد */}
                  <FormField
                    control={form.control}
                    name={`familyMembers.${index}.dateOfBirth`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="bg-white w-full justify-between font-normal"
                            >
                              تاريخ الميلاد{" "}
                              <ChevronDownIcon className="h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent
                            className="w-auto p-0 overflow-hidden z-[9999]"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              captionLayout="dropdown"
                              onSelect={(selected) => {
                                field.onChange(selected?.toISOString() || "");
                              }}
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalCondition"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full bg-white">
                              {field.value || "الحالات المرضية"}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">لا يوجد</SelectItem>
                              <SelectItem value="chronic">
                                أمراض مزمنة
                              </SelectItem>
                              <SelectItem value="disability">إعاقة</SelectItem>
                              <SelectItem value="urgent">حالة حرجة</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* REMOVE BUTTON */}
                  <div className="flex justify-end w-full lg:w-auto">
                    <Button
                      type="button"
                      variant="destructive"
                      className="h-9 px-4"
                      onClick={() => remove(index)}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              ))}

              {/* FILE UPLOAD — RESPONSIVE */}
              <div className="bg-[#F4F4F4] p-4 rounded-xl flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-6 justify-between">
                <p className="text-sm font-medium whitespace-nowrap ml-4">
                  اضافة تقارير عن الحالات الحرجة
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 w-full">
                  {/* Hidden input */}
                  <input
                    type="file"
                    id="critical-upload"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                    onChange={(e) => {
                      const selected = e.target.files?.[0];
                      if (selected) setFile(selected);
                    }}
                  />

                  {/* Upload Box */}
                  <div className="flex items-center rounded-xl bg-white border overflow-hidden h-11 w-full sm:w-auto">
                    <span className="text-xs text-gray-600 px-4 whitespace-nowrap">
                      إضافة ملف، صورة، تقرير طبي
                    </span>

                    <div className="w-px h-full bg-gray-200" />

                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() =>
                        document.getElementById("critical-upload")?.click()
                      }
                      className="h-full px-6 rounded-none text-gray-700 bg-[#D9D9D9] font-medium"
                    >
                      تحميل
                    </Button>
                  </div>

                  {/* File Preview */}
                  {file && (
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

              {/* LOCATION — RESPONSIVE GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-[#F4F4F4] p-4 rounded-xl gap-4">
                {/* رقم الخيمة */}
                <FormField
                  control={form.control}
                  name="locationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="رقم الخيمة"
                          {...field}
                        />
                      </FormControl>
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
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* الملاحظات */}
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem className="col-span-1 sm:col-span-2 lg:col-span-3">
                      <FormControl>
                        <Textarea
                          className="bg-white"
                          placeholder="اكتب هنا..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* FOOTER BUTTONS — RESPONSIVE */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 mx-auto w-full sm:w-fit">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-primary min-w-[172px] text-white px-8 rounded-xl"
                >
                  <CirclePlus />
                  إضافة عائلة
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
