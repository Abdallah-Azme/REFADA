"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import CardTitle from "./card-title";
import CurrentProjectsTable from "./current-projects-table";
import ProjectButtonsActions from "./project-buttons-actions";
import ProjectFilteringForm from "./project-filtering-form";
import { cn } from "@/lib/utils";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useMemo } from "react";

const formSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
});

export type ProjectFilters = z.infer<typeof formSchema>;

export default function ProjectsTable({
  main = false,
  hideApproveDelete = false,
}: {
  main?: boolean;
  hideApproveDelete?: boolean;
}) {
  const { data: projectsData } = useProjects();
  const projects = projectsData?.data || [];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
      status: "",
      type: "",
    },
  });

  // Watch form values for real-time filtering
  const filters = useWatch({ control: form.control });

  // Get unique types from projects
  const uniqueTypes = useMemo(() => {
    const types = projects.map((p) => p.type).filter(Boolean);
    return [...new Set(types)];
  }, [projects]);

  // Get unique statuses from projects
  const uniqueStatuses = useMemo(() => {
    const statuses = projects.map((p) => p.status).filter(Boolean);
    return [...new Set(statuses)];
  }, [projects]);

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
          <ProjectFilteringForm
            form={form}
            types={uniqueTypes}
            statuses={uniqueStatuses}
          />
        </div>
        <ProjectButtonsActions form={form} showAddProject={false} />
      </div>
      {/* FORM */}
      {/* Table - no height constraints */}
      <CurrentProjectsTable
        filters={filters}
        hideApproveDelete={hideApproveDelete}
      />
    </div>
  );
}
