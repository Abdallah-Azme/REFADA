"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { createColumns, Project } from "../table-cols/current-projects-cols";
import ProjectFormDialog from "./add-project-project";
import {
  useDeleteProject,
  useApproveProject,
} from "@/features/projects/hooks/use-projects";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { DeleteConfirmDialog } from "@/features/marital-status/components/delete-confirm-dialog";
import { useTranslations } from "next-intl";
import { Button } from "@/src/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/ui/select";

interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

interface CurrentProjectsTableProps {
  hideApproveDelete?: boolean;
  projects: Project[];
  isLoading?: boolean;
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
}

export default function CurrentProjectsTable({
  hideApproveDelete,
  projects,
  isLoading = false,
  meta,
  onPageChange,
  onPerPageChange,
}: CurrentProjectsTableProps) {
  const t = useTranslations("projects_page");
  const tFamilies = useTranslations("families_page");
  const deleteProject = useDeleteProject();
  const approveProject = useApproveProject();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Edit State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | undefined>(
    undefined,
  );

  const handleEdit = (project: Project): void => {
    setProjectToEdit(project);
    setEditDialogOpen(true);
  };

  const handleDelete = (project: Project): void => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  // Approve project - sets status to 'in_progress'
  const handleUpdate = (project: Project): void => {
    approveProject.mutate({ id: project.id, status: "in_progress" });
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject.mutate(projectToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setProjectToDelete(null);
        },
      });
    }
  };

  const table = useReactTable<Project>({
    data: projects,
    columns: createColumns({
      onEdit: handleEdit,
      onDelete: handleDelete,
      onUpdate: handleUpdate,
      hideApproveDelete,
      t: t,
    }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true, // Server-side pagination
    pageCount: meta?.lastPage ?? -1,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: (meta?.currentPage ?? 1) - 1,
        pageSize: meta?.perPage ?? 15,
      },
    },
  });

  return (
    <div className="rounded-lg bg-white">
      <div className="w-full overflow-x-auto relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
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
                            header.getContext(),
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
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    createColumns({
                      onEdit: handleEdit,
                      onDelete: handleDelete,
                      onUpdate: handleUpdate,
                      t: t,
                    }).length
                  }
                  className="h-24 text-center"
                >
                  {t("no_results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Server-Side Pagination Controls */}
      {meta && onPageChange && onPerPageChange && (
        <div className="flex items-center justify-between mt-4 px-4 py-4 border-t">
          <div className="text-sm text-gray-600">
            {tFamilies("pagination.showing")}{" "}
            {(meta.currentPage - 1) * meta.perPage + 1} -{" "}
            {Math.min(meta.currentPage * meta.perPage, meta.total)}{" "}
            {tFamilies("pagination.of")} {meta.total}
          </div>

          <div className="flex items-center gap-4">
            {/* Per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {tFamilies("pagination.per_page")}:
              </span>
              <Select
                value={meta.perPage.toString()}
                onValueChange={(value) => onPerPageChange(Number(value))}
              >
                <SelectTrigger className="w-[80px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(meta.currentPage - 1)}
                disabled={meta.currentPage <= 1 || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <span className="text-sm text-gray-600">
                {tFamilies("pagination.page")} {meta.currentPage}{" "}
                {tFamilies("pagination.of")} {meta.lastPage}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(meta.currentPage + 1)}
                disabled={meta.currentPage >= meta.lastPage || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title={t("delete_dialog.title")}
        description={t("delete_dialog.description", {
          name: projectToDelete?.name || "",
        })}
        isPending={deleteProject.isPending}
      />

      {/* Edit Dialog */}
      <ProjectFormDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setProjectToEdit(undefined);
        }}
        project={projectToEdit}
        trigger={null} // Hidden trigger
      />
    </div>
  );
}
