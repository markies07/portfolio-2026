"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PERSON } from "@/lib/content";
import { EASE_OUT } from "@/lib/motion";

const fieldShell =
  "group relative bg-[#141414] transition-colors duration-300 hover:bg-[#181818] focus-within:bg-[#1c1c1c]";
const labelClass =
  "absolute top-5 left-5 sm:left-6 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-paper/60 select-none pointer-events-none transition-colors duration-300 group-focus-within:text-paper";
const inputClass =
  "w-full bg-transparent pt-12 pb-5 px-5 sm:px-6 text-base sm:text-lg text-paper placeholder:text-paper/35 outline-none focus:outline-none focus-visible:outline-none focus:ring-0";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const subject = encodeURIComponent(`Project inquiry from ${name || "your site"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${PERSON.email}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  const fields = [
    {
      id: "cf-name",
      key: "name",
      label: "Your name",
      type: "text",
      autoComplete: "name",
      placeholder: "Jane Cooper",
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
      value: email,
      onChange: (e) => setEmail(e.target.value),
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="overflow-hidden rounded-2xl border border-paper/15 bg-paper/12 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
        {/* Name + Email side by side on wider screens; 1px gaps act as dividers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px">
          {fields.map(({ id, key, label, type, autoComplete, placeholder, value, onChange }) => (
            <div key={key} className={fieldShell}>
              <label htmlFor={id} className={labelClass}>
                {label}
              </label>
              <input
                id={id}
                name={key}
                type={type}
                autoComplete={autoComplete}
                required
                value={value}
                onChange={onChange}
                placeholder={placeholder}
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
            rows={7}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell me a little about your project…"
            className={`${inputClass} resize-none leading-relaxed`}
          />
        </div>

        {/* Footer row: char count + submit */}
        <div className="mt-px flex items-center justify-between gap-4 bg-[#101010] px-5 sm:px-6 py-4">
          <span className="font-mono text-xs text-paper/45 tabular-nums">{message.length} characters</span>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="relative flex items-center gap-2.5 overflow-hidden rounded-full bg-paper px-7 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-ink"
          >
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.span
                  key="sent"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                >
                  ✓ Opening email
                </motion.span>
              ) : (
                <motion.span
                  key="send"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  className="flex items-center gap-2"
                >
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
    </form>
  );
}
