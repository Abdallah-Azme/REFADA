"use client";

import { motion } from "framer-motion";
import { Tent, Search } from "lucide-react";
import { shelters } from "../../../components/pages/home/camps-section";
import { CampCard } from "./camp-card";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export default function CampProjects() {
  const form = useForm({
    defaultValues: {
      region: "",
      campName: "",
      campTitle: "",
      shelterName: "",
    },
  });

  const onSubmit = (data: any) => {};

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        className="flex items-center gap-2 my-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Tent />
        <h2 className="text-xl font-bold text-[#1E1E1E]">الإيواءات</h2>
      </motion.div>

      {/* Form Section */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-wrap items-center gap-3 bg-[#FBFBF8] p-4 rounded-2xl shadow-sm"
          dir="rtl"
        >
          <p className="text-gray-700 font-medium whitespace-nowrap px-2">
            بحث حسب
          </p>

          {/* Shelter Name */}
          <FormField
            control={form.control}
            name="shelterName"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px]">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-[#F8F6F2] border border-[#E5E3DC] rounded-md h-10 text-gray-700 focus:ring-0">
                      <SelectValue placeholder="اسم الإيواء" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="إيواء الشمال">إيواء الشمال</SelectItem>
                    <SelectItem value="إيواء الجنوب">إيواء الجنوب</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Camp Name */}
          <FormField
            control={form.control}
            name="campName"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px]">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-[#F8F6F2] border border-[#E5E3DC] rounded-md h-10 text-gray-700 focus:ring-0">
                      <SelectValue placeholder="اسم المخيم" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="مخيم الأمل">مخيم الأمل</SelectItem>
                    <SelectItem value="مخيم الرحمة">مخيم الرحمة</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Camp Title */}
          <FormField
            control={form.control}
            name="campTitle"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px]">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-[#F8F6F2] border border-[#E5E3DC] rounded-md h-10 text-gray-700 focus:ring-0">
                      <SelectValue placeholder="عنوان المخيم" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="الإعمار">الإعمار</SelectItem>
                    <SelectItem value="الإغاثة">الإغاثة</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Region */}
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px]">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-[#F8F6F2] border border-[#E5E3DC] rounded-md h-10 text-gray-700 focus:ring-0">
                      <SelectValue placeholder="المنطقة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="الشمال">الشمال</SelectItem>
                    <SelectItem value="الجنوب">الجنوب</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Search Button */}
          <Button
            type="submit"
            className="flex items-center gap-1 bg-[#CBBF8C] text-gray-800 hover:bg-[#b2a672] transition-colors h-10 px-4"
          >
            <Search className="w-4 h-4" />
            بحث
          </Button>
        </form>
      </Form>

      {/* Subtitle */}
      <motion.p
        className="mt-6 text-gray-700"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        ساهم بتبرعك في تغيير حياة محتاج، فبعطائك يُزرع الأمل ويستمر الأثر 🌱
      </motion.p>

      {/* Camps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
        {shelters.map((shelter, index) => (
          <CampCard key={index} {...shelter} index={index} />
        ))}
      </div>
    </section>
  );
}
