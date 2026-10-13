"use client";

import ScrollReveal from "./ScrollReveal";

/**
 * Large editorial section heading: small tracked eyebrow + oversized title.
 */
export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
  tone = "light",
  className = "",
  titleClassName = "",
}) {
  const eyebrowColor = tone === "light" ? "text-paper/50" : "text-ink/45";
  const titleColor = tone === "light" ? "text-paper" : "text-ink";

  return (
    <div
      className={`${align === "center" ? "text-center mx-auto" : "text-left"} ${className}`}
    >
      {eyebrow && (
        <ScrollReveal delay={0}>
          <p className={`font-mono text-xs sm:text-sm tracking-[0.25em] uppercase ${eyebrowColor}`}>
            {eyebrow}
          </p>
        </ScrollReveal>
      )}
      <ScrollReveal delay={0.08} variant="mask">
        <h2
          className={`mt-4 font-display font-semibold leading-[0.95] tracking-tight text-[clamp(2.75rem,7vw,7rem)] ${titleColor} ${titleClassName}`}
        >
          {title}
        </h2>
      </ScrollReveal>
    </div>
  );
}
