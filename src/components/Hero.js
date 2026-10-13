"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PERSON } from "@/lib/content";
import { EASE_OUT, heroTimeline } from "@/lib/motion";
import ImageReveal from "./ImageReveal";
import PlaceholderArt from "./PlaceholderArt";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";

const lineVariants = {
  hidden: { y: "110%" },
  visible: { y: "0%" },
};

export default function Hero() {
  const sectionRef = useRef(null);
  const prefersReduced = useSafeReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const yName = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacitySupporting = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate flex min-h-svh w-full flex-col justify-between overflow-hidden pt-28 sm:pt-32 pb-10 sm:pb-14"
    >
      <div className="px-5 sm:px-8 lg:px-12 xl:px-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: heroTimeline.label, ease: EASE_OUT }}
          className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-paper/60"
        >
          {PERSON.roles}
        </motion.p>
      </div>

      <div className="relative flex flex-1 items-center px-5 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-16">
        {/* Portrait sits BEHIND the name (lower z-index) so the glyphs read
            on top of it while empty space between letters reveals it —
            the letters visually "cut into" the image, like a photo breaking
            through oversized type. */}
        <motion.div
          style={prefersReduced ? undefined : { y: yImage, scale: scaleImage }}
          className="pointer-events-none absolute left-[34%] top-[2%] z-0 hidden sm:block w-[46%] max-w-105"
        >
          <ImageReveal delay={heroTimeline.image} className="aspect-4/5 w-full rounded-sm">
            <PlaceholderArt seed={0} mark={PERSON.initials} label={`${PERSON.name} portrait placeholder`} className="h-full w-full" />
          </ImageReveal>
        </motion.div>

        <motion.div
          style={prefersReduced ? undefined : { y: yName }}
          className="relative z-10 w-full"
        >
          <h1 className="w-full select-none overflow-visible">
            <span className="block overflow-hidden w-full">
              <motion.span
                className="block w-full"
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.9, delay: heroTimeline.name, ease: EASE_OUT }}
              >
                <svg
                  viewBox="0 0 1200 100"
                  className="w-full h-auto block overflow-visible"
                  aria-label={PERSON.name}
                >
                  <text
                    x="0"
                    y="78"
                    textLength="1200"
                    lengthAdjust="spacingAndGlyphs"
                    className="font-display font-semibold fill-paper text-[88px] uppercase"
                  >
                    {PERSON.name}
                  </text>
                </svg>
              </motion.span>
            </span>
          </h1>

          <div className="sm:hidden mt-8 flex justify-center">
            <ImageReveal delay={heroTimeline.image} className="aspect-4/5 w-full max-w-xs rounded-sm">
              <PlaceholderArt seed={0} mark={PERSON.initials} label={`${PERSON.name} portrait placeholder`} className="h-full w-full" />
            </ImageReveal>
          </div>
        </motion.div>

        <motion.span
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: heroTimeline.name + 0.2, ease: EASE_OUT }}
          className="pointer-events-none absolute top-0 right-5 sm:right-8 lg:right-12 xl:right-16 z-10 flex flex-col items-end font-display text-2xl sm:text-3xl font-semibold leading-[0.9] text-paper/40"
        >
          <span>{PERSON.year.slice(0, 2)}</span>
          <span>{PERSON.year.slice(2)}</span>
        </motion.span>
      </div>

      <div className="px-5 sm:px-8 lg:px-12 xl:px-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-10">
        <motion.p
          style={prefersReduced ? undefined : { opacity: opacitySupporting }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: heroTimeline.supporting, ease: EASE_OUT }}
          className="max-w-sm text-sm sm:text-base leading-relaxed text-paper/70"
        >
          I design and build digital products — from visual identity to full-stack architecture — for people who care about the details.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: heroTimeline.supporting + 0.1, ease: EASE_OUT }}
          className="flex items-center gap-4 font-mono text-xs tracking-[0.25em] uppercase text-paper/50"
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
