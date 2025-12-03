"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CardTitle from "./card-title";
import CurrentProjectsTable from "./current-projects-table";
import ProjectButtonsActions from "./project-buttons-actions";
import ProjectFilteringForm from "./project-filtering-form";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  project: z.string().optional(),
  status: z.string().optional(),
  caseStatus: z.string().optional(),
});

export default function ProjectsTable({ main = false }: { main?: boolean }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project: "",
      status: "",
      caseStatus: "",
    },
  });

  return (
    <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-100">
      {/* Header */}
      {/* Search and Filters */}
      <div
        className={cn(
          "flex items-center justify-between",
          main ? "p-2" : "p-6 "
        )}
      >
        {/* HEADER & BUTTONS */}
        <div className="flex flex-col gap-2">
          {!main && (
            <CardTitle title="المشاريع الحالية" className="self-start" />
          )}
          <ProjectFilteringForm form={form} />
        </div>
        <ProjectButtonsActions form={form} showAddProject={false} />
      </div>
      {/* FORM */}
      {/* Table - no height constraints */}
      <CurrentProjectsTable />
    </div>
  );
}
