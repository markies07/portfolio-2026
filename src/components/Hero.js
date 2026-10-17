"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PERSON } from "@/lib/content";
import { EASE_OUT, heroTimeline } from "@/lib/motion";
import FitName from "./FitName";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";
import { useIntroDone } from "@/lib/intro-context";

export default function Hero() {
  const prefersReduced = useSafeReducedMotion();
  // Entrance animations hold until the terminal intro hands off
  const ready = useIntroDone();

  // Scroll-linked depth (the hero-scroll-* classes, CSS scroll-driven, see
  // globals.css): two planes — as the hero scrolls away the name (back)
  // lags behind the page while the portrait (front) rises past it, so the
  // name slips down behind him. Overflow is clip, not hidden: a hidden box
  // would become the timeline's scroller.

  return (
    <section
      id="top"
      className="hero-scroll relative isolate flex min-h-svh w-full flex-col justify-between overflow-clip pt-10 sm:pt-14 pb-28"
    >
      {/* Top row: role label (left) and year (right) share one baseline */}
      <div className="relative z-30 px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="hero-scroll-label flex items-start justify-between gap-6">
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
        </div>
      </div>

      {/* On phones the padding is weighted to the bottom, which lifts the
          name and portrait a little above centre */}
      <div className="relative flex flex-1 flex-col justify-center px-5 sm:px-8 lg:px-12 xl:px-16 pt-2 pb-12 sm:py-16">
        {/* Faint spotlight that lifts the portrait off the black */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: heroTimeline.imageRise + 0.2, delay: heroTimeline.image, ease: EASE_OUT }}
          className="hero-spotlight pointer-events-none absolute left-1/2 top-1/2 z-0"
        />

        {/* Back plane: the name */}
        <div className="hero-scroll-name relative z-10 w-full">
          <FitName
            as="h1"
            text={PERSON.name}
            stack
            reveal="mount"
            paused={!ready}
            delay={heroTimeline.name}
            stagger={heroTimeline.nameStagger}
            duration={heroTimeline.nameRise}
            className="text-paper"
          />
        </div>

        {/* Front plane: the cut-out portrait, centred on the name and
            standing in front of it, so the middle letters pass behind him */}
        {PERSON.portrait && (
          <div className="hero-portrait pointer-events-none z-20">
            <div className="hero-scroll-portrait origin-bottom">
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
                  className="hero-portrait-dark block h-auto w-full select-none"
                  draggable={false}
                />
                {/* Light-theme version; CSS shows whichever matches the
                    theme, so the right one is up before React hydrates.
                    Lazy, so dark-theme visitors never download it. */}
                {PERSON.portraitLight && (
                  <Image
                    src={PERSON.portraitLight}
                    alt={`Portrait of ${PERSON.name}`}
                    width={920}
                    height={861}
                    loading="lazy"
                    sizes="(max-width: 640px) 118vw, (orientation: portrait) 85vw, 60vw"
                    className="hero-portrait-light h-auto w-full select-none"
                    draggable={false}
                  />
                )}
              </motion.div>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-30 mx-5 sm:mx-0 pt-6 sm:pt-0 sm:px-8 lg:px-12 xl:px-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-10">
        {/* Outer layer fades on scroll, inner one fades in — on a single
            element the scroll-linked opacity overrode the entrance */}
        <div className="hero-scroll-fade">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: heroTimeline.detailFade, delay: heroTimeline.details + 0.1, ease: EASE_OUT }}
            className="max-w-md text-sm sm:text-base leading-relaxed text-paper/70"
          >
            {PERSON.intro}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: heroTimeline.detailFade, delay: heroTimeline.details + 0.2, ease: EASE_OUT }}
          className="hidden sm:flex items-center gap-4 font-mono text-xs tracking-[0.25em] uppercase text-paper/50"
        >
          Scroll to explore
          <span className="relative h-10 w-px overflow-hidden bg-paper/20">
            <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-paper" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
