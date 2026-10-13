import { Plus_Jakarta_Sans, Inter, JetBrains_Mono, Instrument_Sans } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { CursorProvider } from "@/lib/cursor-context";
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
  "Mark Christian Naval is a full-stack web developer from Cavite, Philippines who builds fast, beautiful, easy-to-use websites and web apps — with AI built into the workflow.";

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
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrains.variable} ${instrumentSans.variable}`}
    >
      <body className="bg-ink text-paper">
        <CursorProvider>
          <SmoothScroll />
          <div className="grain-overlay" aria-hidden="true" />
          <CustomCursor />
          {children}
        </CursorProvider>
      </body>
    </html>
  );
}
