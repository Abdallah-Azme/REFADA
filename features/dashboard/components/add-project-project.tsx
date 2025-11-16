// Updated AddProjectDialog component matching the inputs shown in the image

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { FileSpreadsheet, PlusCircle, X } from "lucide-react";

import { projectSchema } from "../schemas/project-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AddProjectDialog() {
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: "",
      type: "",
      quantity: "",
      status: "",
      beneficiariesCount: "",
      number: "",
      note: "",
    },
  });

  const onSubmit = (values: any) => console.log(values);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#1F423B] text-white px-6 py-2 rounded-xl flex items-center gap-2">
          إضافة مشروع <PlusCircle className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            إضافة مشروع
          </DialogTitle>
        </div>

        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* TOP GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F4F4F4] p-4 rounded-xl">
                {/* اسم المشروع */}
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="اسم المشروع" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* النوع */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            {field.value || "النوع"}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="option1">خيار 1</SelectItem>
                            <SelectItem value="option2">خيار 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* الكمية */}
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            {field.value || "الكمية"}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* الحالة */}
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
                          <SelectTrigger className="w-full">
                            {field.value || "الحالة"}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">جديد</SelectItem>
                            <SelectItem value="pending">قيد التنفيذ</SelectItem>
                            <SelectItem value="done">منتهي</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* الرقم */}
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="الرقم" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* عدد العائلات المستفيدة */}
                <FormField
                  control={form.control}
                  name="beneficiariesCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="عدد العائلات المستفيدة"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* FILE UPLOAD */}
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

              {/* NOTE */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="اكتب هنا..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* SUBMIT */}
              <div className="flex justify-center gap-4">
                <Button
                  type="submit"
                  className="bg-primary text-white min-w-[160px]"
                >
                  إضافة عائلة
                </Button>

                <DialogClose asChild>
                  <Button
                    type="button"
                    className="bg-secondary text-black min-w-[160px]"
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
