"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useIntroDone } from "@/lib/intro-context";

/**
 * Inertia-based smooth scrolling for wheel / trackpad input. Native scroll
 * events still fire, so framer-motion's useScroll keeps working untouched.
 * Touch devices keep their native scrolling, and reduced-motion users opt out.
 * Held still while the terminal intro is playing.
 */
export default function SmoothScroll() {
  const lenisRef = useRef(null);
  const introDone = useIntroDone();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      anchors: true,
      autoRaf: true,
    });
    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (introDone) lenis.start();
    else lenis.stop();
  }, [introDone]);

  return null;
}
