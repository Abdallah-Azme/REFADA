import React from "react";
import { ProjectCard } from "./project-card";
import { projects } from "@/components/pages/home/shelter-projects-section";

export default function ProjectsSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6   gap-4">
      {projects.map((project, index) => {
        const percentage = Math.round((project.current / project.goal) * 100);

        return (
          <div key={index} className="pl-4 sm:basis-1/2 lg:basis-1/4">
            <ProjectCard
              index={index}
              image={project.image}
              title={project.title}
              description={project.description}
              location={project.location}
              tag={project.tag}
              goal={project.goal}
              current={project.current}
              donors={project.donors}
              percentage={percentage}
            />
          </div>
        );
      })}
    </div>
  );
}
