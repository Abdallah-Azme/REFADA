import React from "react";
import { CampsStats } from "./camps-data";

export default function CampsDetails({
  campStats,
}: {
  campStats: CampsStats[];
}) {
  return (
    <div className="lg:w-1/2 p-8 bg-white rounded-r-2xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-gray-900">بيانات المخيم</h3>
      </div>

      <div className="space-y-6">
        {campStats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center p-2 py-2 border rounded-xl border-gray-200"
          >
            <span className="text-sm text-gray-600 pe-40 2xl:pe-60">
              {stat.label}
            </span>

            <span className="text-base text-gray-900 font-medium">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
