"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageSectionProps {
  description: ReactNode; // supports rich text or HTML
  className?: string;
}

export function PageSection({ description, className }: PageSectionProps) {
  return (
    <section
      className={cn(
        "bg-white rounded-2xl p-6 shadow-sm border text-right space-y-4",
        className
      )}
    >
      <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed ">
        {description}
      </div>
    </section>
  );
}
