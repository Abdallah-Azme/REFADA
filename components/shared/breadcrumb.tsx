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
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <Link
              href={item.href}
              className={cn(
                "hover:text-primary transition-colors",
                index === items.length - 1 && "text-primary font-medium"
              )}
            >
              {item.name}
            </Link>
            {index < items.length - 1 && (
              <span className="text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
