"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { PERSON } from "@/lib/content";
import { EASE_OUT, heroTimeline } from "@/lib/motion";
import FitName from "./FitName";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";
import { useIntroDone } from "@/lib/intro-context";

export default function Hero() {
  const sectionRef = useRef(null);
  const prefersReduced = useSafeReducedMotion();
  // Entrance animations hold until the terminal intro hands off
  const ready = useIntroDone();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Two depth planes. On scroll the name (back) lags behind the page while
  // the portrait (front) rises past it, so the name slips down behind him.
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 170]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const yLabel = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const opacitySupporting = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate flex min-h-svh w-full flex-col justify-between overflow-hidden pt-10 sm:pt-14 pb-28"
    >
      {/* Top row: role label (left) and year (right) share one baseline */}
      <div className="relative z-30 px-5 sm:px-8 lg:px-12 xl:px-16">
        <motion.div
          style={prefersReduced ? undefined : { y: yLabel }}
          className="flex items-start justify-between gap-6"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: heroTimeline.detailFade, delay: heroTimeline.details, ease: EASE_OUT }}
            className="max-w-[15rem] sm:max-w-none font-mono text-xs sm:text-sm leading-relaxed tracking-[0.2em] sm:tracking-[0.25em] uppercase text-paper/60"
          >
            {PERSON.roles}
          </motion.p>
          <motion.span
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ duration: heroTimeline.detailFade, delay: heroTimeline.details + 0.05, ease: EASE_OUT }}
            className="shrink-0 font-mono text-xs sm:text-sm leading-relaxed tracking-[0.2em] sm:tracking-[0.25em] text-paper/40"
          >
            {PERSON.year}
          </motion.span>
        </motion.div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-5 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-16">
        {/* Faint spotlight that lifts the portrait off the black */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: heroTimeline.imageRise + 0.2, delay: heroTimeline.image, ease: EASE_OUT }}
          className="hero-spotlight pointer-events-none absolute left-1/2 top-1/2 z-0"
        />

        {/* Back plane: the name */}
        <motion.div
          style={prefersReduced ? undefined : { y: nameY }}
          className="relative z-10 w-full"
        >
          <FitName
            as="h1"
            text={PERSON.name}
            reveal="mount"
            paused={!ready}
            delay={heroTimeline.name}
            stagger={heroTimeline.nameStagger}
            duration={heroTimeline.nameRise}
            className="text-paper"
          />
        </motion.div>

        {/* Front plane: the cut-out portrait, centred on the name and
            standing in front of it, so the middle letters pass behind him */}
        {PERSON.portrait && (
          <div className="hero-portrait pointer-events-none z-20">
            <motion.div
              style={prefersReduced ? undefined : { y: portraitY, scale: portraitScale }}
              className="origin-bottom"
            >
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 90, scale: 0.94 }}
                animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
                transition={{
                  duration: heroTimeline.imageRise,
                  delay: heroTimeline.image,
                  ease: EASE_OUT,
                  // Opacity finishes well before the rise settles, so the
                  // portrait is solid by the time the name starts
                  opacity: { duration: heroTimeline.imageFade, delay: heroTimeline.image, ease: "easeOut" },
                }}
                className="hero-portrait-fade origin-bottom"
              >
                <Image
                  src={PERSON.portrait}
                  alt={`Portrait of ${PERSON.name}`}
                  width={920}
                  height={861}
                  preload
                  sizes="(max-width: 640px) 118vw, (orientation: portrait) 85vw, 60vw"
                  className="block h-auto w-full select-none"
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>

      <div className="relative z-30 mx-5 sm:mx-0 border-t border-paper/10 sm:border-0 pt-6 sm:pt-0 sm:px-8 lg:px-12 xl:px-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-10">
        {/* Outer layer fades on scroll, inner one fades in — on a single
            element the scroll-linked opacity overrode the entrance */}
        <motion.div style={prefersReduced ? undefined : { opacity: opacitySupporting }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: heroTimeline.detailFade, delay: heroTimeline.details + 0.1, ease: EASE_OUT }}
            className="max-w-md text-sm sm:text-base leading-relaxed text-paper/70"
          >
            {PERSON.intro}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: heroTimeline.detailFade, delay: heroTimeline.details + 0.2, ease: EASE_OUT }}
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
