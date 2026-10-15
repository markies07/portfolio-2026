"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICES } from "@/lib/content";
import { EASE_OUT } from "@/lib/motion";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";

const panelContent = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function ServiceRow({ service, isOpen, onToggle }) {
  const panelId = `service-panel-${service.index}`;

  return (
    <div className="relative border-b border-paper/10">
      {/* Accent line that draws across the top edge of the open row */}
      <motion.span
        aria-hidden="true"
        className="absolute -top-px left-0 h-px w-full origin-left bg-paper/60"
        initial={false}
        animate={{ scaleX: isOpen ? 1 : 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      />

      <button
        type="button"
        onClick={onToggle}
        data-cursor-skip
        className="flex w-full items-center justify-between gap-6 py-6 sm:py-8 text-left"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="flex items-baseline">
          <span className="w-10 sm:w-16 lg:w-20 shrink-0 font-mono text-xs sm:text-sm text-paper/40">
            {service.index}
          </span>
          <span
            className={`font-display font-semibold tracking-tight leading-none text-[clamp(1.75rem,4.4vw,3.75rem)] transition-colors duration-300 ${
              isOpen ? "text-paper" : "text-paper/55"
            }`}
          >
            {service.title}
          </span>
        </span>

        <span
          aria-hidden="true"
          className={`relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
            isOpen ? "border-paper bg-paper text-ink" : "border-paper/20 text-paper/60"
          }`}
        >
          <motion.svg
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <path d="M8 2v12M2 8h12" />
          </motion.svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.06, delayChildren: 0.1 }}
              className="pb-10 sm:pb-14 pl-10 sm:pl-16 lg:pl-20 pr-14 sm:pr-20"
            >
              <motion.p
                variants={panelContent}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed text-paper/75"
              >
                {service.description}
              </motion.p>

              <ul className="mt-7 flex flex-wrap gap-2.5">
                {service.highlights.map((item) => (
                  <motion.li
                    key={item}
                    variants={panelContent}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    className="rounded-full border border-paper/15 bg-paper/4 px-4 py-2 text-xs sm:text-sm text-paper/80"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
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
      <div className="mx-auto max-w-[100rem] px-5 sm:px-8 lg:px-12 xl:px-16">
        <SectionHeading eyebrow="What I Do" title="Services" className="mb-16 sm:mb-24" />

        <div className="border-t border-paper/10">
          {SERVICES.map((service, index) => (
            <ScrollReveal key={service.index} y={24} amount={0.5} duration={0.8}>
              <ServiceRow
                service={service}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
