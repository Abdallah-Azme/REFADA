import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, SearchCheck } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

export default function FamilyButtonsActions({
  form,
}: {
  form: UseFormReturn<
    {
      familyName: string;
      status: string;
      caseStatus: string;
    },
    any,
    {
      familyName: string;
      status: string;
      caseStatus: string;
    }
  >;
}) {
  return (
    <div className="flex justify-between items-start gap-2">
      <div className="flex gap-1">
        <Button
          className="bg-primary w-1/2 text-white px-6 flex-1 py-2 rounded-xl flex items-center gap-2 text-sm font-medium"
          size="lg"
        >
          <SearchCheck className="w-4 h-4" />
          بحث
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="px-6 flex-1 shrink-0 w-1/2 py-2 rounded-xl"
          onClick={() => form.reset()}
        >
          <RotateCcw className="w-4 h-4 text-primary" />
          إعادة البحث
        </Button>
      </div>
    </div>
  );
}
