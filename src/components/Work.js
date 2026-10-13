import { PROJECTS } from "@/lib/content";
import SectionHeading from "./SectionHeading";
import ProjectShowcase from "./ProjectShowcase";

export default function Work() {
  return (
    <section id="work" className="relative bg-ink py-28 sm:py-36 lg:py-44 overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <SectionHeading eyebrow="My Work" title="Crafted With Purpose" className="mb-20 sm:mb-28" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-20 sm:gap-y-24">
          {PROJECTS.map((project, i) => (
            <div key={project.title} className={i % 2 === 1 ? "sm:mt-28 lg:mt-40" : ""}>
              <ProjectShowcase
                project={project}
                seed={i + 1}
                tilt={i % 2 === 0 ? "-rotate-2" : "rotate-2"}
                size={i % 3 === 0 ? "large" : "regular"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
