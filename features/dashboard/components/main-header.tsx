import React, { ReactNode } from "react";

export default function MainHeader({
  header,
  children,
}: {
  header: string;
  children: ReactNode;
}) {
  return (
    <h1 className="text-[#1E1E1E] text-lg font-bold gap-2 flex items-center ">
      {children}
      {header}
    </h1>
  );
}
