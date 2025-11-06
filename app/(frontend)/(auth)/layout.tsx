"use client";

import Logo from "@/components/logo";
import ImageFallback from "@/components/shared/image-fallback";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden my-10">
      {/* Image Section */}
      <div className="hidden lg:block flex-1 relative bg-gray-100 h-[700px]">
        <ImageFallback
          src="/pages/auth/auth-image.webp"
          alt="أهل غزة"
          fill
          className="object-cover brightness-75"
        />
      </div>
      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center px-8 py-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center gap-5 w-full  ">
          <Logo />

          <div className="flex-1 w-full px-2 max-w-[350px] mx-auto">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
