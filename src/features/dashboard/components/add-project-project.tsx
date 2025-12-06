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

import { FileSpreadsheet, PlusCircle, SquareKanban, X } from "lucide-react";

import { projectSchema } from "../schemas/project-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ImageFallback from "@/components/shared/image-fallback";

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
        <Button className="bg-[#1F423B] text-white px-6 py-5! rounded-xl flex items-center gap-2">
          إضافة مشروع <PlusCircle className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <DialogTitle className="font-bold text-[#1E1E1E] text-lg">
            <SquareKanban className="text-primary" />
            إضافة مشروع
          </DialogTitle>
        </div>

        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto bg-[#f4f4f4] rounded-xl ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* TOP GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4   p-4 rounded-xl">
                {/* اسم المشروع */}
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="bg-white">
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
                      <FormControl className="bg-white">
                        <Input placeholder="النوع" {...field} />
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
                          <SelectTrigger className="w-full bg-white">
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
                          <SelectTrigger className="w-full bg-white">
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

                {/* عدد العائلات المستفيدة */}
                <FormField
                  control={form.control}
                  name="beneficiariesCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="bg-white">
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 w-full">
                  {/* Hidden image input */}
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const selected = e.target.files?.[0];
                      if (selected) setFile(selected);
                    }}
                  />

                  {/* Upload Box */}
                  <div
                    className="flex items-center rounded-xl ps-2 bg-white border overflow-hidden h-11 w-full sm:w-auto cursor-pointer"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    <div className="flex items-center gap-1 ">
                      <ImageFallback
                        src="/image-icon.png" // <-- change to your image icon
                        width={24}
                        height={24}
                        className="size-6"
                      />
                      <span className="text-xs text-gray-600 px-4 whitespace-nowrap">
                        إضافة صورة
                      </span>
                    </div>

                    <div className="w-px h-full bg-gray-200" />

                    <Button
                      variant="ghost"
                      type="button"
                      className="h-full px-6 rounded-none text-gray-700 bg-[#f7f7f7] font-medium"
                    >
                      تحميل
                    </Button>
                  </div>

                  {/* Image Preview */}
                  {file && (
                    <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-2 shadow-sm">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-12 h-12 object-cover rounded-lg border"
                      />

                      <span className="text-xs text-gray-700 max-w-[120px] truncate">
                        {file.name}
                      </span>

                      <button
                        className="text-gray-500 hover:text-gray-700"
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
                    <FormControl className="bg-white">
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
                  إضافة مشروع
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
