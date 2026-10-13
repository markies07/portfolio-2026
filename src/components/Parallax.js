"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";

/**
 * Scroll-linked parallax. While the element travels through the viewport it
 * drifts from `from` px to `to` px on top of normal scrolling (0 at the
 * middle if they're symmetrical). Positive-to-negative reads as "moves
 * faster than the page"; negative-to-positive as "lags behind".
 * Offsets are scaled down on small screens so nothing crowds the layout.
 */
export default function Parallax({
  children,
  from = 60,
  to = -60,
  axis = "y",
  mobileFactor = 0.4,
  className = "",
}) {
  const ref = useRef(null);
  const prefersReduced = useSafeReducedMotion();
  const factor = useMotionValue(1);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const apply = () => factor.set(query.matches ? 1 : mobileFactor);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [factor, mobileFactor]);

  const value = useTransform([scrollYProgress, factor], ([p, f]) => (from + (to - from) * p) * f);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={prefersReduced ? undefined : axis === "x" ? { x: value } : { y: value }}
    >
      {children}
    </motion.div>
  );
}
