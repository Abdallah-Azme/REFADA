"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useState, useMemo, useEffect } from "react";

import CardTitle from "./card-title";
import CurrentProjectsTable from "./current-projects-table";
import ProjectButtonsActions from "./project-buttons-actions";
import ProjectFilteringForm from "./project-filtering-form";
import { cn } from "@/lib/utils";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useTranslations } from "next-intl";
import {
  ProjectsQueryParams,
  DEFAULT_PROJECTS_QUERY,
} from "@/features/projects/types/projects-query.types";

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
  const t = useTranslations("projects_page");

  // Server-side query params state
  const [queryParams, setQueryParams] = useState<ProjectsQueryParams>(
    DEFAULT_PROJECTS_QUERY,
  );

  // Fetch data with server-side params
  const { data: projectsData, isLoading } = useProjects(queryParams);
  console.log({ projectsData });
  const projects = projectsData?.data || [];
  const meta = projectsData?.meta;

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

  // Debounce search and update server-side params
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams((prev) => ({
        ...prev,
        search: filters.search || undefined,
        status:
          filters.status && filters.status !== "all"
            ? filters.status
            : undefined,
        type: filters.type && filters.type !== "all" ? filters.type : undefined,
        page: 1, // Reset to page 1 when filters change
      }));
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search, filters.status, filters.type]);

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePerPageChange = (newPerPage: number) => {
    setQueryParams((prev) => ({ ...prev, per_page: newPerPage, page: 1 }));
  };

  // Get unique types from projects for the filter dropdown
  const uniqueTypes = useMemo(() => {
    const types = projects.map((p) => p.type).filter(Boolean);
    return [...new Set(types)];
  }, [projects]);

  // Get unique statuses from projects for the filter dropdown
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
          "flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4",
          main ? "p-2" : "p-6",
        )}
      >
        {/* HEADER & BUTTONS */}
        <div className="flex flex-col gap-2">
          {!main && <CardTitle title={t("title")} className="self-start" />}
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
        hideApproveDelete={hideApproveDelete}
        projects={projects}
        isLoading={isLoading}
        meta={meta}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />
    </div>
  );
}
