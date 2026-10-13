import { PROJECTS } from "@/lib/content";
import SectionHeading from "./SectionHeading";
import ProjectShowcase from "./ProjectShowcase";

export default function Work() {
  return (
    <section id="work" className="relative bg-ink py-28 sm:py-36 lg:py-44 overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <SectionHeading eyebrow="My Work" title="Crafted With Purpose" className="mb-16 sm:mb-24" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-20 sm:gap-y-24">
          {PROJECTS.map((project, i) => (
            <ProjectShowcase key={project.title} project={project} delay={(i % 2) * 0.12} column={i % 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
