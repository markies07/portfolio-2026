"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PERSON } from "@/lib/content";
import { EASE_OUT } from "@/lib/motion";

export default function Navbar() {
  const logoRef = useRef(null);
  const [onLight, setOnLight] = useState(false);

  useEffect(() => {
    // Watch every section / bg element to detect if the logo sits over a light bg
    const logo = logoRef.current;
    if (!logo) return;

    function check() {
      const rect = logo.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Temporarily hide the logo so we can sample what's behind it
      logo.style.visibility = "hidden";
      const el = document.elementFromPoint(cx, cy);
      logo.style.visibility = "";

      if (!el) return;

      const bg = getComputedStyle(el).backgroundColor;
      // Parse rgba/rgb
      const match = bg.match(/[\d.]+/g);
      if (!match) return;
      const [r, g, b] = match.map(Number);
      // Perceived luminance
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      setOnLight(lum > 128);
    }

    // Run on scroll and resize
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
      className="fixed top-0 inset-x-0 z-65 flex items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-7"
    >
      <a
        ref={logoRef}
        href="#top"
        data-cursor-skip
        aria-label={`${PERSON.name} — back to top`}
        className="flex h-9 w-9 items-center justify-center rounded-full border font-mono text-xs font-semibold tracking-wider transition-colors duration-300"
        style={{
          borderColor: onLight ? "rgba(10,10,10,0.25)" : "rgba(244,244,240,0.20)",
          color: onLight ? "#0a0a0a" : "#f4f4f0",
          backgroundColor: onLight ? "rgba(10,10,10,0.06)" : "rgba(244,244,240,0.06)",
        }}
      >
        MC
      </a>
    </motion.header>
  );
}
