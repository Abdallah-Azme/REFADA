import AnimatedNumber from "@/components/animated-number";
import { Baby, FolderOpenDot, Users } from "lucide-react";

export default function CampStats() {
  return (
    <div className="flex h-full shadow-sm border flex-col sm:flex-row items-center justify-between bg-white gap-6 text-[#1E1E1E] px-6 py-6 rounded-md">
      {/* Families */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Users />
        </div>

        <p className="font-bold text-lg">عدد العائلات:</p>
        <p className="text-2xl font-bold text-primary">
          <AnimatedNumber to={500} /> عائلة
        </p>
      </div>

      {/* Births */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Baby />
        </div>

        <p className="font-bold text-lg">عدد المواليد:</p>
        <p className="text-2xl font-bold text-primary">
          <AnimatedNumber to={5000} /> مولود
        </p>
      </div>

      {/* Projects */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <FolderOpenDot />
        </div>

        <p className="font-bold text-lg">عدد المشاريع:</p>
        <p className="text-2xl font-bold text-primary">
          <AnimatedNumber to={20} /> مشروع
        </p>
      </div>
    </div>
  );
}
