"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/content";
import { EASE_OUT } from "@/lib/motion";

const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1));

// iOS fluid spring physics curve
const WATER_SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 26,
  mass: 0.6,
};

// Icon components for each section
const ICONS = {
  about: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  services: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  work: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  contact: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

export default function BottomNav() {
  const [active, setActive] = useState(SECTION_IDS[0]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: EASE_OUT }}
      className="fixed bottom-6 sm:bottom-8 inset-x-0 z-65 flex justify-center px-4 pointer-events-none"
      aria-label="Primary"
    >
      <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-2xl p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)]">
        {NAV_LINKS.map((link) => {
          const id = link.href.slice(1);
          const isActive = active === id;
          const isHovered = hovered === id;

          return (
            <div key={link.href} className="relative flex items-center justify-center">
              {/* Tooltip on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.9 }}
                    animate={{ opacity: 1, y: -6, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.9 }}
                    transition={{ duration: 0.15, ease: EASE_OUT }}
                    className="absolute bottom-full mb-2 pointer-events-none rounded-xl border border-white/20 bg-[#1a1a1e]/90 backdrop-blur-md px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.6)] whitespace-nowrap z-50"
                  >
                    {link.label}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-[#1a1a1e]/90" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.a
                href={link.href}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-white/40 hover:text-white/80"
                }`}
                aria-label={link.label}
              >
                {/* iOS Fluid Water Glass Active Pill */}
                {isActive && (
                  <motion.span
                    layoutId="dock-active-bg"
                    className="absolute inset-0 rounded-full border border-white/35 bg-white/25 shadow-[0_4px_16px_rgba(255,255,255,0.2),inset_0_1.5px_2px_rgba(255,255,255,0.5)] backdrop-blur-xl"
                    transition={WATER_SPRING}
                  />
                )}

                {/* Animated Vector Icon */}
                <motion.span
                  animate={isActive ? { scale: [0.85, 1.15, 1], y: [1, -1, 0] } : { scale: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                  className="relative z-10"
                >
                  {ICONS[id]}
                </motion.span>
              </motion.a>
            </div>
          );
        })}

        {/* Glass Divider */}
        <div className="h-4 w-px bg-white/20 mx-0.5" />

        {/* iOS Glass CTA Button "Let's Talk" */}
        <div className="relative flex items-center justify-center">
          <AnimatePresence>
            {hovered === "cta" && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: -6, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.9 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
                className="absolute bottom-full mb-2 pointer-events-none rounded-xl border border-white/20 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink shadow-lg whitespace-nowrap z-50"
              >
                Let&apos;s Talk
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-white" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.a
            href="#contact"
            whileTap={{ scale: 0.94 }}
            onMouseEnter={() => setHovered("cta")}
            onMouseLeave={() => setHovered(null)}
            className="group relative flex h-10 items-center gap-2 rounded-full border border-white/20 bg-transparent px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-paper transition-all duration-300 hover:bg-paper hover:text-ink hover:border-paper hover:shadow-[0_0_20px_rgba(244,244,240,0.35)]"
          >
            <span className="hidden sm:inline">Let&apos;s Talk</span>
            <svg
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
}
