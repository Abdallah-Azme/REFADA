import { Button } from "@/components/ui/button";
import { Plane, Printer, Send } from "lucide-react";
import React from "react";

export default function SendReport() {
  return (
    <Button
      variant={"outline"}
      className="bg-[#1F2A49]   text-white font-semibold px-8 py-5"
    >
      <Send className="mx-1 size-[26px] text-white" />
      ارسال
    </Button>
  );
}
