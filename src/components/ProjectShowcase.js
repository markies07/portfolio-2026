"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";
import ScrollReveal from "./ScrollReveal";
import Parallax from "./Parallax";
import MagneticButton from "./MagneticButton";
import ArrowIcon from "./ArrowIcon";

/**
 * Gallery frame: a plain rectangle. Real screenshots drift slightly inside
 * the frame as the page scrolls (parallax) and zoom gently on hover.
 */
function GalleryImage({ project }) {
  const ref = useRef(null);
  const prefersReduced = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div
      ref={ref}
      className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-paper/10 bg-paper/4"
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
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function ProjectShowcase({ project, delay = 0, column = 0 }) {
  // Left column drifts gently, right column drifts much more — the two
  // visibly slide past each other as you scroll
  const [from, to] = column === 0 ? [30, -30] : [140, -140];

  return (
    <Parallax from={from} to={to} mobileFactor={0.3}>
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

        {project.href ? (
          <MagneticButton
            as="a"
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            cursorLabel="View"
            className="group/cta inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-paper"
          >
            {project.cta}
            <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
          </MagneticButton>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
            {project.cta}
          </span>
        )}
      </div>
    </ScrollReveal>
    </Parallax>
  );
}
