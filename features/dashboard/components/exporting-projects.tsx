import { Button } from "@/components/ui/button";
import { Sheet } from "lucide-react";

export default function ExportingProjects() {
  return (
    <Button
      variant={"outline"}
      className="text-white bg-[#27AE60] border border-[#27AE60]  font-semibold py-4"
    >
      <Sheet className="mx-1 size-[26px]  text-white" />
      تصدير
    </Button>
  );
}
