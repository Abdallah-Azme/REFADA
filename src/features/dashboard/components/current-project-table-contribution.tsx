"use client";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import {
  createColumnsForContributor,
  Project,
} from "../table-cols/project-contribution-cols";
import PaginationControls from "./pagination-controls";
import { Button } from "@/components/ui/button";
import { RotateCcw, SearchCheck } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ProjectDetailsDialog from "./project-details-dialog";

import ContributeDialog from "./contribute-dialog";
import { Input } from "@/components/ui/input";
import {
  useContributorHistory,
  ContributorFamily,
} from "@/features/contributor/hooks/use-contributor-history";
import ContributionFamiliesDialog from "@/features/contributor/components/contribution-families-dialog";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().optional(),
  project: z.string().optional(),
  status: z.string().optional(),
  family: z.string().optional(),
});

interface CurrentProjectsTableContributionProps {
  projects?: Project[];
  campId?: number;
}

export default function CurrentProjectsTableContribution({
  projects = [],
  campId,
}: CurrentProjectsTableContributionProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      project: "",
      status: "",
      family: "",
    },
  });

  const t = useTranslations("project_columns");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isContributeDialogOpen, setIsContributeDialogOpen] =
    React.useState(false);

  // History dialog state
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = React.useState(false);
  const [selectedHistoryFamilies, setSelectedHistoryFamilies] = React.useState<
    ContributorFamily[]
  >([]);
  const [selectedHistoryProjectName, setSelectedHistoryProjectName] =
    React.useState<string>("");

  // Fetch contributor history
  const { data: historyData } = useContributorHistory();
  const historyItems = historyData?.data || [];

  // Filter projects based on search
  const watchedName = form.watch("name");
  const watchedStatus = form.watch("status");

  const filteredProjects = React.useMemo(() => {
    let filtered = [...projects];

    if (watchedName) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(watchedName.toLowerCase())
      );
    }

    if (watchedStatus) {
      filtered = filtered.filter((p) => p.status === watchedStatus);
    }

    return filtered;
  }, [projects, watchedName, watchedStatus]);

  const handleView = (project: Project): void => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleViewHistory = (project: Project): void => {
    // Find the contribution history for this project
    // Note: The history API returns items with a 'project' object inside.
    // We need to match the project ID.
    const historyItem = historyItems.find(
      (item: { project: { id: number } }) => item.project.id === project.id
    );

    if (
      historyItem &&
      historyItem.contributorFamilies &&
      historyItem.contributorFamilies.length > 0
    ) {
      setSelectedHistoryFamilies(historyItem.contributorFamilies);
      setSelectedHistoryProjectName(project.name);
      setIsHistoryDialogOpen(true);
    } else {
      // If no history found or no families, show toast or just open project details?
      // User request specifically asked to "show the data of the families i contributed to".
      // If not found, maybe just show info toast.
      // Or fallback to standard project view if no families found?
      // Let's fallback to standard view if no history, but toast might be better if they expect families.
      // But for now, let's try to show the families dialog if we have data, otherwise fallback to project details.
      if (historyItem) {
        setSelectedHistoryFamilies([]);
        setSelectedHistoryProjectName(project.name);
        setIsHistoryDialogOpen(true);
      } else {
        toast.info("لم يتم العثور على سجل مساهمات لهذا المشروع");
      }
    }
  };

  const handleContribute = (project: Project): void => {
    setSelectedProject(project);
    setIsContributeDialogOpen(true);
    setIsDialogOpen(false);
  };

  const table = useReactTable<Project>({
    data: filteredProjects,
    columns: createColumnsForContributor(
      {
        onView: handleViewHistory, // Use handleViewHistory for the eye icon
        onContribute: handleContribute,
      },
      t
    ),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <div className="rounded-lg bg-white">
      <div className="p-6">
        <div className="flex justify-between items-center gap-2">
          {/* FORM */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-3"
            >
              {/* اسم المشروع */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t("search_project")}
                        {...field}
                        className="w-[200px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700"
                      />
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
                          <SelectValue placeholder={t("project_status")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">
                            {t("pending")}
                          </SelectItem>
                          <SelectItem value="approved">
                            {t("approved")}
                          </SelectItem>
                          <SelectItem value="completed">
                            {t("completed")}
                          </SelectItem>
                          <SelectItem value="rejected">
                            {t("rejected")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              size="lg"
              variant="outline"
              className="px-6 py-2 rounded-xl flex items-center gap-2"
              onClick={() => form.reset()}
            >
              <RotateCcw className="w-4 h-4 text-primary" />
              {t("reset_search")}
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <Table className="min-w-[960px]">
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    createColumnsForContributor(
                      {
                        onView: handleView,
                        onContribute: handleContribute,
                      },
                      t
                    ).length
                  }
                  className="h-24 text-center"
                >
                  {projects.length === 0 ? t("no_projects") : t("no_results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - separate from table */}
      <div className="flex items-center justify-center px-2 py-4">
        <PaginationControls table={table} />
      </div>

      <ProjectDetailsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        project={selectedProject}
        onContribute={handleContribute}
      />

      <ContributeDialog
        isOpen={isContributeDialogOpen}
        onClose={() => setIsContributeDialogOpen(false)}
        project={selectedProject}
        campId={campId}
      />

      <ContributionFamiliesDialog
        isOpen={isHistoryDialogOpen}
        onClose={() => setIsHistoryDialogOpen(false)}
        families={selectedHistoryFamilies}
        projectName={selectedHistoryProjectName}
      />
    </div>
  );
}
