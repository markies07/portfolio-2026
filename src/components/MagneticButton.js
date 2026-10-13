"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCursor } from "@/lib/cursor-context";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";

/**
 * Wraps interactive elements with a subtle magnetic pull toward the cursor.
 * Movement is clamped to a small radius so it never feels uncontrollable.
 */
export default function MagneticButton({
  children,
  className = "",
  as: Tag = "div",
  strength = 0.3,
  cursorLabel = "",
  ...props
}) {
  const ref = useRef(null);
  const prefersReduced = useSafeReducedMotion();
  const { setCursor, resetCursor } = useCursor();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const MAX_OFFSET = 14;

  function handleMouseMove(event) {
    if (prefersReduced || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    const relX = event.clientX - (bounds.left + bounds.width / 2);
    const relY = event.clientY - (bounds.top + bounds.height / 2);
    x.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, relX * strength)));
    y.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, relY * strength)));
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    resetCursor();
  }

  function handleMouseEnter() {
    if (cursorLabel) setCursor("expand", cursorLabel);
  }

  const MotionTag = motion[Tag];

  return (
    <MotionTag
      ref={ref}
      className={className}
      style={prefersReduced ? undefined : { x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
