"use client";

import { useState } from "react";
import { Button } from "@/src/shared/ui/button";
import { FolderKanban, Loader2 } from "lucide-react";
import MainHeader from "@/src/shared/components/main-header";
import {
  ApproveProjectDialog,
  useProjects,
  useDeleteProject,
} from "@/features/projects";
import { Project } from "@/features/projects/api/projects.api";
import AdminProjectsTable from "@/features/dashboard/components/admin-projects-table";
import ProjectDetailsDialog from "@/features/dashboard/components/project-details-dialog";
import { DeleteConfirmDialog } from "@/features/marital-status";

export default function AdminProjectsPage() {
  const { data, isLoading, error } = useProjects();
  const deleteMutation = useDeleteProject();

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [approvingProject, setApprovingProject] = useState<Project | null>(
    null
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const projects = data?.data || [];

  const handleApprove = (project: Project) => {
    setApprovingProject(project);
    setApproveDialogOpen(true);
  };

  const handleView = (project: Project) => {
    // Map API Project to the format expected by ProjectDetailsDialog
    const mappedProject = {
      id: project.id,
      projectName: project.name,
      camp: project.camp,
      total: project.totalReceived + project.totalRemaining,
      received: project.totalReceived,
      remaining: project.totalRemaining,
    };
    setViewingProject(mappedProject);
    setViewDialogOpen(true);
  };

  const handleDelete = (project: Project) => {
    setDeletingProject(project);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingProject) {
      deleteMutation.mutate(deletingProject.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeletingProject(null);
        },
      });
    }
  };

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <MainHeader header="إدارة المشاريع">
          <FolderKanban className="text-primary" />
        </MainHeader>
      </div>

      {/* Projects Table */}
      <div className="w-full bg-white rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">قائمة المشاريع</h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-3 text-gray-600">جاري تحميل البيانات...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-600">حدث خطأ أثناء تحميل البيانات</p>
          </div>
        ) : (
          <AdminProjectsTable
            data={projects}
            onApprove={handleApprove}
            onView={handleView}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Approve Dialog */}
      <ApproveProjectDialog
        project={approvingProject}
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
      />

      {/* View Details Dialog */}
      <ProjectDetailsDialog
        isOpen={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        project={viewingProject}
        onContribute={() => {}}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="حذف المشروع"
        description={`هل أنت متأكد من حذف المشروع "${deletingProject?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
