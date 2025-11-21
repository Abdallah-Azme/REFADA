import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import React from "react";

export default function PrintingProjects() {
  return (
    <Button
      variant={"outline"}
      className="bg-white border border-[#27AE60] text-muted-foreground font-semibold py-4"
    >
      <Printer className="mx-1 size-[26px]  text-[#27AE60]" />
      طباعة
    </Button>
  );
}
