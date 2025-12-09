"use client";

import { Project } from "../api/projects.api";
import { useApproveProject } from "../hooks/use-projects";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface ApproveProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApproveProjectDialog({
  project,
  open,
  onOpenChange,
}: ApproveProjectDialogProps) {
  const approveMutation = useApproveProject();

  const handleApprove = (status: "in_progress" | "cancelled") => {
    if (project) {
      approveMutation.mutate(
        { id: project.id, status },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>الموافقة على المشروع</DialogTitle>
          <DialogDescription>
            اختر حالة المشروع بعد الموافقة عليه
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">المشروع: {project.name}</p>
            <p className="text-sm text-gray-500">النوع: {project.type}</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={approveMutation.isPending}
          >
            إلغاء
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleApprove("cancelled")}
            disabled={approveMutation.isPending}
            className="gap-2"
          >
            <XCircle className="h-4 w-4" />
            ملغي
          </Button>
          <Button
            onClick={() => handleApprove("in_progress")}
            disabled={approveMutation.isPending}
            className="gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            قيد التنفيذ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
