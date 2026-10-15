"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, AnimatePresence } from "framer-motion";
import { useCursor } from "@/lib/cursor-context";
import { useFinePointer } from "@/hooks/useFinePointer";

// Fields you type into: the cursor becomes a text caret over these
const TEXT_FIELD =
  'textarea, [contenteditable="true"], input:not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]):not([type=range]):not([type=file]):not([type=color])';
const INTERACTIVE =
  "a, button, select, label, [data-cursor], input[type=checkbox], input[type=radio], input[type=submit], input[type=button]";

// Size and corner radius per state, in px
const SHAPES = {
  default: { width: 12, height: 12, borderRadius: 999 },
  hover: { width: 48, height: 48, borderRadius: 999 },
  label: { width: 84, height: 84, borderRadius: 999 },
  text: { width: 3, height: 30, borderRadius: 2 },
};

export default function CustomCursor() {
  const isFine = useFinePointer();
  const prefersReduced = useReducedMotion();
  const active = isFine && !prefersReduced;
  const { variant, label, setCursor, resetCursor } = useCursor();
  const [pressed, setPressed] = useState(false);

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
      if (!(event.target instanceof Element)) return;
      // A field inside a clickable wrapper still reads as a text field
      if (event.target.closest(TEXT_FIELD)) {
        setCursor("text");
        return;
      }
      const target = event.target.closest(INTERACTIVE);
      if (!target || target.dataset.cursorSkip !== undefined) return;
      const customLabel = target.dataset.cursorLabel;
      setCursor(customLabel ? "label" : "hover", customLabel || "");
    }

    function handleOut(event) {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest(`${TEXT_FIELD}, ${INTERACTIVE}`);
      if (!target) return;
      const related = event.relatedTarget;
      if (related && target.contains(related)) return;
      resetCursor();
    }

    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [active, x, y, setCursor, resetCursor]);

  if (!active) return null;

  const hasLabel = Boolean(label);
  // Unknown variants (e.g. "expand" from MagneticButton) read as hover
  const shape = hasLabel ? SHAPES.label : (SHAPES[variant] ?? SHAPES.hover);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-80 flex items-center justify-center mix-blend-difference bg-paper"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      initial={false}
      animate={{ ...shape, scale: pressed ? 0.8 : 1 }}
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
