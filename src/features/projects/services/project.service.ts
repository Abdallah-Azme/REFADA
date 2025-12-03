import { Project, ProjectStatus } from "../types/project.schema";

export const projectService = {
  getStatusLabel(status: ProjectStatus): string {
    const labels = {
      [ProjectStatus.Pending]: "قيد الانتظار",
      [ProjectStatus.Approved]: "مقبول",
      [ProjectStatus.Rejected]: "مرفوض",
    };
    return labels[status];
  },

  getStatusBadgeVariant(
    status: ProjectStatus
  ): "default" | "destructive" | "secondary" {
    if (status === ProjectStatus.Approved) return "default";
    if (status === ProjectStatus.Rejected) return "destructive";
    return "secondary";
  },

  getStatusBadgeClass(status: ProjectStatus): string {
    const classes = {
      [ProjectStatus.Approved]: "bg-green-500 hover:bg-green-600",
      [ProjectStatus.Pending]: "bg-yellow-500 hover:bg-yellow-600 text-black",
      [ProjectStatus.Rejected]: "",
    };
    return classes[status];
  },

  isPending(project: Project): boolean {
    return project.status === ProjectStatus.Pending;
  },

  approve(project: Project): Project {
    return { ...project, status: ProjectStatus.Approved };
  },

  reject(project: Project): Project {
    return { ...project, status: ProjectStatus.Rejected };
  },

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  },
};
