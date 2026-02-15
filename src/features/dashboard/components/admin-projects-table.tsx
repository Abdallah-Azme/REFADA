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
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import {
  createAdminProjectColumns,
  dummyAdminProjects,
  AdminProject,
} from "../table-cols/admin-projects-cols";
import PaginationControls from "./pagination-controls";

import { Loader2, FileSpreadsheet } from "lucide-react";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { Project } from "@/features/projects/api/projects.api";
import { exportToExcel, formatProjectsForExport } from "@/src/lib/export-utils";
import { toast } from "sonner";

interface AdminProjectsTableProps {
  data?: Project[];
  onApprove?: (project: Project) => void;
  onView?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export default function AdminProjectsTable({
  data: propData,
  onApprove,
  onView,
  onDelete,
}: AdminProjectsTableProps) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: response, isLoading, error } = useProjects();

  // Use propData if provided, otherwise fetch from API
  const apiData = propData || response?.data || [];

  const data = React.useMemo(() => {
    return apiData.map((p) => ({
      id: p.id,
      name: p.name,
      representative: "", // API might not expose addedBy directly on Project type
      date: new Date(p.createdAt).toLocaleDateString("en-US"), // Format date
      type: p.type,
      location: p.camp,
      beneficiaryCount: p.beneficiaryCount,
      budget: (p.totalRemaining + p.totalReceived).toString(),
      collected: p.totalReceived,
      status: p.status as "pending" | "approved" | "rejected",
      image: p.projectImage,
    })) as unknown as AdminProject[];
  }, [apiData]);

  const handleAccept = (project: any): void => {
    // Find the original project from apiData
    const originalProject = apiData.find((p) => p.id === project.id);
    if (originalProject && onApprove) {
      onApprove(originalProject);
    }
  };

  const handleDecline = (project: any): void => {
    // Find the original project from apiData
    const originalProject = apiData.find((p) => p.id === project.id);
    if (originalProject && onDelete) {
      onDelete(originalProject);
    }
  };

  const handleView = (project: any): void => {
    // Find the original project from apiData
    const originalProject = apiData.find((p) => p.id === project.id);
    if (originalProject && onView) {
      onView(originalProject);
    }
  };

  const table = useReactTable({
    data,
    columns: createAdminProjectColumns({
      onAccept: handleAccept,
      onDecline: handleDecline,
      onView: handleView,
    }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    // @ts-ignore
    autoResetRowSelection: false,
    getRowId: (row) => row.id.toString(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
    },
  });

  // Persistent selection map logic
  const [selectedProjectsMap, setSelectedProjectsMap] = React.useState<
    Record<string, Project>
  >({});

  React.useEffect(() => {
    const newMap = { ...selectedProjectsMap };
    let hasChanges = false;

    // Remove unselected
    Object.keys(newMap).forEach((id) => {
      // @ts-ignore
      if (!rowSelection[id]) {
        delete newMap[id];
        hasChanges = true;
      }
    });

    // Add selected from current page
    apiData.forEach((project) => {
      const id = project.id.toString();
      // @ts-ignore
      if (rowSelection[id] && !newMap[id]) {
        newMap[id] = project;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setSelectedProjectsMap(newMap);
    }
  }, [rowSelection, apiData, selectedProjectsMap]);

  const selectedProjects = React.useMemo(
    () => Object.values(selectedProjectsMap),
    [selectedProjectsMap],
  );

  // Export to Excel handler
  const handleExportExcel = () => {
    try {
      const dataToExport =
        selectedProjects.length > 0 ? selectedProjects : apiData;
      const formattedData = formatProjectsForExport(dataToExport);
      const filename =
        selectedProjects.length > 0
          ? `projects_selected_${selectedProjects.length}_${new Date().toISOString().split("T")[0]}`
          : `projects_all_${new Date().toISOString().split("T")[0]}`;

      exportToExcel(formattedData, filename, "Projects");
      toast.success("تم تصدير البيانات بنجاح");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("حدث خطأ أثناء التصدير");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">جاري تحميل المشاريع...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-8 text-center text-red-600">
        حدث خطأ أثناء تحميل البيانات
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white">
      {/* Export All Button */}
      <div className="flex items-center justify-end p-4 border-b">
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 hover:text-green-800 transition-colors"
        >
          <FileSpreadsheet className="h-4 w-4" />
          {selectedProjects.length > 0
            ? `تصدير المحدد (${selectedProjects.length})`
            : "تصدير الكل"}
        </button>
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
                <TableRow key={row.id}>
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
                    createAdminProjectColumns({
                      onAccept: handleAccept,
                      onDecline: handleDecline,
                      onView: handleView,
                    }).length
                  }
                  className="h-24 text-center"
                >
                  لا يوجد مشاريع.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center px-2 py-4">
        <PaginationControls table={table} />
      </div>
    </div>
  );
}
