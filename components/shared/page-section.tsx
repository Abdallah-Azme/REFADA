"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageSectionProps {
  title: string;
  icon?: ReactNode;
  description: ReactNode; // supports rich text or HTML
  className?: string;
}

export function PageSection({
  title,
  icon,
  description,
  className,
}: PageSectionProps) {
  return (
    <section
      className={cn(
        "bg-white rounded-2xl p-6 shadow-sm border text-right space-y-4",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-primary text-xl">{icon}</span>}
        <h1 className="text-xl font-semibold text-[#1E1E1E]">{title}</h1>
      </div>

      <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed rtl text-right">
        {description}
      </div>
    </section>
  );
}
