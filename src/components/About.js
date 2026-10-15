"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { ABOUT } from "@/lib/content";
import { useNearViewport } from "@/hooks/useNearViewport";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";
import ScrollWords from "./ScrollWords";
import Parallax from "./Parallax";

const Interactive3DPortfolio = dynamic(() => import("./Interactive3DPortfolio"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
});

export default function About() {
  const stageRef = useRef(null);
  // The 3D bundle (three.js) only downloads once the section is close by
  const showStage = useNearViewport(stageRef, "600px");

  return (
    <section id="about" className="relative bg-ink text-paper py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-[100rem] px-5 sm:px-8 lg:px-12 xl:px-16">
        {/* Full-width heading like every other section. The column below it
            used to be sticky, but it was barely shorter than the copy beside
            it, so it only held for ~140px and then lurched loose. */}
        <SectionHeading eyebrow="About" title="About Me" tone="light" className="mb-12 sm:mb-16" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            {/* No ScrollReveal wrapper — R3F Canvas needs resolved dimensions at mount */}
            <div
              ref={stageRef}
              data-cursor
              data-cursor-label="Drag"
              className="rounded-xl overflow-hidden lg:-mt-16"
              style={{ width: "100%", maxWidth: "32rem", height: "31.25rem" }}
            >
              {showStage && <Interactive3DPortfolio />}
            </div>
          </div>

          <div className="lg:col-span-7">
            <ScrollWords
              text={ABOUT.statement}
              className="font-display font-semibold uppercase leading-[1.05] tracking-tight text-[clamp(2rem,4.2vw,4rem)] text-paper"
            />

            {/* Copy and facts drift as one block, so the spacing between
                them never stretches or collapses mid-scroll */}
            <Parallax from={60} to={-60} className="mt-10">
              <div className="max-w-xl space-y-6">
                {ABOUT.paragraphs.map((paragraph, i) => (
                  <ScrollReveal key={i} delay={0.05 * i}>
                    <p className="text-base sm:text-lg leading-relaxed text-paper/70">{paragraph}</p>
                  </ScrollReveal>
                ))}
              </div>

              <dl className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-xl border border-paper/10 bg-paper/10">
                {ABOUT.facts.map((fact, i) => (
                  <ScrollReveal key={fact.label} delay={0.08 * i} className="bg-ink p-5 sm:p-6">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/45">{fact.label}</dt>
                    <dd className="mt-2 text-sm sm:text-base text-paper/85">{fact.value}</dd>
                  </ScrollReveal>
                ))}
              </dl>
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  );
}
