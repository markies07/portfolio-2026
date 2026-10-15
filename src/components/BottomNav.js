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
import { EASE_OUT, heroTimeline } from "@/lib/motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";
import { useBackdropTone } from "@/hooks/useBackdropTone";
import { useIntroDone } from "@/lib/intro-context";
import { createDisplacementMap, supportsBackdropRefraction } from "@/lib/liquid-glass";

const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1));
const GLASS_FILTER_ID = "bottom-nav-glass";
// How long the selection stays a swollen lens after it starts moving
const LIFT_MS = 520;

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
  const introDone = useIntroDone();
  const [active, setActive] = useState(SECTION_IDS[0]);
  const [hovered, setHovered] = useState(null);
  const [pressed, setPressed] = useState(false);
  const [ripple, setRipple] = useState(null);
  const [lifted, setLifted] = useState(false);
  // Refraction map sized to the bar; stays null where the browser can't refract
  const [glass, setGlass] = useState(null);

  const trackRef = useRef(null);
  const itemRefs = useRef({});
  const activeRef = useRef(active);
  const locked = useRef(false);
  const lockTimer = useRef(0);
  const liftTimer = useRef(0);
  const rippleCount = useRef(0);
  const placed = useRef(false);
  // Icon button size in px — measured, since it follows the root font size
  const itemSize = useRef(40);

  // The droplet is described by its left and right edges so each edge can
  // chase its target on its own spring.
  const left = useMotionValue(0);
  const right = useMotionValue(0);
  const width = useTransform([left, right], ([l, r]) => Math.max(r - l, itemSize.current));
  // Stretching thins the drop a little, like surface tension
  const scaleY = useTransform(width, (w) => 1 - (Math.min(Math.max(w - itemSize.current, 0), 80) / 80) * 0.2);
  const jelly = useAnimationControls();

  // Light or dark content behind the bar — flips the tint (icons adapt
  // individually through data-glass-sample)
  const tone = useBackdropTone(trackRef);
  // iOS-style: the selection swells into a clear lens while it moves or is touched
  const lens = !prefersReduced && (pressed || lifted);

  const lift = useCallback(() => {
    setLifted(true);
    clearTimeout(liftTimer.current);
    liftTimer.current = setTimeout(() => setLifted(false), LIFT_MS);
  }, []);

  const measure = useCallback(() => {
    const el = itemRefs.current[activeRef.current];
    if (!el) return null;
    itemSize.current = el.offsetWidth;
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
          if (!entry.isIntersecting || entry.target.id === activeRef.current) return;
          setActive(entry.target.id);
          lift();
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [lift]);

  useEffect(
    () => () => {
      clearTimeout(lockTimer.current);
      clearTimeout(liftTimer.current);
    },
    []
  );

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
      scaleX: [1, 1.04, 0.99, 1],
      scaleY: [1, 0.96, 1.01, 1],
      transition: { duration: 0.75, ease: "easeOut" },
    });
    return () => controls.forEach((c) => c.stop());
  }, [active, prefersReduced, left, right, jelly, measure]);

  /* Keep the droplet glued to its item when the layout changes size, and
     rebuild the refraction map to match the bar */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const canRefract = supportsBackdropRefraction();
    const observer = new ResizeObserver(() => {
      if (canRefract) {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const url = createDisplacementMap(w, h, Math.min(h * 0.4, 20));
        setGlass(url ? { url, w, h } : null);
      }
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
    if (id !== activeRef.current) lift();
    setActive(id);
    setRipple({ id, key: rippleCount.current });
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: 36, scale: 0.9 }}
      animate={introDone ? { opacity: 1, y: 0, scale: 1 } : undefined}
      // Arrives with the hero details, after the name has landed
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: heroTimeline.details + 0.25 }}
      className="fixed bottom-6 sm:bottom-8 inset-x-0 z-65 flex justify-center px-4 pointer-events-none"
      aria-label="Primary"
    >
      {/* Refraction: a light blur, then the rim of the bar bends the
          backdrop through the displacement map (Chromium only) */}
      {glass && (
        <svg aria-hidden="true" width="0" height="0" className="absolute">
          <filter
            id={GLASS_FILTER_ID}
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feImage
              href={glass.url}
              x="0"
              y="0"
              width={glass.w}
              height={glass.h}
              preserveAspectRatio="none"
              result="map"
            />
            <feDisplacementMap
              in="blur"
              in2="map"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="G"
              result="refracted"
            />
            <feColorMatrix in="refracted" type="saturate" values="1.7" />
          </filter>
        </svg>
      )}

      <motion.div
        ref={trackRef}
        animate={jelly}
        data-tone={tone}
        className="liquid-glass pointer-events-auto relative flex items-center gap-1.5 rounded-full p-1.5"
      >
        {/* Glass stack: lens (blur/refraction), tint, specular rim */}
        <span
          aria-hidden="true"
          className="liquid-glass__layer liquid-glass__refraction"
          style={glass ? { backdropFilter: `url(#${GLASS_FILTER_ID})` } : undefined}
        />
        <span aria-hidden="true" className="liquid-glass__layer liquid-glass__tint" />
        <span aria-hidden="true" className="liquid-glass__layer liquid-glass__rim z-20" />

        {/* Liquid droplet — sits under the icons and travels between them,
            swelling into a clear lens while it moves or is pressed */}
        <motion.span
          aria-hidden="true"
          data-lifted={lens}
          className="liquid-glass__drop pointer-events-none absolute left-0 top-1.5 z-0 h-10 overflow-hidden rounded-full"
          style={{ x: left, width, scaleY }}
          animate={{ scale: lens ? 1.22 : 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
        >
          {/* Specular highlight — the lifted lens catches the most light */}
          <motion.span
            className="absolute inset-x-2.5 top-0.75 h-2.25 rounded-full bg-linear-to-b from-white/60 to-transparent"
            animate={{ opacity: lens ? 1 : 0.25 }}
            transition={{ duration: 0.3 }}
          />
        </motion.span>

        {NAV_LINKS.map((link, index) => {
          const id = link.href.slice(1);
          const isActive = active === id;
          const isHovered = hovered === id;
          const distance = hoveredIndex < 0 ? 9 : Math.abs(index - hoveredIndex);
          // Water-lens magnification around the pointer
          const iconScale = isActive && lens ? 1.18 : distance === 0 ? 1.3 : distance === 1 ? 1.1 : 1;

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
                onPointerCancel={() => setPressed(false)}
                onPointerLeave={() => {
                  setPressed(false);
                  setHovered(null);
                }}
                onPointerEnter={() => setHovered(id)}
                onFocus={() => setHovered(id)}
                onBlur={() => setHovered(null)}
                data-glass-sample
                className="liquid-glass__item relative flex h-10 w-10 items-center justify-center rounded-full"
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
                      initial={{ scale: 0.4, opacity: 0.6 }}
                      animate={{ scale: 2.3, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.75, ease: EASE_OUT }}
                      onAnimationComplete={() => setRipple(null)}
                      className="pointer-events-none absolute inset-0 rounded-full border border-current"
                    />
                  )}
                </AnimatePresence>
              </a>
            </div>
          );
        })}

        {/* Glass Divider */}
        <div data-glass-sample className="liquid-glass__divider relative h-4 w-px mx-0.5" />

        {/* Glass CTA Button "Let's Talk" */}
        <div className="relative z-10 flex items-center justify-center">
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
            data-glass-sample
            className="liquid-glass__cta group relative flex h-10 items-center gap-2 rounded-full px-4 font-mono text-[10px] uppercase tracking-[0.18em]"
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
