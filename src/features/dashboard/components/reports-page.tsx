"use client";

import { RotateCcw, SearchCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import AnalyticsChart from "./analytics-chart";
import ReportsFormFiltring from "./reports-form-filtring";
import StatsCards, { stats } from "./stats-cards";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function ReportsPage() {
  const formSchema = z.object({
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    reportType: z.string().optional(),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromDate: "",
      toDate: "",
      reportType: "",
    },
  });
  return (
    <div className="w-full  gap-6 py-4 px-8 bg-white rounded-lg  ">
      <div className="py-2  px-4 ">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
          {/* FORM */}
          <ReportsFormFiltring form={form} formSchema={formSchema} />

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
        <AnalyticsChart title="تقرير شهر أكتوبر" />
        <AnalyticsChart title="تقرير شهر سبتمبر" />
        <AnalyticsChart title="تقرير شهر آغسطس" />
      </div>

      <StatsCards stats={stats} className="bg-[#F7F2F2] p-3 my-2 rounded-lg" />
    </div>
  );
}
