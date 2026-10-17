"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useIntro } from "@/lib/intro-context";
import { EASE_OUT } from "@/lib/motion";

const COMMAND = "npm run dev";

// Timeline, in ms from mount — about 3s of terminal plus a ~0.5s fade,
// so roughly 3.5s before the site is fully on screen
const TYPE_START = 400;
const TYPE_STEP = 70; // per character
const OUTPUT_START = TYPE_START + COMMAND.length * TYPE_STEP + 150;
const HOLD = 450; // pause on the final line before handing off

const dim = "text-paper/40";
const ok = <span className="text-emerald-400">✓</span>;

// Output lines, each shown from `at` ms after Enter (and hidden again at
// `until`, which is how "Compiling" turns into "Compiled" in place).
const OUTPUT = [
  { at: 0, content: <span className={dim}>&gt; markchristiannaval-portfolio@0.1.0 dev</span> },
  { at: 0, content: <span className={dim}>&gt; next dev</span> },
  { at: 220, content: "" },
  {
    at: 220,
    content: (
      <>
        <span className="text-paper">▲ Next.js 16.3.5</span> <span className={dim}>(Turbopack)</span>
      </>
    ),
  },
  {
    at: 320,
    content: (
      <>
        <span className={dim}>  - Local:</span>        <span className="text-paper/80">http://localhost:3000</span>
      </>
    ),
  },
  { at: 320, content: "" },
  { at: 600, content: <>{ok} Ready in 412ms</> },
  { at: 780, until: 1200, content: <><span className={dim}>○</span> Compiling / ...</> },
  { at: 1200, content: <>{ok} Compiled / in 812ms</> },
];
const FINISH_AT = OUTPUT_START + OUTPUT[OUTPUT.length - 1].at + HOLD;

/**
 * Intro on every page load: a small terminal types `npm run dev`, "compiles", then
 * fades away to reveal the site — whose entrance animations wait for it.
 * Click or press any key to fast-forward.
 */
export default function IntroTerminal() {
  const { finish } = useIntro();
  const [active, setActive] = useState(true);
  const [typed, setTyped] = useState(0);
  const [elapsed, setElapsed] = useState(-1); // ms since Enter; -1 = not yet
  const [leaving, setLeaving] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    if (document.documentElement.dataset.intro === "skip") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(false);
      return;
    }
    if (!location.hash) window.scrollTo(0, 0);

    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
    const clearAll = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    let ended = false;
    const end = () => {
      if (ended) return;
      ended = true;
      setLeaving(true);
      finish();
    };

    for (let i = 1; i <= COMMAND.length; i++) at(TYPE_START + i * TYPE_STEP, () => setTyped(i));
    for (const line of OUTPUT) at(OUTPUT_START + line.at, () => setElapsed(line.at));
    at(FINISH_AT, end);

    // Fast-forward: show the finished terminal for a beat, then hand off
    const skip = () => {
      if (ended) return;
      clearAll();
      setTyped(COMMAND.length);
      setElapsed(Infinity);
      at(180, end);
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);

    return () => {
      clearAll();
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [finish]);

  if (!active) return null;

  const typing = typed < COMMAND.length || elapsed < 0;

  return (
    <motion.div
      aria-hidden="true"
      className="intro-overlay fixed inset-0 z-75 flex items-center justify-center bg-ink px-5"
      initial={false}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
      onAnimationComplete={() => leaving && setActive(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={leaving ? { opacity: 0, y: -8, scale: 0.96 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: leaving ? 0.45 : 0.5, ease: EASE_OUT }}
        className="theme-dark w-full max-w-[34rem] overflow-hidden rounded-xl border border-paper/10 bg-[#111] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
      >
        {/* Title bar */}
        <div className="relative flex items-center gap-2 border-b border-paper/8 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
          <span className="absolute inset-x-0 text-center font-mono text-[11px] tracking-wide text-paper/40">
            <span className="hidden sm:inline">mark@portfolio: </span>~/portfolio-2026
          </span>
        </div>

        {/* Session */}
        <pre className="min-h-[16.5rem] whitespace-pre-wrap px-5 py-4 font-mono text-xs sm:text-[13px] leading-[1.7] text-paper/85">
          <span className="text-accent">➜</span> <span className="text-sky-300/90">portfolio-2026</span>{" "}
          {COMMAND.slice(0, typed)}
          {typing && <span className="intro-caret" />}
          {"\n"}
          {OUTPUT.map((line, i) =>
            line.at <= elapsed && !(line.until <= elapsed) ? (
              <span key={i} className="block min-h-[1.7em]">
                {line.content}
              </span>
            ) : null
          )}
        </pre>
      </motion.div>
    </motion.div>
  );
}
