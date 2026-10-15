"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/content";
import { EASE_OUT } from "@/lib/motion";
import SectionHeading from "./SectionHeading";

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 6500);
    return () => clearInterval(id);
  }, [prefersReduced, paused]);

  const testimonial = TESTIMONIALS[index];

  return (
    <section className="relative bg-ink py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-[100rem] px-5 sm:px-8 lg:px-12 xl:px-16">
        <SectionHeading eyebrow="Testimonials" title="Trusted By Clients" className="mb-16 sm:mb-24" />

        <div
          className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-10 max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-full font-display text-lg font-semibold text-paper/80"
            style={{ background: "linear-gradient(135deg, #1c1c1c, #0a0a0a)" }}
            aria-hidden="true"
          >
            {initials(testimonial.name)}
          </div>

          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
              >
                <p className="font-display font-medium leading-snug tracking-tight text-[clamp(1.375rem,2.8vw,2.25rem)]">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <footer className="mt-6 font-mono text-xs uppercase tracking-[0.15em] text-paper/60">
                  {testimonial.name} — {testimonial.role}
                </footer>
              </motion.blockquote>
            </AnimatePresence>

            <div className="mt-8 flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-8 bg-paper" : "w-1.5 bg-paper/25"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
