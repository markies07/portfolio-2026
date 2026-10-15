"use client";

import { EMAIL_TEMPLATE, PERSON } from "@/lib/content";

const enc = encodeURIComponent;
const { subject, body } = EMAIL_TEMPLATE;
const to = PERSON.email;

const MAILTO = `mailto:${to}?subject=${enc(subject)}&body=${enc(body)}`;
// Gmail's web composer, opened as a full-page draft
const GMAIL_WEB = `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(to)}&su=${enc(subject)}&body=${enc(body)}`;
// Gmail app on iOS (registered URL scheme)
const GMAIL_IOS = `googlegmail://co?to=${enc(to)}&subject=${enc(subject)}&body=${enc(body)}`;
// Gmail app on Android: a mailto intent pinned to the Gmail package. If the
// app isn't installed, Chrome follows the fallback to Gmail on the web.
const GMAIL_ANDROID =
  `intent:${to}?subject=${enc(subject)}&body=${enc(body)}` +
  `#Intent;scheme=mailto;package=com.google.android.gm;S.browser_fallback_url=${enc(GMAIL_WEB)};end`;

function platform() {
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "android";
  // iPadOS reports itself as a Mac, so also check for touch
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  return "desktop";
}

function openEmail(event) {
  // Let modified clicks (new tab, etc.) fall through to the plain mailto
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();

  const where = platform();

  if (where === "android") {
    window.location.href = GMAIL_ANDROID;
    return;
  }

  if (where === "ios") {
    // No reliable way to ask iOS whether Gmail is installed: try the app,
    // and if the page is still in front a moment later, use the default
    // mail app instead.
    const fallback = setTimeout(() => {
      if (document.visibilityState === "visible") window.location.href = MAILTO;
    }, 1200);
    document.addEventListener("visibilitychange", () => clearTimeout(fallback), { once: true });
    window.location.href = GMAIL_IOS;
    return;
  }

  const tab = window.open(GMAIL_WEB, "_blank");
  if (tab) tab.opener = null;
  else window.location.href = GMAIL_WEB; // popup blocked
}

/**
 * Link to your email that opens a pre-filled Gmail draft: Gmail on the web
 * on desktop, the Gmail app on phones. Without JS it's a normal mailto link.
 */
export default function EmailLink({ children, ...props }) {
  return (
    <a href={MAILTO} onClick={openEmail} {...props}>
      {children}
    </a>
  );
}
