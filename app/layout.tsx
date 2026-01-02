import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { Cairo } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import { settingsApi } from "@/features/settings/api/settings.api";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  try {
    const settingsResponse = await settingsApi.get();
    const settings = settingsResponse.data;

    return {
      title: settings.siteName[locale as "ar" | "en"] || "Refad",
      icons: {
        icon: settings.favicon || "/favicon.ico",
      },
      description: "جمعية رفاد الخيرية - غزة",
    };
  } catch (error) {
    return {
      title: "Refad",
      icons: {
        icon: "/favicon.ico",
      },
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={`${cairo.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
