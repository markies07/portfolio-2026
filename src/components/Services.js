"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICES } from "@/lib/content";
import { EASE_OUT } from "@/lib/motion";
import SectionHeading from "./SectionHeading";

// Custom Technical Emblems for each Service offering
const EMBLEMS = {
  // 01: Full-Stack Web Development (Code Brackets + Database Stack + Connected Nodes)
  "01": (
    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-paper/80 group-hover:text-accent transition-colors duration-300" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 20L8 32l10 12M46 20l10 12-10 12" />
      <path strokeLinecap="round" d="M36 16l-8 32" strokeWidth={1.4} opacity={0.6} />
      <rect x="22" y="22" width="20" height="6" rx="2" strokeWidth={1.4} />
      <rect x="22" y="36" width="20" height="6" rx="2" strokeWidth={1.4} />
      <circle cx="32" cy="10" r="2" fill="currentColor" />
      <circle cx="32" cy="54" r="2" fill="currentColor" />
    </svg>
  ),
  // 02: AI Prompt Engineering & Workflows (8-point AI Neural Spark Emblem)
  "02": (
    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-paper/80 group-hover:text-accent transition-colors duration-300" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M32 6v52M6 32h52M13.6 13.6l36.8 36.8M13.6 50.4L50.4 13.6" opacity={0.3} />
      <path d="M32 10c2 10 12 20 22 22-10 2-20 12-22 22-2-10-12-20-22-22 10-2 20-12 22-22z" fill="currentColor" fillOpacity={0.15} strokeWidth={1.8} />
      <circle cx="32" cy="32" r="4" fill="currentColor" />
      <circle cx="32" cy="10" r="2.5" fill="currentColor" />
      <circle cx="54" cy="32" r="2.5" fill="currentColor" />
      <circle cx="32" cy="54" r="2.5" fill="currentColor" />
      <circle cx="10" cy="32" r="2.5" fill="currentColor" />
    </svg>
  ),
  // 03: Front-End Engineering (Responsive App Window + Component Nodes)
  "03": (
    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-paper/80 group-hover:text-accent transition-colors duration-300" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <rect x="8" y="12" width="48" height="40" rx="6" strokeWidth={1.8} />
      <path strokeLinecap="round" d="M8 22h48" />
      <circle cx="15" cy="17" r="1.5" fill="currentColor" />
      <circle cx="21" cy="17" r="1.5" fill="currentColor" />
      <circle cx="27" cy="17" r="1.5" fill="currentColor" />
      <rect x="15" y="28" width="16" height="18" rx="3" strokeWidth={1.4} fill="currentColor" fillOpacity={0.1} />
      <rect x="35" y="28" width="14" height="7" rx="2" strokeWidth={1.4} />
      <rect x="35" y="39" width="14" height="7" rx="2" strokeWidth={1.4} />
    </svg>
  ),
  // 04: Backend Architecture & APIs (Server Cylinders + API Endpoints)
  "04": (
    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-paper/80 group-hover:text-accent transition-colors duration-300" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <ellipse cx="32" cy="16" rx="20" ry="6" strokeWidth={1.8} />
      <path d="M12 16v14c0 3.3 9 6 20 6s20-2.7 20-6V16" strokeWidth={1.8} />
      <path d="M12 30v14c0 3.3 9 6 20 6s20-2.7 20-6V30" strokeWidth={1.8} />
      <path strokeLinecap="round" d="M22 23h2M22 37h2M40 23h2M40 37h2" opacity={0.7} />
      <path strokeLinecap="round" strokeLinejoin="round" d="M44 48l8 8M52 48l-8 8" opacity={0.6} />
    </svg>
  ),
  // 05: UI/UX Web Design (Bezier Pen Tool + Crosshairs Grid)
  "05": (
    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-paper/80 group-hover:text-accent transition-colors duration-300" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <circle cx="32" cy="32" r="22" strokeDasharray="3 3" opacity={0.4} />
      <path strokeLinecap="round" d="M32 6v6M32 52v6M6 32h6M52 32h6" opacity={0.4} />
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 42l20-20M22 42l7-17 10 10-17 7z" strokeWidth={1.8} />
      <rect x="38" y="18" width="8" height="8" rx="1.5" fill="currentColor" fillOpacity={0.2} strokeWidth={1.6} />
      <rect x="18" y="38" width="8" height="8" rx="1.5" fill="currentColor" fillOpacity={0.2} strokeWidth={1.6} />
    </svg>
  ),
  // 06: Graphic Design & Video Editing (Film Clapper / Video Play + Palette Node)
  "06": (
    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-paper/80 group-hover:text-accent transition-colors duration-300" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <rect x="8" y="14" width="48" height="36" rx="6" strokeWidth={1.8} />
      <path strokeLinecap="round" strokeLinejoin="round" d="M26 24l16 8-16 8V24z" fill="currentColor" fillOpacity={0.2} strokeWidth={1.8} />
      <path strokeLinecap="round" d="M8 22h48M18 14l6 8M34 14l6 8M50 14l6 8" opacity={0.5} />
      <circle cx="50" cy="42" r="4" fill="currentColor" fillOpacity={0.2} strokeWidth={1.4} />
    </svg>
  ),
};

function ServiceRow({ service, index, isOpen, onToggle }) {
  const emblemKey = service.index;

  return (
    <div className="border-b border-paper/10">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 py-6 sm:py-8 text-left group"
        aria-expanded={isOpen}
      >
        <span className="flex items-baseline gap-4 sm:gap-8">
          <span className="font-mono text-xs sm:text-sm text-paper/40 group-hover:text-accent transition-colors duration-300">
            {service.index}
          </span>
          <span
            className={`font-display font-semibold tracking-tight leading-none text-[clamp(1.75rem,4.4vw,3.75rem)] transition-colors duration-300 ${
              isOpen ? "text-paper" : "text-paper/60 group-hover:text-paper"
            }`}
          >
            {service.title}
          </span>
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="shrink-0 font-display text-3xl text-paper/40 group-hover:text-accent transition-colors duration-300"
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 pb-10 sm:pb-12 pl-0 sm:pl-16 lg:pl-20">
              {/* Standalone Vector Emblem */}
              <div className="shrink-0 flex items-center justify-center py-2 text-paper/80">
                {EMBLEMS[emblemKey] || EMBLEMS["01"]}
              </div>

              <p className="max-w-xl text-sm sm:text-base leading-relaxed text-paper/70">
                {service.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Services() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="services" className="relative bg-ink py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <SectionHeading eyebrow="What I Do" title="Services" className="mb-16 sm:mb-24" />

        <div className="border-t border-paper/10">
          {SERVICES.map((service, index) => (
            <ServiceRow
              key={service.index}
              service={service}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
