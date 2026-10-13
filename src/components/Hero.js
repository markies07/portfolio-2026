"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { PERSON } from "@/lib/content";
import { EASE_OUT, heroTimeline } from "@/lib/motion";
import ImageReveal from "./ImageReveal";
import FitName from "./FitName";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";

function Portrait({ priority = false }) {
  if (PERSON.portrait) {
    return (
      <div className="relative h-full w-full">
        <Image
          src={PERSON.portrait}
          alt={`Portrait of ${PERSON.name}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 80vw, 420px"
          className="object-cover"
        />
      </div>
    );
  }
  return <div className="h-full w-full rounded-sm bg-paper/4 border border-paper/10" aria-hidden="true" />;
}

export default function Hero() {
  const sectionRef = useRef(null);
  const prefersReduced = useSafeReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // The name and the portrait behind it travel as one unit, so the portrait
  // always stays centred on the name.
  const yName = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const yLabel = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const opacitySupporting = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate flex min-h-svh w-full flex-col justify-between overflow-hidden pt-10 sm:pt-14 pb-28 sm:pb-14"
    >
      {/* Top row: role label (left) and year (right) share one baseline */}
      <div className="px-5 sm:px-8 lg:px-12 xl:px-16">
        <motion.div
          style={prefersReduced ? undefined : { y: yLabel }}
          className="flex items-start justify-between gap-6"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: heroTimeline.label, ease: EASE_OUT }}
            className="max-w-[15rem] sm:max-w-none font-mono text-xs sm:text-sm leading-relaxed tracking-[0.2em] sm:tracking-[0.25em] uppercase text-paper/60"
          >
            {PERSON.roles}
          </motion.p>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: heroTimeline.label + 0.1, ease: EASE_OUT }}
            className="shrink-0 font-mono text-xs sm:text-sm leading-relaxed tracking-[0.2em] sm:tracking-[0.25em] text-paper/40"
          >
            {PERSON.year}
          </motion.span>
        </motion.div>
      </div>

      <div className="relative flex flex-1 items-center px-5 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-16">
        <motion.div
          style={prefersReduced ? undefined : { y: yName }}
          className="relative w-full"
        >
          {/* Portrait is pinned to the exact centre of the name, behind the
              letters, so the glyphs read on top of it. */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
            style={{ height: "min(56svh, 32rem)", width: "min(44.8svh, 25.6rem)" }}
          >
            <ImageReveal delay={heroTimeline.image} className="h-full w-full rounded-sm">
              <Portrait priority />
            </ImageReveal>
          </div>

          <FitName
            as="h1"
            text={PERSON.name}
            reveal="mount"
            delay={heroTimeline.name}
            className="relative z-10 text-paper"
          />

          <div className="sm:hidden mt-6">
            <ImageReveal delay={heroTimeline.image} className="aspect-5/4 w-full rounded-sm">
              <Portrait />
            </ImageReveal>
          </div>
        </motion.div>
      </div>

      <div className="mx-5 sm:mx-0 border-t border-paper/10 sm:border-0 pt-6 sm:pt-0 sm:px-8 lg:px-12 xl:px-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-10">
        <motion.p
          style={prefersReduced ? undefined : { opacity: opacitySupporting }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: heroTimeline.supporting, ease: EASE_OUT }}
          className="max-w-md text-sm sm:text-base leading-relaxed text-paper/70"
        >
          {PERSON.intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: heroTimeline.supporting + 0.1, ease: EASE_OUT }}
          className="hidden sm:flex items-center gap-4 font-mono text-xs tracking-[0.25em] uppercase text-paper/50"
        >
          Scroll to explore
          <span className="relative h-10 w-px overflow-hidden bg-paper/20">
            {!prefersReduced && (
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-paper"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
