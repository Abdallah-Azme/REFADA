import React from "react";
import AddProjectDialog from "./add-project-project";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("common");

  return (
    <div className="flex justify-between items-start gap-2 w-full sm:w-auto">
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        {showAddProject && <AddProjectDialog />}{" "}
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            size="lg"
            variant="outline"
            className="px-4 sm:px-6 flex-1 sm:flex-none py-2 rounded-xl"
            onClick={() => form.reset()}
          >
            <RotateCcw className="w-4 h-4 text-primary" />
            {t("reset")}
          </Button>
        </div>
      </div>
    </div>
  );
}
