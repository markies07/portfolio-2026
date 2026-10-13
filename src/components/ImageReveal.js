"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";

/**
 * Clip-mask reveal container for images/visuals. Scales slightly as it enters.
 * Detection is watched on the untransformed outer element (see ScrollReveal's
 * mask variant for why) rather than via whileInView directly on the animated child.
 */
export default function ImageReveal({
  children,
  className = "",
  delay = 0,
  duration = 1.1,
}) {
  const prefersReduced = useSafeReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const revealed = { clipPath: "inset(0% 0 0% 0)", scale: 1, opacity: 1 };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        className="h-full w-full"
        initial={prefersReduced ? false : { clipPath: "inset(8% 0 8% 0)", scale: 1.12, opacity: 0.4 }}
        animate={prefersReduced || inView ? revealed : undefined}
        transition={{ duration, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.div>
    </div>
  );
}
