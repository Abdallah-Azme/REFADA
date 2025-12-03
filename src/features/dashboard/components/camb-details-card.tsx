"use client";

import React from "react";
import Image from "next/image";
import ImageFallback from "@/components/shared/image-fallback";

export default function CambDetailsCard() {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm h-full flex flex-col justify-between">
      <div className="flex flex-col-reverse md:flex-row gap-6 items-start">
        {/* Image */}
        <div className="w-full md:w-[180px]  relative shrink-0">
          <ImageFallback
            width={90}
            height={90}
            src="/camb-image.png"
            alt="مخيم جباليا"
            className="w-full h-full object-cover rounded-2xl bg-gray-200"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/180x120?text=Camp+Image";
            }}
          />
        </div>
        {/* Text Content */}
        <div className="flex-1 space-y-4">
          <p className="text-gray-700 leading-8 text-lg font-medium">
            يُعتبر مخيم جباليا أكبر مخيم للاجئين الفلسطينيين في فلسطين، حيث يعيش
            فيه 119,000 فلسطيني يتوزعون على مساحة لا تتجاوز 1.4 كيلومتر مربع،
            مما يجعله واحدًا من أكثر الأماكن اكتظاظًا بالسكان 1948. يُعتبر مخيم
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-8 space-y-3 border-t border-transparent pt-4">
        <div className="flex items-center  gap-2 ">
          <div className="text-xl font-bold text-[#1B2540] ">
            +972-22-333-4444 - +972-22-000-4444
          </div>
          <span className="text-xl font-medium text-gray-600">:تواصل معنا</span>
        </div>
        <div className="flex items-center gap-2 ">
          <div className="text-xl font-bold text-[#1B2540]">10008890003444</div>
          <span className="text-xl font-medium text-gray-600">:حساب بنكي</span>
        </div>
      </div>
    </div>
  );
}
