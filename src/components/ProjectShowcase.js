import Image from "next/image";
import DeviceMockup from "./DeviceMockup";
import PlaceholderArt from "./PlaceholderArt";
import ScrollReveal from "./ScrollReveal";
import MagneticButton from "./MagneticButton";
import ArrowIcon from "./ArrowIcon";

export default function ProjectShowcase({ project, seed, tilt = "-rotate-2", size = "regular" }) {
  return (
    <ScrollReveal variant="scale" className="group">
      <DeviceMockup rotate={tilt} className={size === "large" ? "max-w-xl" : "max-w-md"}>
        {project.image ? (
          <div className="relative h-full w-full overflow-hidden transition-transform duration-500 group-hover:scale-105">
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        ) : (
          <PlaceholderArt
            seed={seed}
            mark={project.index}
            label={`${project.title} preview placeholder`}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </DeviceMockup>

      <h3 className="mt-7 font-display font-semibold uppercase tracking-tight text-[clamp(1.5rem,3vw,2.5rem)]">
        {project.title}
      </h3>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-paper/45">
        {project.category} — {project.year}
      </p>

      <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">
        {project.description}
      </p>

      <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.15em] text-paper/40">
        {project.stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>

      {project.href ? (
        <MagneticButton
          as="a"
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          cursorLabel="View"
          className="group/cta mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-paper"
        >
          {project.cta}
          <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
        </MagneticButton>
      ) : (
        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
          {project.cta}
        </span>
      )}
    </ScrollReveal>
  );
}
