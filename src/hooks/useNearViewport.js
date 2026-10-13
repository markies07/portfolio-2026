"use client";

import { useEffect, useState } from "react";

// Flips to true (once) when the element comes within `margin` of the
// viewport — used to defer mounting heavy client-only widgets.
export function useNearViewport(ref, margin = "400px") {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, margin, near]);

  return near;
}
