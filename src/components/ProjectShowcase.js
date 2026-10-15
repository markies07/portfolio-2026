"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";
import ScrollReveal from "./ScrollReveal";
import MagneticButton from "./MagneticButton";
import ArrowIcon from "./ArrowIcon";

/**
 * Gallery frame: a plain, square-cornered rectangle. Project artwork drifts
 * slightly inside the frame as the page scrolls (parallax) and zooms gently
 * on hover.
 */
function GalleryImage({ project }) {
  const ref = useRef(null);
  const prefersReduced = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div
      ref={ref}
      className="relative aspect-4/3 w-full overflow-hidden border border-paper/10 bg-paper/4"
    >
      {project.image && (
        <motion.div
          className="absolute -inset-y-[18%] inset-x-0"
          style={prefersReduced ? undefined : { y }}
        >
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
        </motion.div>
      )}
    </div>
  );
}

export default function ProjectShowcase({ project, delay = 0 }) {
  // Column-level parallax lives in Work — per-card offsets pulled cards in
  // the same column apart as they scrolled through at different progress
  return (
    <ScrollReveal className="group" delay={delay} y={40} amount={0.2}>
      <GalleryImage project={project} />

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

        {/* The repo when it's public, otherwise the live site */}
        {project.links?.repo || project.links?.live ? (
          <MagneticButton
            as="a"
            href={project.links.repo || project.links.live}
            target="_blank"
            rel="noopener noreferrer"
            cursorLabel="View"
            className="group/cta inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-paper"
          >
            {project.links.repo ? "View on GitHub" : "Visit website"}
            <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
          </MagneticButton>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
            Private project
          </span>
        )}
      </div>
    </ScrollReveal>
  );
}
