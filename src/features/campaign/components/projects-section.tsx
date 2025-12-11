import React from "react";
import { ProjectCard } from "./project-card";
import { Project } from "@/features/camps/types/camp.schema";

interface ProjectsSectionProps {
  projects?: Project[];
  campName?: string;
}

export default function ProjectsSection({ 
  projects = [],
  campName = ""
}: ProjectsSectionProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>لا توجد مشاريع متاحة</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6 gap-4">
      {projects.map((project, index) => {
        const goal = project.totalRemaining + project.totalReceived;
        const current = project.totalReceived;
        const percentage = goal > 0 ? Math.round((current / goal) * 100) : 0;

        return (
          <div key={project.id} className="pl-4 sm:basis-1/2 lg:basis-1/4">
            <ProjectCard
              index={index}
              image={project.projectImage || "/placeholder.jpg"}
              title={project.name}
              description={project.notes || "وصف المشروع غير متوفر حالياً"}
              location={campName || "غزة"}
              tag={project.type || "مشروع إغاثي"}
              goal={goal}
              current={current}
              donors={project.beneficiaryCount || 0}
              percentage={percentage}
              camp={campName}
            />
          </div>
        );
      })}
    </div>
  );
}
