import React from "react";
import AddProjectDialog from "./add-project-project";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

export default function ProjectButtonsActions({
  form,
  showAddProject = true,
}: {
  form: UseFormReturn<
    {
      search: string;
      status: string;
      type: string;
    },
    any,
    {
      search: string;
      status: string;
      type: string;
    }
  >;
  showAddProject: boolean;
}) {
  return (
    <div className="flex justify-between items-start gap-2">
      <div className="flex flex-col gap-2">
        {showAddProject && <AddProjectDialog />}{" "}
        <div className="flex gap-1">
          <Button
            size="lg"
            variant="outline"
            className="px-6 flex-1 shrink-0 py-2 rounded-xl"
            onClick={() => form.reset()}
          >
            <RotateCcw className="w-4 h-4 text-primary" />
            إعادة ضبط
          </Button>
        </div>
      </div>
    </div>
  );
}
