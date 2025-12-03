import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet } from "lucide-react";

export default function ExportingProjects({
  className,
}: {
  className?: string;
}) {
  return (
    <Button
      variant={"outline"}
      className={cn(
        "text-white bg-[#27AE60] border border-[#27AE60]  font-semibold py-4",
        className
      )}
    >
      <Sheet className="mx-1 size-[26px]  text-white" />
      تصدير
    </Button>
  );
}
