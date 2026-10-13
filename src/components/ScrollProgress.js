"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A thin, unobtrusive progress line fixed to the top of the viewport.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-accent origin-left z-70"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
