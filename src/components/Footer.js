import { PERSON, SOCIALS, NAV_LINKS } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="relative bg-ink border-t border-paper/10 pt-20 sm:pt-28 pb-32 sm:pb-36">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <a
          href="#top"
          className="block select-none w-full overflow-visible"
        >
          <svg
            viewBox="0 0 1200 100"
            className="w-full h-auto block overflow-visible"
            aria-label={PERSON.name}
          >
            <text
              x="0"
              y="78"
              textLength="1200"
              lengthAdjust="spacingAndGlyphs"
              className="font-display font-semibold fill-paper text-[88px] uppercase transition-opacity duration-300 hover:opacity-80"
            >
              {PERSON.name}
            </text>
          </svg>
        </a>

        {/* Desktop Single Row / Mobile Stacked Navigation */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3" aria-label="Footer Navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.2em] text-paper/50 transition-colors duration-300 hover:text-paper"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <span className="hidden md:inline text-paper/20 font-mono text-xs select-none">|</span>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="font-mono text-xs uppercase tracking-[0.2em] text-paper/50 transition-colors duration-300 hover:text-paper"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <p className="mt-12 text-center font-mono text-[11px] tracking-[0.15em] text-paper/30">
          © {PERSON.year} {PERSON.name}. {PERSON.location}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
