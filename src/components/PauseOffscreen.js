"use client";

import { useEffect, useRef } from "react";

/**
 * A div that marks itself data-offscreen while it's out of view, so CSS can
 * pause endless animations inside it (see .marquee in globals.css) instead
 * of animating them for nobody.
 */
export default function PauseOffscreen({ children, className = "", margin = "100px" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) delete el.dataset.offscreen;
        else el.dataset.offscreen = "";
      },
      { rootMargin: margin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);

  return (
    <div ref={ref} className={className} data-offscreen="">
      {children}
    </div>
  );
}
