"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { LIMITS } from "@/lib/contact-email";

const fieldShell =
  "group relative bg-[#141414] transition-colors duration-300 hover:bg-[#181818] focus-within:bg-[#1c1c1c]";
const labelClass =
  "absolute top-5 left-5 sm:left-6 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-paper/60 select-none pointer-events-none transition-colors duration-300 group-focus-within:text-paper";
const inputClass =
  "w-full bg-transparent pt-12 pb-5 px-5 sm:px-6 text-base sm:text-lg text-paper placeholder:text-paper/35 outline-none focus:outline-none focus-visible:outline-none focus:ring-0";

const swap = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: EASE_OUT },
};

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  // When the form appeared — the server ignores submissions made faster
  // than a person could fill it in
  const startedAt = useRef(0);
  const honeypot = useRef(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          website: honeypot.current?.value ?? "",
          elapsed: Date.now() - startedAt.current,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        setStatus("idle");
        setError(result.error || "Your message couldn't be sent. Please try again.");
        setFieldErrors(result.fields || {});
        return;
      }
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
      startedAt.current = Date.now();
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("idle");
      setError("You seem to be offline. Please check your connection and try again.");
    }
  }

  const fields = [
    {
      id: "cf-name",
      key: "name",
      label: "Your name",
      type: "text",
      autoComplete: "name",
      placeholder: "Jane Cooper",
      maxLength: LIMITS.name,
      value: name,
      onChange: (e) => setName(e.target.value),
    },
    {
      id: "cf-email",
      key: "email",
      label: "Email address",
      type: "email",
      autoComplete: "email",
      placeholder: "jane@company.com",
      maxLength: LIMITS.email,
      value: email,
      onChange: (e) => setEmail(e.target.value),
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="overflow-hidden rounded-2xl border border-paper/15 bg-paper/12 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
        {/* Name + Email side by side on wider screens; 1px gaps act as dividers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px">
          {fields.map(({ id, key, label, ...input }) => (
            <div key={key} className={fieldShell}>
              <label htmlFor={id} className={labelClass}>
                {label}
              </label>
              <input
                id={id}
                name={key}
                required
                aria-invalid={fieldErrors[key] ? true : undefined}
                {...input}
                className={inputClass}
              />
            </div>
          ))}
        </div>

        {/* Message */}
        <div className={`${fieldShell} mt-px`}>
          <label htmlFor="cf-message" className={labelClass}>
            Message
          </label>
          <textarea
            id="cf-message"
            name="message"
            required
            minLength={LIMITS.messageMin}
            maxLength={LIMITS.message}
            rows={7}
            value={message}
            aria-invalid={fieldErrors.message ? true : undefined}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell me a little about your project…"
            className={`${inputClass} resize-none leading-relaxed`}
          />
        </div>

        {/* Bot trap: hidden from people and screen readers, bots fill it in */}
        <input
          ref={honeypot}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px opacity-0"
        />

        {/* Footer row: char count / status + submit */}
        <div className="mt-px flex items-center justify-between gap-4 bg-[#101010] px-5 sm:px-6 py-4">
          <span className="font-mono text-xs text-paper/45 tabular-nums" aria-live="polite">
            {status === "sent" ? (
              <span className="text-emerald-400">Thanks — I&apos;ll get back to you soon.</span>
            ) : (
              `${message.length} characters`
            )}
          </span>

          <motion.button
            type="submit"
            disabled={status === "sending"}
            whileHover={status === "sending" ? undefined : { scale: 1.03 }}
            whileTap={status === "sending" ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="relative flex shrink-0 items-center gap-2.5 overflow-hidden rounded-full bg-paper px-7 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-ink disabled:opacity-70"
          >
            <AnimatePresence mode="wait" initial={false}>
              {status === "sending" ? (
                <motion.span key="sending" {...swap}>
                  Sending…
                </motion.span>
              ) : status === "sent" ? (
                <motion.span key="sent" {...swap}>
                  ✓ Message sent
                </motion.span>
              ) : (
                <motion.span key="send" {...swap} className="flex items-center gap-2">
                  Send message
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M1 11L11 1M11 1H4M11 1v7" />
                  </svg>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="mt-4 text-sm text-accent"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
