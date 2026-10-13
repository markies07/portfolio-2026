"use client";

import ScrollReveal from "./ScrollReveal";
import Parallax from "./Parallax";

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
    <Parallax from={70} to={-70} className={className}>
    <div
      className={align === "center" ? "text-center mx-auto" : "text-left"}
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
    </Parallax>
  );
}
