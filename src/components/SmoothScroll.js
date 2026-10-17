"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useIntroDone } from "@/lib/intro-context";

/**
 * Inertia-based smooth scrolling for wheel / trackpad input. Native scroll
 * events still fire, so framer-motion's useScroll keeps working untouched.
 * Touch devices keep their native scrolling, and reduced-motion users opt out.
 * Held still while the terminal intro is playing.
 *
 * Also owns where a page starts after client-side navigation. Next.js only
 * scrolls when the new page's first element is off screen — on project
 * pages that's the fixed Back button, which never is, so the page would
 * open wherever the last one was left. Lenis also keeps its own position,
 * which goes stale across pages. So after each route change: jump to the
 * #hash target if there is one (Back → the project's card), else the top.
 */
export default function SmoothScroll() {
  const lenisRef = useRef(null);
  const introDone = useIntroDone();
  const pathname = usePathname();
  const firstRoute = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch screens keep native scrolling (Lenis leaves touch alone anyway),
    // so there it would only add a per-frame loop for nothing
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

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

  useEffect(() => {
    // The first page load is left to the browser and the intro
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }

    // Two frames: let the new page lay out (and Next's own scroll attempt
    // run) before measuring and jumping
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const lenis = lenisRef.current;
        const hash = decodeURIComponent(window.location.hash.slice(1));
        const target = hash ? document.getElementById(hash) : null;

        if (lenis) {
          lenis.resize();
          lenis.scrollTo(target ?? 0, { immediate: true, force: true });
        } else if (target) {
          target.scrollIntoView();
        } else {
          window.scrollTo(0, 0);
        }
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
