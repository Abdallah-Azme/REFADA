"use client";

import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useTransition } from "react";

export default function LangSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const nextLocale = locale === "ar" ? "en" : "ar";

  const toggleLang = () => {
    startTransition(async () => {
      // Set cookie
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`; // 1 year

      // Trigger re-render with new locale (SSR will pick cookie)
      router.refresh();
    });
  };

  // Update <html> dir instantly (for immediate layout flip)
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    }
  }, [locale]);

  return (
    <button
      onClick={toggleLang}
      disabled={isPending}
      className=" flex items-center gap-1 text-xs font-medium text-gray-700 cursor-pointer hover:text-primary transition-colors disabled:opacity-60"
    >
      {nextLocale.toUpperCase()} <Globe size={14} />
    </button>
  );
}
