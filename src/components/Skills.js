"use client";

import { useState } from "react";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";

/* ─── Keyframe CSS ──────────────────────────────────────────────────────────── */
const MARQUEE_STYLE = `
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.marquee-track {
  animation: marquee var(--dur, 45s) linear infinite;
  will-change: transform;
}
.marquee-track.paused {
  animation-play-state: paused;
}
`;

/* ─── Cleaned SKILLS list with official vector brand icons ─────────────────────── */
const SKILLS = [
  {
    name: "Claude Opus", color: "#D97757",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M17.472 14.382c-.22-.614-.71-1.12-1.34-1.34l-3.23-1.14a.42.42 0 0 1 0-.79l3.23-1.14c.63-.22 1.12-.72 1.34-1.34l1.14-3.23a.42.42 0 0 1 .79 0l1.14 3.23c.22.62.72 1.12 1.34 1.34l3.23 1.14a.42.42 0 0 1 0 .79l-3.23 1.14c-.62.22-1.12.72-1.34 1.34l-1.14 3.23a.42.42 0 0 1-.79 0l-1.14-3.23zM9.5 22a.5.5 0 0 1-.47-.33l-2.02-5.69c-.39-1.09-1.25-1.95-2.34-2.34L.98 11.62a.5.5 0 0 1 0-.94l3.69-1.31c1.09-.39 1.95-1.25 2.34-2.34L9.03 1.34a.5.5 0 0 1 .94 0l2.02 5.69c.39 1.09 1.25 1.95 2.34 2.34l3.69 1.31a.5.5 0 0 1 0 .94l-3.69 1.31c-1.09.39-1.95 1.25-2.34 2.34l-2.02 5.69a.5.5 0 0 1-.47.33z" />
      </svg>
    ),
  },
  {
    name: "Claude Sonnet", color: "#E08060",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M17.472 14.382c-.22-.614-.71-1.12-1.34-1.34l-3.23-1.14a.42.42 0 0 1 0-.79l3.23-1.14c.63-.22 1.12-.72 1.34-1.34l1.14-3.23a.42.42 0 0 1 .79 0l1.14 3.23c.22.62.72 1.12 1.34 1.34l3.23 1.14a.42.42 0 0 1 0 .79l-3.23 1.14c-.62.22-1.12.72-1.34 1.34l-1.14 3.23a.42.42 0 0 1-.79 0l-1.14-3.23zM9.5 22a.5.5 0 0 1-.47-.33l-2.02-5.69c-.39-1.09-1.25-1.95-2.34-2.34L.98 11.62a.5.5 0 0 1 0-.94l3.69-1.31c1.09-.39 1.95-1.25 2.34-2.34L9.03 1.34a.5.5 0 0 1 .94 0l2.02 5.69c.39 1.09 1.25 1.95 2.34 2.34l3.69 1.31a.5.5 0 0 1 0 .94l-3.69 1.31c-1.09.39-1.95 1.25-2.34 2.34l-2.02 5.69a.5.5 0 0 1-.47.33z" />
      </svg>
    ),
  },
  {
    name: "Gemini Flash", color: "#8E75FF",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 24C12 17.37 17.37 12 24 12 17.37 12 12 6.63 12 0 12 6.63 6.63 12 0 12 6.63 12 12 17.37 12 24z" />
      </svg>
    ),
  },
  {
    name: "GPT-4o", color: "#10A37F",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9 6.06 6.06 0 0 0-4.63-2.07 6.06 6.06 0 0 0-5.76 4.14 6.05 6.05 0 0 0-4.14 2.99 6.06 6.06 0 0 0 .74 7.1 5.98 5.98 0 0 0 .52 4.91 6.05 6.05 0 0 0 6.51 2.9 6.06 6.06 0 0 0 4.63 2.07 6.06 6.06 0 0 0 5.76-4.14 6.05 6.05 0 0 0 4.14-2.99 6.06 6.06 0 0 0-.74-7.1zM13.1 2.5c1.88 0 3.52.99 4.4 2.47a5.95 5.95 0 0 0-3.07 2.36L13.1 6.6V2.5zm-2.2 0v4.1L9.57 7.33a5.95 5.95 0 0 0-3.07-2.36A5.06 5.06 0 0 1 10.9 2.5zM3.48 8.16A5.04 5.04 0 0 1 6.7 5.7a5.95 5.95 0 0 0 0 3.86L4.54 10.8a4.99 4.99 0 0 1-1.06-2.64zm1.18 7.42A5.04 5.04 0 0 1 3.48 12.94c0-.92.25-1.8.71-2.56l2.16 1.25a5.95 5.95 0 0 0 0 3.86l-1.69 2.09zm5.34 5.92c-1.88 0-3.52-.99-4.4-2.47a5.95 5.95 0 0 0 3.07-2.36l1.33.77v4.06zm2.2 0v-4.06l1.33-.77a5.95 5.95 0 0 0 3.07 2.36 5.06 5.06 0 0 1-4.4 2.47zm7.42-5.66a5.04 5.04 0 0 1-3.22 2.46 5.95 5.95 0 0 0 0-3.86l2.16-1.25c.46.76.71 1.64.71 2.56 0 .03 0 .06-.01.09zm-1.18-7.42c.46.76.71 1.64.71 2.56a4.99 4.99 0 0 1-1.06 2.64l-2.16-1.24a5.95 5.95 0 0 0 0-3.86l2.51-.1zm-8.14 7.6l-3.2-1.85 3.2-1.85 3.2 1.85-3.2 1.85z" />
      </svg>
    ),
  },
  {
    name: "DeepSeek", color: "#4D6BFE",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      </svg>
    ),
  },
  {
    name: "React", color: "#61DAFB",
    icon: (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="h-5 w-5">
        <circle cx="50" cy="50" r="10" fill="currentColor" />
        <ellipse cx="50" cy="50" rx="42" ry="16" />
        <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(120 50 50)" />
      </svg>
    ),
  },
  {
    name: "Next.js", color: "#ffffff",
    icon: (
      <svg viewBox="0 0 128 128" fill="currentColor" className="h-5 w-5">
        <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm37.8 107.4L55.4 46.1H44.8V89.9h9.3V59.4l41.6 54.3c-3.7 2.1-7.7 3.8-11.7 5.1zM83.2 46.1h9.3v34.7h-9.3V46.1z" />
      </svg>
    ),
  },
  {
    name: "TypeScript", color: "#3178C6",
    icon: (
      <svg viewBox="0 0 128 128" fill="currentColor" className="h-5 w-5">
        <path d="M1.5 1.5h125v125H1.5z" fill="none" stroke="currentColor" strokeWidth="8" />
        <path d="M98 70c0-6-4.5-9.8-14-12.5l-3.8-1.1c-5.5-1.6-7.7-3.3-7.7-6.2 0-3.1 3-5.2 7.7-5.2 4.7 0 9.2 1.6 13 4.5l5.2-7.5c-5.2-3.8-11.8-6.1-18.7-6.1-10.5 0-17.5 5.5-17.5 14.5 0 6.5 4.3 10.5 13.5 13.1l3.8 1.1c5.8 1.7 8.3 3.6 8.3 6.7 0 3.6-3.6 5.8-9.1 5.8-6.1 0-12.2-2.3-17.2-6.5l-5.4 7.7c6.5 5.3 14.8 8.4 23 8.4 12 0 19-5.9 19-15.7zM42.7 45.9h14.5v43.2h-11V56.2H31.6v-10.3h11.1z" />
      </svg>
    ),
  },
  {
    name: "JavaScript", color: "#F7DF1E",
    icon: (
      <svg viewBox="0 0 128 128" fill="currentColor" className="h-5 w-5">
        <path d="M1.5 1.5h125v125H1.5z" fill="none" stroke="currentColor" strokeWidth="8" />
        <path d="M102.3 84.8c-2.3 3.8-6 6.6-10.8 8.1-4.8 1.5-10.1 1.7-15.3.6-4.6-.9-8.7-2.9-12.1-5.7l5.2-7.6c2.7 2.3 5.9 3.9 9.3 4.6 3.4.7 6.9.5 10-.7 1.8-.7 2.9-2.1 2.9-3.9 0-1.8-1.2-3.2-3.6-4.2-2.4-1-6.1-2.2-11.1-3.6-5.1-1.4-8.8-3.4-11.2-5.9-2.4-2.5-3.6-5.7-3.6-9.6 0-5.1 2.1-9.3 6.3-12.4 4.2-3.1 9.8-4.5 16.5-4.2 4.9.2 9.5 1.5 13.5 3.9l-4.5 7.9c-3.1-1.8-6.6-2.8-10.2-2.9-2.7-.1-5.2.5-6.7 1.6-1.5 1.1-2.2 2.5-2.2 4.1 0 1.6 1.1 2.8 3.3 3.7 2.2.9 5.8 2.1 10.7 3.4 5.3 1.4 9.1 3.4 11.6 5.8 2.5 2.4 3.7 5.7 3.7 9.8-.1 4.5-1.7 8.1-4.6 11.5zM48.5 36.3v39.1c0 4.6-1.3 8.1-3.8 10.5-2.5 2.4-6.3 3.6-11.4 3.6-4.2 0-8.2-.8-11.8-2.5l2.7-8.1c2.6 1.3 5.5 2 8.4 2 2.4 0 4.1-.5 5.2-1.6 1.1-1.1 1.7-2.8 1.7-5.1V36.3h9z" />
      </svg>
    ),
  },
  {
    name: "Tailwind CSS", color: "#06B6D4",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
      </svg>
    ),
  },
  {
    name: "Firebase", color: "#FFCA28",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M3.89 15.672L6.255.461A.542.542 0 0 1 7.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 0 0-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 0 0 1.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 0 0-.96 0L3.53 17.984z" />
      </svg>
    ),
  },
  {
    name: "Node.js", color: "#5FA04E",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 1.608c-.28 0-.57.07-.8.21L2.4 6.788a1.6 1.6 0 0 0-.8.8v9.96c0 .34.09.68.27.97l8.8 5.07c.23.14.52.21.8.21s.57-.07.8-.21l8.8-5.07c.18-.29.27-.63.27-.97V7.588a1.6 1.6 0 0 0-.8-.8l-8.8-4.97c-.23-.14-.52-.21-.8-.21zm0 2.404l7.2 4.14v8.28L12 20.572 4.8 16.432v-8.28L12 4.012z" />
      </svg>
    ),
  },
  {
    name: "MySQL", color: "#4479A1",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M21.944 12.186c-1.127-1.11-2.887-1.397-4.22-1.397-1.077 0-2.316.27-3.08.777-.384.254-.69.578-.888.948-.285.534-.288 1.15-.05 1.708.31.733.987 1.258 1.764 1.488 1.096.326 2.312.138 3.397-.22 1.353-.447 2.656-1.164 3.077-2.304zm-1.87 1.07c-.428.607-1.41.97-2.298 1.055-.776.074-1.574-.108-2.007-.468-.3-.248-.42-.613-.306-.975.126-.397.47-.698.882-.876.77-.33 1.748-.415 2.573-.326 1.002.107 1.696.657 1.156 1.59zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
      </svg>
    ),
  },
  {
    name: "PHP", color: "#777BB4",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 4C5.37 4 0 7.58 0 12s5.37 8 12 8 12-3.58 12-8-5.37-8-12-8zm-5.5 11.5H5.1V8.5h2.5c1.4 0 2.2.6 2.2 1.8 0 1.2-.8 1.8-2.2 1.8H6.5v3.4zm1.4-4.8H6.5v-1.4h1.4c.5 0 .8.2.8.7 0 .5-.3.7-.8.7zm7.6 4.8h-1.4V8.5h2.5c1.4 0 2.2.6 2.2 1.8 0 1.2-.8 1.8-2.2 1.8h-1.1v3.4zm1.4-4.8h-1.4v-1.4h1.4c.5 0 .8.2.8.7 0 .5-.3.7-.8.7zm-4.7 4.8h-1.4V8.5h1.4v2.7h2.2V8.5h1.4v7h-1.4v-3H12.2v3z" />
      </svg>
    ),
  },
  {
    name: "Figma", color: "#F24E1E",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M8 24c2.21 0 4-1.79 4-4v-4H8c-2.21 0-4 1.79-4 4s1.79 4 4 4zM4 12c0-2.21 1.79-4 4-4h4v8H8c-2.21 0-4-1.79-4-4zm0-8c0-2.21 1.79-4 4-4h4v8H8c-2.21 0-4-1.79-4-4zm8-4h4c2.21 0 4 1.79 4 4s-1.79 4-4 4h-4V0zm4 16c2.21 0 4-1.79 4-4s-1.79-4-4-4h-4v8h4z" />
      </svg>
    ),
  },
  {
    name: "Git", color: "#F05032",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.658 2.66a1.838 1.838 0 0 1 1.903.434 1.845 1.845 0 0 1 0 2.606 1.845 1.845 0 0 1-2.606 0 1.845 1.845 0 0 1-.404-2.018l-2.48-2.48v6.533a1.836 1.836 0 0 1 .481 3.522 1.845 1.845 0 0 1-2.386-1.752 1.84 1.84 0 0 1 1.106-1.692V8.378A1.841 1.841 0 0 1 9.68 6.23L6.96 3.51 0.451 10.021a1.55 1.55 0 0 0 0 2.189l10.478 10.478a1.55 1.55 0 0 0 2.188 0l10.428-10.428a1.55 1.55 0 0 0 0-2.331z" />
      </svg>
    ),
  },
  {
    name: "GitHub", color: "#ffffff",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
];

function SkillPill({ name, color, icon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-2.5 rounded-xl border border-paper/10 bg-paper/[0.04] px-4 py-3 shrink-0 cursor-default select-none transition-all duration-300 hover:border-paper/20 hover:bg-paper/[0.08]"
    >
      <span
        style={{
          color: hovered ? color : "rgba(244,244,240,0.7)",
          filter: hovered ? "none" : "brightness(1.2)",
          transition: "color 0.3s, filter 0.3s",
          display: "flex",
          alignItems: "center",
        }}
      >
        {icon}
      </span>
      <span
        className="font-mono text-[10px] uppercase tracking-[0.18em] whitespace-nowrap transition-colors duration-300"
        style={{ color: hovered ? "rgba(244,244,240,0.95)" : "rgba(244,244,240,0.5)" }}
      >
        {name}
      </span>
    </div>
  );
}

export default function Skills() {
  const [paused, setPaused] = useState(false);
  // Quadruple items for infinite seamless scroll
  const items = [...SKILLS, ...SKILLS, ...SKILLS, ...SKILLS];

  return (
    <section className="relative bg-ink py-28 sm:py-36 lg:py-44 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_STYLE }} />

      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16 mb-16 sm:mb-20">
        <SectionHeading eyebrow="My Skills" title="Skills That Drive Results" />
      </div>

      <ScrollReveal delay={0.1}>
        {/* Left + right fade masks */}
        <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-28 z-10"
            style={{ background: "linear-gradient(to right, var(--color-ink), transparent)" }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-28 z-10"
            style={{ background: "linear-gradient(to left, var(--color-ink), transparent)" }}
          />

          {/* The track */}
          <div
            className={`marquee-track flex gap-3 ${paused ? "paused" : ""}`}
            style={{ "--dur": "45s", width: "max-content" }}
          >
            {items.map((skill, i) => (
              <SkillPill key={`${skill.name}-${i}`} {...skill} />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
