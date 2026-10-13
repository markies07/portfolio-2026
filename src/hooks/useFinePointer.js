"use client";

import { useEffect, useState } from "react";

// True only for devices with a fine pointer (mouse/trackpad) and hover support —
// used to gate the custom cursor away from touch devices.
export function useFinePointer() {
  const [isFine, setIsFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    // Mount-only read of a browser-only media query — see useSafeReducedMotion
    // for why this can't be derived during render instead.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsFine(query.matches);
    const handler = (event) => setIsFine(event.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return isFine;
}
