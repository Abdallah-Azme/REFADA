"use client";

import { Notebook } from "lucide-react";

import {
  Trash2,
  Edit,
  Search,
  ChevronDown,
  SearchCheck,
  RotateCcw,
  Users,
} from "lucide-react";
import AddProjectDialog from "./add-project-project";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import CurrentProjectsTable from "./current-projects-table";
import AddFamilyDialog from "./add-family-dialog";
import FamilyTable from "./family-table";
import AnalyticsChart from "./analytics-chart";
import StatsCards, { stats } from "./stats-cards";

const formSchema = z.object({
  project: z.string().optional(),
  status: z.string().optional(),
  caseStatus: z.string().optional(),
});
export default function ReportsPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project: "",
      status: "",
      caseStatus: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div className="w-full  gap-6 p-8 bg-white rounded-lg  ">
      <div className="p-6 border-b border-gray-100">
        {/* HEADER & BUTTONS */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            المشاريع الحالية
          </h3>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
          {/* FORM */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-3 self-end"
            >
              {/* المشروع */}
              <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[160px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700">
                          <SelectValue placeholder="المشروع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">الكل</SelectItem>
                          <SelectItem value="1">مشروع 1</SelectItem>
                          <SelectItem value="2">مشروع 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* حالة المشروع */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[160px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700">
                          <SelectValue placeholder="حالة المشروع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">نشط</SelectItem>
                          <SelectItem value="paused">متوقف</SelectItem>
                          <SelectItem value="ended">منتهي</SelectItem>
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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

          <div className="flex gap-1">
            <Button
              className="bg-primary w-1/2 text-white px-6 flex-1 py-2 rounded-xl flex items-center gap-2 text-sm font-medium"
              size="lg"
            >
              <SearchCheck className="w-4 h-4" />
              بحث
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="px-6 flex-1 shrink-0 w-1/2 py-2 rounded-xl"
              onClick={() => form.reset()}
            >
              <RotateCcw className="w-4 h-4 text-primary" />
              إعادة البحث
            </Button>
          </div>
        </div>
      </div>
      {/* grid of stats */}
      <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-3 my-5">
        <AnalyticsChart />
        <AnalyticsChart />
        <AnalyticsChart />
      </div>

      <StatsCards stats={stats} />
    </div>
  );
}
