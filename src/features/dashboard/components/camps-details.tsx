import { CampsStats } from "./camps-data";

export default function CampsDetails({
  campStats,
}: {
  campStats: CampsStats[];
}) {
  return (
    <div className="lg:w-1/2 p-4 bg-white rounded-r-2xl" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-gray-900">بيانات الإيواء</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {campStats.map((stat, index) => {
          const isLastTwo = index >= campStats.length - 2;

          return (
            <div
              key={index}
              className={`
                flex items-center justify-between p-4 border rounded-xl border-[#E4E4E4] bg-white
                ${isLastTwo ? "col-span-1" : "col-span-2"}
              `}
            >
              <span className="text-sm text-[#4F4F4F] font-semibold">
                {stat.label}
              </span>

              <span className="text-base text-[#4F4F4F] font-semibold">
                {stat.value}
              </span>

              {!isLastTwo && <div />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
