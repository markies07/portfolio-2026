"use client";

import { useEffect, useRef } from "react";

// One IntersectionObserver per threshold, shared by every reveal on the page
const observers = new Map();

function observe(el, amount) {
  let observer = observers.get(amount);
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.dataset.revealed = "";
          observer.unobserve(entry.target);
        }
      },
      { threshold: amount }
    );
    observers.set(amount, observer);
  }
  observer.observe(el);
  return () => observer.unobserve(el);
}

/**
 * Scroll-triggered reveal. Fires once, respects reduced motion.
 * variant: "fade" (default fade + rise) | "mask" (slides up out of a clip)
 * | "scale"
 *
 * The motion itself is a CSS transition (see .reveal in globals.css) on
 * transform and opacity, so it runs on the compositor; JavaScript only
 * flags the element once it's in view.
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
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (el) return observe(el, amount);
  }, [amount]);

  const style = { "--reveal-y": `${y}px`, "--reveal-delay": `${delay}s`, "--reveal-duration": `${duration}s` };

  // Mask: the in-view check is on the clip container, which never moves;
  // the content slides up inside it
  if (variant === "mask") {
    return (
      <div ref={ref} className={`reveal-mask overflow-hidden ${className}`} style={style}>
        <div className="reveal-mask-inner">{children}</div>
      </div>
    );
  }

  return (
    <Tag ref={ref} className={`reveal ${variant === "scale" ? "reveal--scale" : ""} ${className}`} style={style}>
      {children}
    </Tag>
  );
}
