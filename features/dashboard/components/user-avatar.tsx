import React from "react";

export default function UserAvatar() {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="w-10 h-10 bg-gray-200 rounded-full" />
      <span className="text-gray-800 font-medium text-sm hidden 2xl:block">
        أحمد محمد عبد الله
      </span>
    </div>
  );
}
