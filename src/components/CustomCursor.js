"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, AnimatePresence } from "framer-motion";
import { useCursor } from "@/lib/cursor-context";
import { useFinePointer } from "@/hooks/useFinePointer";

export default function CustomCursor() {
  const isFine = useFinePointer();
  const prefersReduced = useReducedMotion();
  const active = isFine && !prefersReduced;
  const { variant, label, setCursor, resetCursor } = useCursor();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // No spring on position — cursor tracks mouse 1:1 with zero delay
  const springX = x;
  const springY = y;

  useEffect(() => {
    if (!active) return;

    document.documentElement.classList.add("has-custom-cursor");

    function handleMove(event) {
      x.set(event.clientX);
      y.set(event.clientY);
    }

    function handleOver(event) {
      const target = event.target.closest("a, button, [data-cursor]");
      if (!target || target.dataset.cursorSkip !== undefined) return;
      const customLabel = target.dataset.cursorLabel;
      setCursor(customLabel ? "label" : "hover", customLabel || "");
    }

    function handleOut(event) {
      const target = event.target.closest("a, button, [data-cursor]");
      if (!target) return;
      const related = event.relatedTarget;
      if (related && target.contains(related)) return;
      resetCursor();
    }

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, [active, x, y, setCursor, resetCursor]);

  if (!active) return null;

  const isExpanded = variant !== "default";
  const hasLabel = Boolean(label);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-80 flex items-center justify-center rounded-full mix-blend-difference bg-paper"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: hasLabel ? 84 : isExpanded ? 48 : 12,
        height: hasLabel ? 84 : isExpanded ? 48 : 12,
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
    >
      <AnimatePresence>
        {hasLabel && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
