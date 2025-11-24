"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      className={cn("text-sm text-muted-foreground", className)}
      aria-label="breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1">
              {isLast ? (
                <span className="text-[#4a8279] font-medium">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "hover:text-primary transition-colors",
                    index === items.length - 1 && ""
                  )}
                >
                  {item.name}
                </Link>
              )}
              {!isLast && <span className="text-gray-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
