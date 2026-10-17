import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import ArrowIcon from "./ArrowIcon";

/**
 * Gallery frame: a plain, square-cornered rectangle. Project artwork drifts
 * slightly inside the frame as the page scrolls (a CSS scroll-driven drift,
 * see .drift in globals.css) and zooms gently on hover.
 */
function GalleryImage({ project }) {
  return (
    <div className="drift-frame relative aspect-4/3 w-full overflow-clip border border-paper/10 bg-paper/4">
      {project.image && (
        <div className="drift absolute -inset-y-[18%] inset-x-0">
          <div className="relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              // Black and white until the card is hovered (or its link focused)
              className="object-cover object-top grayscale transition-[filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0 group-focus-within:grayscale-0"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectShowcase({ project, delay = 0 }) {
  const href = `/work/${project.slug}`;

  // Column-level parallax lives in Work — per-card offsets pulled cards in
  // the same column apart as they scrolled through at different progress
  return (
    <ScrollReveal className="group" delay={delay} y={40} amount={0.2}>
      {/* Same destination as the "View Project" button below, so it's kept
          out of the tab order to avoid a duplicate stop */}
      <Link href={href} tabIndex={-1} aria-hidden="true" data-cursor-label="View" className="block">
        <GalleryImage project={project} />
      </Link>

      <div className="mt-6 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/45">
        <span>
          {project.index} — {project.category}
        </span>
        <span>{project.year}</span>
      </div>

      <h3 className="mt-3 font-display font-semibold uppercase tracking-tight text-[clamp(1.75rem,3vw,2.5rem)] leading-none">
        {project.title}
      </h3>

      <p className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-paper/70">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <ul className="flex flex-wrap gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.15em] text-paper/40">
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>

        <Link
          href={href}
          data-cursor-label="View"
          className="group/cta inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-paper"
        >
          View Project
          <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
        </Link>
      </div>
    </ScrollReveal>
  );
}
