"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";

/**
 * Generic scroll-triggered reveal. Fires once, respects reduced-motion.
 * variant: "fade" (default fade+translateY) | "mask" (clip-path reveal) | "scale"
 */
export default function ScrollReveal({
  children,
  as: Tag = "div",
  variant = "fade",
  y = 28,
  delay = 0,
  duration = 0.9,
  amount = 0.3,
  className = "",
  once = true,
}) {
  const prefersReduced = useSafeReducedMotion();

  // Mask reveal uses an overflow-hidden clip container + inner translateY,
  // the same proven technique as the hero line reveal. Detection is watched
  // on the untransformed outer element rather than via whileInView directly
  // on the sliding child — a large self-transform (y: 100%) shifts the
  // element's own measured position enough to break its own intersection
  // trigger, so `animate` driven by a separately-observed ref is used instead.
  const maskRef = useRef(null);
  const maskInView = useInView(maskRef, { once, amount });

  if (variant === "mask") {
    return (
      <div ref={maskRef} className={`overflow-hidden ${className}`}>
        <motion.div
          initial={prefersReduced ? false : { y: "100%", opacity: 0 }}
          animate={prefersReduced || maskInView ? { y: "0%", opacity: 1 } : undefined}
          transition={{ duration, delay, ease: EASE_OUT }}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  const MotionTag = motion[Tag];
  const variants = {
    fade: {
      hidden: { opacity: 0, y },
      visible: { opacity: 1, y: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.94 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  return (
    <MotionTag
      className={className}
      initial={prefersReduced ? false : "hidden"}
      whileInView={prefersReduced ? undefined : "visible"}
      animate={prefersReduced ? "visible" : undefined}
      viewport={{ once, amount }}
      variants={variants[variant]}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </MotionTag>
  );
}
