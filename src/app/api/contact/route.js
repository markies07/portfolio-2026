import nodemailer from "nodemailer";
import { PERSON } from "@/lib/content";
import { buildContactEmail, validateContact } from "@/lib/contact-email";

/*
 * Contact form → your inbox, via Nodemailer.
 *
 * Mail is sent through a separate "sender" Gmail account (CONTACT_SMTP_USER)
 * to your real address (CONTACT_TO). Because the sender is a different
 * account, messages don't arrive as "me" with your own avatar: they show the
 * visitor's name ("Jane Cooper via Portfolio") with the sender account's
 * profile picture, and Reply goes straight to the visitor. See .env.example.
 */

const SITE = "markchristian.vercel.app";

// Best-effort abuse limits. In-memory, so on serverless hosting each warm
// instance counts separately — enough to stop casual spamming.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MIN_FILL_MS = 1500; // faster than any person can fill the form
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

// Built per request (cheap — no pooled connections) so it always reflects
// the current environment variables
function getTransporter() {
  const user = process.env.CONTACT_SMTP_USER;
  const pass = process.env.CONTACT_SMTP_PASS;
  if (!user || !pass) return null;
  const host = process.env.CONTACT_SMTP_HOST;
  const port = Number(process.env.CONTACT_SMTP_PORT || 465);
  return host
    ? nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } })
    : nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

const fail = (status, error, extra) => Response.json({ ok: false, error, ...extra }, { status });

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return fail(400, "Something went wrong reading your message. Please try again.");
  }

  // Bot traps: a hidden field people never see, and an impossibly fast fill.
  // Answer as if it worked so bots don't learn to adapt.
  // (A missing or non-numeric elapsed counts as too fast.)
  if (payload?.website || !(Number(payload?.elapsed) >= MIN_FILL_MS)) return Response.json({ ok: true });

  const { data, errors } = validateContact(payload);
  if (errors) return fail(400, Object.values(errors)[0], { fields: errors });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return fail(429, `You've sent a few messages already — please wait a bit, or email me at ${PERSON.email}.`);
  }

  const transport = getTransporter();
  if (!transport) {
    console.error("[contact] CONTACT_SMTP_USER / CONTACT_SMTP_PASS are not set — see .env.example");
    return fail(503, `The form isn't available right now. Please email me at ${PERSON.email}.`);
  }

  const { subject, text, html } = buildContactEmail(data, { site: SITE });

  try {
    await transport.sendMail({
      from: { name: `${data.name} via Portfolio`, address: process.env.CONTACT_SMTP_USER },
      to: process.env.CONTACT_TO || PERSON.email,
      replyTo: { name: data.name, address: data.email },
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("[contact] sending failed:", error);
    return fail(502, `Your message couldn't be sent. Please try again, or email me at ${PERSON.email}.`);
  }

  return Response.json({ ok: true });
}
