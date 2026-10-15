// Contact form: validation (shared by the form and the API route) and the
// email you receive.

export const LIMITS = { name: 100, email: 254, messageMin: 10, message: 5000 };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONTROL_RE = /[\u0000-\u001f\u007f]/;

/**
 * Returns { data } with trimmed values when valid, or { errors } keyed by
 * field with a message a visitor can act on.
 */
export function validateContact(input) {
  const name = String(input?.name ?? "").trim();
  const email = String(input?.email ?? "").trim();
  const message = String(input?.message ?? "").trim();
  const errors = {};

  if (!name) errors.name = "Please add your name.";
  else if (name.length > LIMITS.name) errors.name = `Please keep your name under ${LIMITS.name} characters.`;
  else if (CONTROL_RE.test(name)) errors.name = "Your name has characters I can't use.";

  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) errors.email = "Please enter a valid email address.";

  if (message.length < LIMITS.messageMin) errors.message = "Please write a little more about your project.";
  else if (message.length > LIMITS.message) errors.message = `Please keep it under ${LIMITS.message} characters.`;

  return Object.keys(errors).length ? { errors } : { data: { name, email, message } };
}

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** Subject, plain-text and HTML versions of the email you receive. */
export function buildContactEmail({ name, email, message }, { site = "your portfolio", sentAt = new Date() } = {}) {
  const when = sentAt.toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const n = escapeHtml(name);
  const e = escapeHtml(email);
  const m = escapeHtml(message);

  const subject = `Portfolio inquiry from ${name}`;

  const text = [
    `New message from your portfolio contact form`,
    ``,
    `From: ${name} <${email}>`,
    `Sent: ${when} (Manila)`,
    ``,
    message,
    ``,
    `— Reply to this email to answer ${name} directly.`,
  ].join("\n");

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f4f0">
<div style="padding:32px 16px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0a0a0a">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e6e6e1;border-radius:16px;overflow:hidden">
    <div style="background:#0a0a0a;color:#f4f4f0;padding:18px 28px;font:600 11px/1.4 ui-monospace,Menlo,Consolas,monospace;letter-spacing:0.2em;text-transform:uppercase">
      Portfolio &middot; New message
    </div>
    <div style="padding:28px">
      <p style="margin:0 0 4px;font-size:22px;font-weight:600;line-height:1.3">${n}</p>
      <p style="margin:0 0 24px;font-size:15px"><a href="mailto:${e}" style="color:#d6362c;text-decoration:none">${e}</a></p>
      <div style="white-space:pre-wrap;font-size:15px;line-height:1.65;border-left:3px solid #d6362c;padding:2px 0 2px 16px">${m}</div>
      <p style="margin:28px 0 0;font-size:13px;color:#6b6b66">Hit <b>Reply</b> to answer ${n} directly.</p>
    </div>
    <div style="padding:14px 28px;border-top:1px solid #eeeeea;font-size:12px;color:#9a9a94">
      Sent from the contact form on ${escapeHtml(site)} &middot; ${escapeHtml(when)} (Manila)
    </div>
  </div>
</div>
</body></html>`;

  return { subject, text, html };
}
