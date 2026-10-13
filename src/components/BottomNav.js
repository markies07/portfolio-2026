"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useAnimationControls,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { NAV_LINKS } from "@/lib/content";
import { EASE_OUT } from "@/lib/motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";

const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1));

const ITEM = 40; // px — icon button size
const PAD = 6; // px — capsule padding (p-1.5)

// Water-drop travel: the edge leading the move snaps ahead, the trailing
// edge lags behind on a softer spring — the pill stretches, then settles.
const LEAD = { type: "spring", stiffness: 430, damping: 25, mass: 0.7 };
const TRAIL = { type: "spring", stiffness: 150, damping: 19, mass: 0.95 };

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
  const prefersReduced = useSafeReducedMotion();
  const [active, setActive] = useState(SECTION_IDS[0]);
  const [hovered, setHovered] = useState(null);
  const [pressed, setPressed] = useState(false);
  const [ripple, setRipple] = useState(null);

  const trackRef = useRef(null);
  const itemRefs = useRef({});
  const activeRef = useRef(active);
  const locked = useRef(false);
  const lockTimer = useRef(0);
  const rippleCount = useRef(0);
  const placed = useRef(false);

  // The droplet is described by its left and right edges so each edge can
  // chase its target on its own spring.
  const left = useMotionValue(PAD);
  const right = useMotionValue(PAD + ITEM);
  const width = useTransform([left, right], ([l, r]) => Math.max(r - l, ITEM));
  // Stretching thins the drop a little, like surface tension
  const scaleY = useTransform(width, (w) => 1 - (Math.min(Math.max(w - ITEM, 0), 80) / 80) * 0.2);
  const jelly = useAnimationControls();

  const measure = useCallback(() => {
    const el = itemRefs.current[activeRef.current];
    if (!el) return null;
    return { l: el.offsetLeft, r: el.offsetLeft + el.offsetWidth };
  }, []);

  /* Which section is on screen */
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // After a tap, ignore the sections we scroll *through* on the way
        if (locked.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(lockTimer.current), []);

  /* Glide the droplet to the active item */
  useLayoutEffect(() => {
    activeRef.current = active;
    const target = measure();
    if (!target) return;

    if (!placed.current || prefersReduced) {
      placed.current = true;
      left.set(target.l);
      right.set(target.r);
      return;
    }

    if (Math.abs(target.l - left.get()) < 0.5) return;

    const movingRight = target.l > left.get();
    const controls = [
      animate(left, target.l, movingRight ? TRAIL : LEAD),
      animate(right, target.r, movingRight ? LEAD : TRAIL),
    ];
    // The whole glass capsule wobbles as the drop passes through it
    jelly.start({
      scaleX: [1, 1.055, 0.985, 1],
      scaleY: [1, 0.94, 1.02, 1],
      transition: { duration: 0.75, ease: "easeOut" },
    });
    return () => controls.forEach((c) => c.stop());
  }, [active, prefersReduced, left, right, jelly, measure]);

  /* Keep the droplet glued to its item when the layout changes size */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const target = measure();
      if (!target) return;
      left.set(target.l);
      right.set(target.r);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure, left, right]);

  const hoveredIndex = hovered ? SECTION_IDS.indexOf(hovered) : -1;

  function handleTap(id) {
    locked.current = true;
    clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      locked.current = false;
    }, 1200);
    rippleCount.current += 1;
    setActive(id);
    setRipple({ id, key: rippleCount.current });
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: 36, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      className="fixed bottom-6 sm:bottom-8 inset-x-0 z-65 flex justify-center px-4 pointer-events-none"
      aria-label="Primary"
    >
      <motion.div
        ref={trackRef}
        animate={jelly}
        className="pointer-events-auto relative flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-2xl p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)]"
      >
        {/* Liquid droplet — sits under the icons and travels between them */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1.5 z-0 h-10 overflow-hidden rounded-full border border-white/35 bg-white/25 shadow-[0_4px_18px_rgba(255,255,255,0.22),inset_0_1.5px_2px_rgba(255,255,255,0.55)] backdrop-blur-xl"
          style={{ x: left, width, scaleY }}
          animate={{ scale: pressed ? 0.88 : 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 20 }}
        >
          {/* Specular highlight */}
          <span className="absolute inset-x-2.5 top-[3px] h-[9px] rounded-full bg-gradient-to-b from-white/55 to-transparent" />
        </motion.span>

        {NAV_LINKS.map((link, index) => {
          const id = link.href.slice(1);
          const isActive = active === id;
          const isHovered = hovered === id;
          const distance = hoveredIndex < 0 ? 9 : Math.abs(index - hoveredIndex);
          // Water-lens magnification around the pointer
          const iconScale = isActive && pressed ? 0.85 : distance === 0 ? 1.3 : distance === 1 ? 1.1 : 1;

          return (
            <div
              key={link.href}
              ref={(el) => {
                itemRefs.current[id] = el;
              }}
              className="relative z-10 flex items-center justify-center"
            >
              {/* Tooltip on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.85 }}
                    animate={{ opacity: 1, y: -6, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 500, damping: 24 }}
                    className="absolute bottom-full mb-2 pointer-events-none rounded-xl border border-white/20 bg-[#1a1a1e]/90 backdrop-blur-md px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.6)] whitespace-nowrap z-50"
                  >
                    {link.label}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-[#1a1a1e]/90" />
                  </motion.div>
                )}
              </AnimatePresence>

              <a
                href={link.href}
                onClick={() => handleTap(id)}
                onPointerDown={() => setPressed(true)}
                onPointerUp={() => setPressed(false)}
                onPointerLeave={() => {
                  setPressed(false);
                  setHovered(null);
                }}
                onPointerEnter={() => setHovered(id)}
                onFocus={() => setHovered(id)}
                onBlur={() => setHovered(null)}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ${
                  isActive ? "text-white" : "text-white/45 hover:text-white"
                }`}
                aria-label={link.label}
                aria-current={isActive ? "true" : undefined}
              >
                <motion.span
                  animate={{ scale: iconScale }}
                  transition={{ type: "spring", stiffness: 420, damping: 16 }}
                  className="relative z-10"
                >
                  {ICONS[id]}
                </motion.span>

                {/* Water ripple on tap */}
                <AnimatePresence>
                  {ripple?.id === id && (
                    <motion.span
                      key={ripple.key}
                      aria-hidden="true"
                      initial={{ scale: 0.4, opacity: 0.7 }}
                      animate={{ scale: 2.3, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.75, ease: EASE_OUT }}
                      onAnimationComplete={() => setRipple(null)}
                      className="pointer-events-none absolute inset-0 rounded-full border border-white/60"
                    />
                  )}
                </AnimatePresence>
              </a>
            </div>
          );
        })}

        {/* Glass Divider */}
        <div className="h-4 w-px bg-white/20 mx-0.5" />

        {/* Glass CTA Button "Let's Talk" */}
        <div className="relative flex items-center justify-center">
          <AnimatePresence>
            {hovered === "cta" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.85 }}
                animate={{ opacity: 1, y: -6, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 24 }}
                className="absolute bottom-full mb-2 pointer-events-none rounded-xl border border-white/20 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink shadow-lg whitespace-nowrap z-50"
              >
                Let&apos;s Talk
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-white" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.a
            href="#contact"
            onClick={() => handleTap("contact")}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            onPointerEnter={() => setHovered("cta")}
            onPointerLeave={() => setHovered(null)}
            className="group relative flex h-10 items-center gap-2 rounded-full border border-white/20 bg-transparent px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-paper transition-colors duration-300 hover:bg-paper hover:text-ink hover:border-paper hover:shadow-[0_0_20px_rgba(244,244,240,0.35)]"
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
      </motion.div>
    </motion.nav>
  );
}
