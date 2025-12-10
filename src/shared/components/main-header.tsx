import React, { ReactNode } from "react";

export default function MainHeader({
  header,
  subheader,
  children,
}: {
  header: string;
  subheader?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-[#1E1E1E] text-lg font-bold gap-2 flex items-center ">
        {children}
        {header}
      </h1>
      {subheader && <p className="text-sm text-gray-500">{subheader}</p>}
    </div>
  );
}
