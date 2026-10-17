import { PROJECTS } from "@/lib/content";
import SectionHeading from "./SectionHeading";
import ProjectShowcase from "./ProjectShowcase";
import Parallax from "./Parallax";

// Projects 01 & 03 in the left column, 02 & 04 in the right
const COLUMNS = [0, 1].map((column) =>
  PROJECTS.map((project, i) => ({ project, i })).filter(({ i }) => i % 2 === column)
);

export default function Work() {
  return (
    <section id="work" className="relative bg-ink py-28 sm:py-36 lg:py-44 overflow-clip">
      <div className="mx-auto max-w-[100rem] px-5 sm:px-8 lg:px-12 xl:px-16">
        <SectionHeading eyebrow="My Work" title="Crafted With Purpose" className="mb-16 sm:mb-24" />

        {/* Two columns that each move as one rigid unit, so the spacing
            between cards never changes; the right column starts lower and
            drifts up past the left one. Below `md` the columns dissolve
            (display: contents) and `order` restores the 1-2-3-4 reading order. */}
        <div className="grid grid-cols-1 gap-y-20 sm:gap-y-24 md:grid-cols-2 md:gap-x-10 lg:gap-x-16">
          {COLUMNS.map((items, column) => {
            const cards = items.map(({ project, i }) => (
              <div key={project.title} id={`project-${project.slug}`} className="scroll-mt-24" style={{ order: i }}>
                <ProjectShowcase project={project} delay={column * 0.12} />
              </div>
            ));
            const columnClass = "contents md:flex md:flex-col md:gap-y-24";

            return column === 0 ? (
              <div key={column} className={columnClass}>
                {cards}
              </div>
            ) : (
              <Parallax key={column} from={90} to={-90} className={`${columnClass} md:pt-32`}>
                {cards}
              </Parallax>
            );
          })}
        </div>
      </div>
    </section>
  );
}
