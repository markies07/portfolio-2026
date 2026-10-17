"use client";

import { useCallback, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

function subscribe(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

// The server can't know the saved choice; React re-reads it after hydration
const getServerTheme = () => "dark";

/**
 * The page theme ("dark" | "light"), read from <html data-theme>, and a
 * toggle that saves the choice. Given the screen point it was triggered
 * from, the toggle reveals the new theme as a circle growing out of it
 * (View Transitions); elsewhere it switches instantly.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  const toggle = useCallback((origin) => {
    const next = getTheme() === "light" ? "dark" : "light";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Private mode / blocked storage — the switch still works this visit
      }
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!origin || reduced || !document.startViewTransition) {
      apply();
      return;
    }

    const { x, y } = origin;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 700,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {});
  }, []);

  return { theme, toggle };
}
