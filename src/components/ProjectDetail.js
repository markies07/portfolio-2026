"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { PERSON, PROJECTS } from "@/lib/content";
import { EASE_OUT } from "@/lib/motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";
import ScrollReveal from "./ScrollReveal";
import ArrowIcon from "./ArrowIcon";

const CONTAINER = "mx-auto max-w-[100rem] px-5 sm:px-8 lg:px-12 xl:px-16";
const EYEBROW = "font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-paper/50";
const BUTTON =
  "group/btn inline-flex items-center gap-3 rounded-full px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300";
// Gallery slots shown until real screenshots are added in content.js
const PLACEHOLDER_SHOTS = 4;

const pad = (n) => String(n).padStart(2, "0");

/** Features are written "Title — description"; split them for the list. */
function splitFeature(text) {
  const [title, ...rest] = text.split(" — ");
  const body = rest.join(" — ");
  return { title, body: body && body[0].toUpperCase() + body.slice(1) };
}

function hostOf(url) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function ExternalIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GitHubIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LockIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ImageIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M21 16l-5-5-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Floating pill, top-left: returns to this project's card on the home page. */
function BackButton({ slug }) {
  return (
    <Link
      href={`/#project-${slug}`}
      className="group fixed left-4 top-4 sm:left-8 sm:top-6 z-50 inline-flex items-center gap-2.5 rounded-full border border-paper/15 bg-ink/70 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper backdrop-blur-md transition-colors duration-300 hover:border-transparent hover:bg-paper hover:text-ink"
    >
      <ArrowIcon className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
      Back
    </Link>
  );
}

/** "Go to website" + "View on GitHub" (or a note when the repo is private). */
function ProjectLinks({ project }) {
  const { live, repo } = project.links ?? {};

  return (
    <>
      {live && (
        <a
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          className={`${BUTTON} bg-paper text-ink hover:bg-paper/85`}
        >
          Go to website
          <ExternalIcon className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
        </a>
      )}
      {repo ? (
        <a
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          className={`${BUTTON} border border-paper/25 text-paper hover:border-paper hover:bg-paper/5`}
        >
          View on GitHub
          <GitHubIcon className="h-4 w-4" />
        </a>
      ) : (
        <span className={`${BUTTON} border border-dashed border-paper/20 text-paper/45`}>
          <LockIcon className="h-4 w-4" />
          Private repository
        </span>
      )}
    </>
  );
}

function Hero({ project }) {
  const prefersReduced = useSafeReducedMotion();
  const fadeUp = (delay) => ({
    initial: prefersReduced ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE_OUT },
  });

  return (
    <section className={`${CONTAINER} pt-28 sm:pt-36 pb-14 sm:pb-20`}>
      <motion.div
        {...fadeUp(0.05)}
        className="flex items-start justify-between gap-6 font-mono text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] text-paper/50"
      >
        <span>
          {project.index} — {project.category}
        </span>
        <span className="shrink-0">{project.year}</span>
      </motion.div>

      <h1 className="mt-6 overflow-hidden font-display font-semibold uppercase leading-[0.92] tracking-tight text-[clamp(3rem,9vw,9rem)]">
        <motion.span
          className="block"
          initial={prefersReduced ? false : { y: "100%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 1, delay: 0.12, ease: EASE_OUT }}
        >
          {project.title}
        </motion.span>
      </h1>

      <div className="mt-10 sm:mt-14 grid gap-10 lg:grid-cols-12 lg:items-end">
        <motion.p
          {...fadeUp(0.3)}
          className="lg:col-span-7 max-w-2xl text-lg sm:text-xl leading-relaxed text-paper/70"
        >
          {project.description}
        </motion.p>
        <motion.div {...fadeUp(0.4)} className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
          <ProjectLinks project={project} />
        </motion.div>
      </div>
    </section>
  );
}

/** Full-width cover; the artwork drifts a little inside its frame on scroll
 *  (CSS scroll-driven, see .drift in globals.css). */
function Cover({ project }) {
  const prefersReduced = useSafeReducedMotion();

  return (
    <div className={CONTAINER}>
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.35, ease: EASE_OUT }}
        className="drift-frame relative aspect-4/3 sm:aspect-video w-full overflow-clip border border-paper/10 bg-paper/4"
      >
        <div className="drift absolute -inset-y-[8%] inset-x-0" style={{ "--drift-from": "-7%", "--drift-to": "7%" }}>
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            preload
            placeholder="blur"
            sizes="(max-width: 1600px) 100vw, 1600px"
            className="object-cover object-top"
          />
        </div>
      </motion.div>
    </div>
  );
}

function Facts({ project }) {
  const live = project.links?.live;
  const facts = [
    { label: "Year", value: project.year },
    { label: "Type", value: project.category },
    { label: "Built with", value: project.stack.join(", ") },
    {
      label: "Website",
      value: live ? (
        <a href={live} target="_blank" rel="noopener noreferrer" className="underline decoration-paper/25 underline-offset-4 transition-colors hover:decoration-paper">
          {hostOf(live)}
        </a>
      ) : (
        "—"
      ),
    },
  ];

  return (
    <dl className={`${CONTAINER} mt-14 sm:mt-20`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-xl border border-paper/10 bg-paper/10">
        {facts.map((fact, i) => (
          <ScrollReveal key={fact.label} delay={0.06 * i} className="bg-ink p-5 sm:p-6">
            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/45">{fact.label}</dt>
            <dd className="mt-2 text-sm sm:text-base text-paper/85 wrap-break-word">{fact.value}</dd>
          </ScrollReveal>
        ))}
      </div>
    </dl>
  );
}

/** Label column on the left (sticky on wide screens), content on the right. */
function Split({ label, children, className = "" }) {
  return (
    <section className={`${CONTAINER} grid gap-8 lg:grid-cols-12 lg:gap-16 ${className}`}>
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <ScrollReveal>
            <p className={EYEBROW}>{label}</p>
          </ScrollReveal>
        </div>
      </div>
      <div className="lg:col-span-8">{children}</div>
    </section>
  );
}

function Features({ features }) {
  return (
    <ol className="border-t border-paper/10">
      {features.map((feature, i) => {
        const { title, body } = splitFeature(feature);
        return (
          <ScrollReveal
            as="li"
            key={title}
            amount={0.4}
            className="grid grid-cols-[2.75rem_1fr] sm:grid-cols-[4rem_1fr] gap-4 border-b border-paper/10 py-6 sm:py-8"
          >
            <span className="pt-1.5 font-mono text-xs tracking-[0.2em] text-paper/40">{pad(i + 1)}</span>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-semibold tracking-tight">{title}</h3>
              {body && <p className="mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-paper/65">{body}</p>}
            </div>
          </ScrollReveal>
        );
      })}
    </ol>
  );
}

const shotAlt = (shot, title, index) => shot.alt ?? `${title} screenshot ${index + 1}`;

/** Gallery tile; clicking it opens the screenshot in the full-screen viewer. */
function Screenshot({ shot, index, title, wide, onOpen }) {
  const alt = shotAlt(shot, title, index);

  return (
    <figure>
      <button
        type="button"
        onClick={onOpen}
        data-cursor-label="View"
        aria-label={`View full screen: ${alt}`}
        className="block w-full cursor-zoom-in overflow-hidden border border-paper/10 bg-paper/4"
      >
        <Image
          src={shot.src}
          alt={alt}
          placeholder={typeof shot.src === "object" ? "blur" : "empty"}
          sizes={wide ? "(max-width: 1600px) 100vw, 1600px" : "(max-width: 768px) 100vw, 50vw"}
          className="block h-auto w-full"
        />
      </button>
      {shot.caption && (
        <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/45">
          {shot.caption}
        </figcaption>
      )}
    </figure>
  );
}

function ShotPlaceholder({ index, wide }) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-3 border border-dashed border-paper/20 bg-paper/3 text-paper/35 ${
        wide ? "aspect-4/3 sm:aspect-video" : "aspect-4/3"
      }`}
    >
      <ImageIcon className="h-7 w-7" />
      <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Screenshot {pad(index + 1)}</span>
    </div>
  );
}

/**
 * Full-screen screenshot viewer: the whole image, as large as the screen
 * allows, with its caption. Closes on "Close", Escape, or a click outside
 * the image. The page underneath is held still while it's open.
 */
function Lightbox({ shot, index, title, onClose }) {
  const closeRef = useRef(null);
  const prefersReduced = useSafeReducedMotion();

  useEffect(() => {
    const opener = document.activeElement;
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = overflow;
      // Back to the tile that opened it, for keyboard users
      opener?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={shotAlt(shot, title, index)}
      // Lenis would otherwise turn wheel input over the viewer into page scroll
      data-lenis-prevent
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
      className="fixed inset-0 z-70 flex flex-col bg-ink/95 backdrop-blur-sm"
    >
      <div className="flex shrink-0 justify-end px-5 pt-5 sm:px-8 sm:pt-6">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="px-1 py-2 font-mono text-xs uppercase tracking-[0.2em] text-paper/70 transition-colors duration-300 hover:text-paper"
        >
          Close
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-5 pb-6 pt-2 sm:px-8 sm:pb-8">
        <motion.figure
          // Clicks on the image or caption shouldn't close it
          onClick={(event) => event.stopPropagation()}
          initial={prefersReduced ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="flex max-h-full max-w-full flex-col items-center"
        >
          <Image
            src={shot.src}
            alt={shotAlt(shot, title, index)}
            sizes="100vw"
            className="block h-auto max-h-[calc(100svh-9rem)] w-auto max-w-full border border-paper/10"
          />
          {shot.caption && (
            <figcaption className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-paper/55">
              {shot.caption}
            </figcaption>
          )}
        </motion.figure>
      </div>
    </motion.div>,
    document.body
  );
}

/** Bento gallery: every third shot spans the full width, the rest pair up
 *  (a last shot left without a partner spans the full width too). */
function Gallery({ project }) {
  const shots = project.screenshots ?? [];
  const items = shots.length ? shots : Array.from({ length: PLACEHOLDER_SHOTS }, () => null);
  const [open, setOpen] = useState(null); // index of the shot in the viewer
  const close = useCallback(() => setOpen(null), []);

  return (
    <section className={`${CONTAINER} pb-24 sm:pb-32`}>
      <div className="mb-10 sm:mb-14">
        <ScrollReveal>
          <p className={EYEBROW}>Screens</p>
        </ScrollReveal>
        <ScrollReveal delay={0.08} variant="mask">
          <h2 className="mt-4 font-display font-semibold leading-[0.95] tracking-tight text-[clamp(2.25rem,5vw,4.5rem)]">
            A Closer Look
          </h2>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {items.map((shot, i) => {
          const wide = i % 3 === 0 || (i === items.length - 1 && i % 3 === 1);
          return (
            <ScrollReveal key={i} amount={0.15} delay={i % 3 === 2 ? 0.1 : 0} className={wide ? "md:col-span-2" : ""}>
              {shot ? (
                <Screenshot shot={shot} index={i} title={project.title} wide={wide} onOpen={() => setOpen(i)} />
              ) : (
                <ShotPlaceholder index={i} wide={wide} />
              )}
            </ScrollReveal>
          );
        })}
      </div>

      <AnimatePresence>
        {open !== null && shots[open] && (
          <Lightbox key={open} shot={shots[open]} index={open} title={project.title} onClose={close} />
        )}
      </AnimatePresence>
    </section>
  );
}

function ClosingBand({ project }) {
  return (
    <section className={`${CONTAINER} pb-24 sm:pb-32`}>
      <ScrollReveal className="flex flex-col gap-8 rounded-2xl border border-paper/10 bg-paper/4 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className={EYEBROW}>See it live</p>
          <p className="mt-4 font-display font-semibold uppercase leading-[0.95] tracking-tight text-[clamp(2rem,4vw,3.5rem)]">
            Try {project.title}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ProjectLinks project={project} />
        </div>
      </ScrollReveal>
    </section>
  );
}

function OtherProjectCard({ project }) {
  return (
    <Link href={`/work/${project.slug}`} data-cursor-label="View" className="group block">
      <div className="relative aspect-4/3 overflow-hidden border border-paper/10 bg-paper/4">
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-top grayscale transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:grayscale-0 group-focus-visible:grayscale-0"
        />
      </div>
      <div className="mt-5 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/45">
        <span>
          {project.index} — {project.category}
        </span>
        <span>{project.year}</span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        <h3 className="font-display font-semibold uppercase tracking-tight leading-none text-[clamp(1.5rem,2.4vw,2rem)]">
          {project.title}
        </h3>
        <ArrowIcon className="h-5 w-5 shrink-0 -rotate-45 text-paper/60 transition-transform duration-300 group-hover:rotate-0 group-hover:text-paper" />
      </div>
    </Link>
  );
}

function OtherProjects({ slug }) {
  // Start with the project after this one and wrap around, so "next" comes first
  const start = PROJECTS.findIndex((p) => p.slug === slug);
  const others = [...PROJECTS.slice(start + 1), ...PROJECTS.slice(0, start)];

  return (
    <section className="border-t border-paper/10 py-24 sm:py-32">
      <div className={CONTAINER}>
        <div className="mb-12 sm:mb-16">
          <ScrollReveal>
            <p className={EYEBROW}>Keep exploring</p>
          </ScrollReveal>
          <ScrollReveal delay={0.08} variant="mask">
            <h2 className="mt-4 font-display font-semibold leading-[0.95] tracking-tight text-[clamp(2.25rem,5vw,4.5rem)]">
              Other Projects
            </h2>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-6 lg:gap-10">
          {others.map((project, i) => (
            <ScrollReveal key={project.slug} delay={0.08 * i} amount={0.2}>
              <OtherProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProjectDetail({ slug }) {
  const project = PROJECTS.find((p) => p.slug === slug);
  const { details } = project;

  return (
    <>
      <BackButton slug={slug} />

      <main className="bg-ink text-paper">
        <Hero project={project} />
        <Cover project={project} />
        <Facts project={project} />

        <Split label="Overview" className="py-24 sm:py-32">
          <ScrollReveal>
            <p className="font-display font-medium leading-snug tracking-tight text-[clamp(1.5rem,2.6vw,2.4rem)]">
              {details.overview}
            </p>
          </ScrollReveal>
        </Split>

        <Split label="Key features" className="pb-24 sm:pb-32">
          <Features features={details.features} />
        </Split>

        <Split label="Tech stack" className="pb-24 sm:pb-32">
          <ul className="flex flex-wrap gap-3">
            {details.stack.map((tech, i) => (
              <ScrollReveal
                as="li"
                key={tech}
                delay={0.04 * i}
                y={12}
                className="rounded-full border border-paper/15 bg-paper/4 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/70"
              >
                {tech}
              </ScrollReveal>
            ))}
          </ul>
        </Split>

        <Gallery project={project} />
        <ClosingBand project={project} />
        <OtherProjects slug={slug} />
      </main>

      <footer className={`${CONTAINER} border-t border-paper/10 py-10 text-center font-mono text-[11px] tracking-[0.15em] text-paper/35`}>
        © {PERSON.year} {PERSON.name}. {PERSON.location}. All rights reserved.
      </footer>
    </>
  );
}
