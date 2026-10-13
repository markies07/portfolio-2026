"use client";

import dynamic from "next/dynamic";
import { ABOUT } from "@/lib/content";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";

const Interactive3DPortfolio = dynamic(
  () => import("./Interactive3DPortfolio"),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "480px", background: "#0B0B0D", borderRadius: "0.5rem" }} /> }
);

export default function About() {
  return (
    <section id="about" className="relative bg-ink text-paper py-28 sm:py-36 lg:py-48">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading eyebrow="About" title="About" tone="light" />
              {/* No ScrollReveal wrapper — R3F Canvas needs resolved dimensions at mount */}
              <div className="mt-12 rounded-xl overflow-hidden" style={{ width: "100%", maxWidth: "32rem", height: "500px" }}>
                <Interactive3DPortfolio />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ScrollReveal variant="mask">
              <p className="font-display font-semibold leading-[1.05] tracking-tight text-[clamp(2rem,4.2vw,4rem)] text-paper">
                {ABOUT.statement}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed text-paper/70">
                {ABOUT.paragraph}
              </p>
            </ScrollReveal>


          </div>
        </div>
      </div>
    </section>
  );
}
