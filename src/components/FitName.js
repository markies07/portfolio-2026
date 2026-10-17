"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";

// Where the name stacks onto two lines: everywhere except wide landscape
// screens (the same split the hero portrait layout uses). Keep in sync with
// the media query on .fit-text--stack in globals.css.
const STACKED_QUERY = "not all and (min-width: 640px) and (orientation: landscape)";

const wordVariants = {
  hidden: { y: "110%" },
  visible: { y: "0%" },
};

/**
 * Oversized name that always spans the full width of its container, at
 * every window size, without stretching the letterforms. Words rise in one
 * after another — on mount (`reveal="mount"`) or when scrolled into view
 * (`reveal="inView"`). `paused` holds it back either way.
 *
 * With `stack`, phones and upright tablets get the last word on a line of
 * its own: the longer first line then fills the width, so both lines are
 * much bigger than the name on one line would be.
 */
export default function FitName({
  text,
  as: Tag = "p",
  reveal = "mount",
  delay = 0,
  className = "",
  textClassName = "",
  wordClassName = "",
  stack = false,
  paused = false,
  stagger = 0.09, // seconds between words
  duration = 1, // seconds for each word to rise
}) {
  const boxRef = useRef(null);
  const textRef = useRef(null);
  // Measured width in ems; until then CSS supplies a close default for the
  // current layout, so the first paint already spans edge to edge
  const [fitEm, setFitEm] = useState(null);
  const prefersReduced = useSafeReducedMotion();
  const inView = useInView(boxRef, { once: true, amount: 0.4 });

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    let cancelled = false;

    // Width in ems is size-independent, so this only needs re-running when
    // the font swaps in or the layout switches between one and two lines —
    // not on every resize.
    const measure = () => {
      if (cancelled) return;
      const fontSize = parseFloat(getComputedStyle(el).fontSize);
      const width = el.getBoundingClientRect().width;
      if (fontSize > 0 && width > 0) {
        const next = Math.round((width / fontSize) * 1.002 * 1000) / 1000;
        setFitEm((prev) => (prev !== null && Math.abs(prev - next) <= 0.002 ? prev : next));
      }
    };

    measure();
    document.fonts?.ready.then(measure);
    const query = stack ? window.matchMedia(STACKED_QUERY) : null;
    query?.addEventListener("change", measure);
    return () => {
      cancelled = true;
      query?.removeEventListener("change", measure);
    };
  }, [text, stack]);

  const play = !paused && (reveal === "mount" || inView);
  const words = text.split(" ");
  const lines = stack && words.length > 1 ? [words.slice(0, -1), words.slice(-1)] : [words];

  return (
    <Tag ref={boxRef} className={`fit-text-box select-none ${className}`} aria-label={text}>
      <motion.span
        ref={textRef}
        aria-hidden="true"
        className={`fit-text ${stack ? "fit-text--stack" : ""} overflow-hidden py-[0.06em] -my-[0.06em] ${textClassName}`}
        style={fitEm !== null ? { "--fit-em": fitEm } : undefined}
        initial={prefersReduced ? false : "hidden"}
        animate={prefersReduced || play ? "visible" : "hidden"}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {lines.map((lineWords, li) => (
          <span key={li} className="fit-line">
            {lineWords.map((word, wi) => (
              <span key={`${word}-${wi}`}>
                {wi > 0 && " "}
                <motion.span
                  className={`inline-block ${wordClassName}`}
                  variants={wordVariants}
                  transition={{ duration, ease: EASE_OUT }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
            {/* Between lines: a space when they sit side by side; dropped
                when they stack, as it falls between two blocks */}
            {li < lines.length - 1 && " "}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
