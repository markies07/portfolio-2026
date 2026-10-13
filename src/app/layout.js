import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CursorProvider } from "@/lib/cursor-context";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
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

export const metadata = {
  title: `${PERSON.name} — Full-Stack Developer & AI Prompt Engineer`,
  description:
    "Portfolio of Mark Christian Naval — Full-Stack Web Developer and AI Prompt Engineer based in Cavite, Philippines.",
  metadataBase: new URL("https://markchristian.vercel.app"),
  openGraph: {
    title: `${PERSON.name} — Full-Stack Developer & AI Prompt Engineer`,
    description:
      "Portfolio of Mark Christian Naval — Full-Stack Web Developer and AI Prompt Engineer based in Cavite, Philippines.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="bg-ink text-paper">
        <CursorProvider>
          <div className="grain-overlay" aria-hidden="true" />
          <ScrollProgress />
          <CustomCursor />
          {children}
        </CursorProvider>
      </body>
    </html>
  );
}
