"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Wraps framer-motion's useReducedMotion so the resolved value is always
// `false` during SSR and the client's first hydration pass, only reflecting
// the real OS preference after mount. The media query can resolve
// synchronously on the client (before React reconciles the first paint)
// while the server has no way to know it at all — using the raw hook value
// directly in render output causes a hydration mismatch for anyone with
// reduced motion enabled at the OS level.
export function useSafeReducedMotion() {
  const raw = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Intentional mount-detection flag, not state synced from an external
    // system — this is the standard escape hatch for hydration-safe
    // client-only values, so the lint rule's usual "derive during render"
    // suggestion doesn't apply here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return mounted ? raw : false;
}
