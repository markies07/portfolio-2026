import { Plus_Jakarta_Sans, Inter, JetBrains_Mono, Instrument_Sans } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { CursorProvider } from "@/lib/cursor-context";
import { IntroProvider } from "@/lib/intro-context";
import { INTRO_GATE_SCRIPT } from "@/lib/intro";
import { THEME_SCRIPT } from "@/lib/theme";
import IntroTerminal from "@/components/IntroTerminal";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import { PERSON } from "@/lib/content";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

// Refined neo-grotesque for the oversized name (hero + footer).
const instrumentSans = Instrument_Sans({
  variable: "--font-name",
  subsets: ["latin"],
  display: "swap",
});

const TITLE = `${PERSON.name} — Full-Stack Web Developer`;
const DESCRIPTION =
  "Mark Christian Naval is a full-stack web developer and AI prompt engineer from Cavite, Philippines, building fast, dependable websites and web applications that help businesses grow.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://markchristian.vercel.app"),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the theme and intro gate scripts set
    // data-theme / data-intro on <html> before React hydrates
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrains.variable} ${instrumentSans.variable}`}
    >
      <body className="bg-ink text-paper">
        {/* Plain inline script (not next/script, which defers inline code to
            a queue) so it runs during parsing, before the terminal below it
            can paint */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE_SCRIPT }} />
        {/* Without JS the terminal could never finish — skip it entirely —
            and nothing would ever flag scroll reveals as in view */}
        <noscript>
          <style>{`.intro-overlay{display:none}html{overflow:auto}.reveal,.reveal-mask-inner{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <IntroProvider>
          <CursorProvider>
            <SmoothScroll />
            <div className="grain-overlay" aria-hidden="true" />
            <CustomCursor />
            <IntroTerminal />
            {children}
          </CursorProvider>
        </IntroProvider>
      </body>
    </html>
  );
}
