"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";

// Measured width of the name in ems for the display face — used as the
// pre-hydration value so the first paint already spans edge to edge.
const DEFAULT_FIT_EM = 11.659;

const wordVariants = {
  hidden: { y: "110%" },
  visible: { y: "0%" },
};

/**
 * Oversized single-line name that always spans the full width of its
 * container, at every window size, without stretching the letterforms.
 * Words rise in one after another — on mount (`reveal="mount"`) or when
 * scrolled into view (`reveal="inView"`).
 */
export default function FitName({
  text,
  as: Tag = "p",
  reveal = "mount",
  delay = 0,
  className = "",
  textClassName = "",
}) {
  const boxRef = useRef(null);
  const textRef = useRef(null);
  const [fitEm, setFitEm] = useState(DEFAULT_FIT_EM);
  const prefersReduced = useSafeReducedMotion();
  const inView = useInView(boxRef, { once: true, amount: 0.4 });

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    let cancelled = false;

    // Width in ems is size-independent, so this only needs re-running when
    // the font itself changes (web font swap-in) — not on every resize.
    const measure = () => {
      if (cancelled) return;
      const fontSize = parseFloat(getComputedStyle(el).fontSize);
      const width = el.getBoundingClientRect().width;
      if (fontSize > 0 && width > 0) {
        const next = Math.round((width / fontSize) * 1.002 * 1000) / 1000;
        setFitEm((prev) => (Math.abs(prev - next) > 0.002 ? next : prev));
      }
    };

    measure();
    document.fonts?.ready.then(measure);
    return () => {
      cancelled = true;
    };
  }, [text]);

  const play = reveal === "mount" || inView;
  const words = text.split(" ");

  return (
    <Tag ref={boxRef} className={`fit-text-box select-none ${className}`} aria-label={text}>
      <motion.span
        ref={textRef}
        aria-hidden="true"
        className={`fit-text overflow-hidden py-[0.06em] -my-[0.06em] ${textClassName}`}
        style={{ "--fit-em": fitEm }}
        initial={prefersReduced ? false : "hidden"}
        animate={prefersReduced || play ? "visible" : "hidden"}
        transition={{ staggerChildren: 0.09, delayChildren: delay }}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block"
            variants={wordVariants}
            transition={{ duration: 1, ease: EASE_OUT }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
