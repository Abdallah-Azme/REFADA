"use client";

import Logo from "@/components/logo";
import ImageFallback from "@/components/shared/image-fallback";
import { useTranslations } from "next-intl";

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("auth");

  return (
    <section className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden my-10">
      {/* Image Section */}
      <div className="hidden lg:block flex-1 relative bg-gray-100 h-[700px]">
        <ImageFallback
          src="/pages/auth/auth-image.webp"
          alt={t("auth_image_alt")}
          fill
          className="object-cover brightness-75"
        />
      </div>
      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center px-8 py-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center gap-5 w-full  ">
          <div className="flex  items-center gap-2">
            <Logo />
            <div className="flex flex-col gap-2 text-start">
              <p className="text-primary font-bold ">{t("header_title")}</p>
              <p className="text-primary font-bold ">{t("header_subtitle")}</p>
            </div>
          </div>

          <div className="flex-1 w-full px-2 max-w-[350px] mx-auto">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
