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
import React, { useState } from "react";
import {
  createColumns,
  Project, // This now refers to the API type we updated in steps 535
} from "../table-cols/current-projects-cols";
import PaginationControls from "./pagination-controls";
// ... imports ...
import ProjectFormDialog from "./add-project-project";
import {
  useProjects,
  useDeleteProject,
} from "@/features/projects/hooks/use-projects";
import { Loader2 } from "lucide-react";
import { DeleteConfirmDialog } from "@/features/marital-status/components/delete-confirm-dialog";

export default function CurrentProjectsTable() {
  const { data: projectsData, isLoading } = useProjects();
  const deleteProject = useDeleteProject();

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

  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Edit State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | undefined>(
    undefined
  );

  const data = projectsData?.data || [];

  const handleEdit = (project: Project): void => {
    setProjectToEdit(project);
    setEditDialogOpen(true);
  };

  const handleDelete = (project: Project): void => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleUpdate = (project: Project): void => {
    console.log("Update status handler - Approve logic?", project);
    // TODO: Wire up approveProjectApi if needed
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
    data,
    columns: createColumns({
      onEdit: handleEdit,
      onDelete: handleDelete,
      onUpdate: handleUpdate,
    }),
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white">
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
                    createColumns({
                      onEdit: handleEdit,
                      onDelete: handleDelete,
                      onUpdate: handleUpdate,
                    }).length
                  }
                  className="h-24 text-center"
                >
                  لا توجد نتائج.
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="حذف المشروع"
        description={`هل أنت متأكد من حذف المشروع "${projectToDelete?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
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
        trigger={<></>} // Hidden trigger
      />
    </div>
  );
}
