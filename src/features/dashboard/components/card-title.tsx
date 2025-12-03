import { cn } from "@/lib/utils";
import React from "react";

export default function CardTitle({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h3 className={cn("text-lg font-bold text-[#333333] mb-6", className)}>
      {title}
    </h3>
  );
}
