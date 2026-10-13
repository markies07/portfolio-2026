"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PERSON } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1];

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
      label: "Full name",
      type: "text",
      placeholder: "Jane Cooper",
      value: name,
      onChange: (e) => setName(e.target.value),
    },
    {
      id: "cf-email",
      key: "email",
      label: "Email address",
      type: "email",
      placeholder: "jane@company.com",
      value: email,
      onChange: (e) => setEmail(e.target.value),
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg"
    >
      <div className="flex flex-col gap-0">
        {/* Name + Email side by side on wider screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-paper/10 rounded-t-2xl overflow-hidden border border-paper/10">
          {fields.map(({ id, key, label, type, placeholder, value, onChange }) => (
            <div
              key={key}
              className="relative bg-paper/[0.03] hover:bg-paper/[0.05] transition-colors duration-200"
            >
              <label
                htmlFor={id}
                className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40 select-none pointer-events-none z-20"
              >
                {label}
              </label>
              <input
                id={id}
                type={type}
                required
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{ outline: "none", boxShadow: "none" }}
                className="w-full bg-transparent pt-9 pb-4 px-4 text-sm text-paper placeholder:text-paper/20 outline-none focus:outline-none focus-visible:outline-none focus:ring-0"
              />
            </div>
          ))}
        </div>

        {/* Message */}
        <div className="relative border-x border-paper/10 bg-paper/[0.03] hover:bg-paper/[0.05] transition-colors duration-200">
          <label
            htmlFor="cf-message"
            className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40 select-none pointer-events-none z-20"
          >
            Message
          </label>
          <textarea
            id="cf-message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell me about your project…"
            style={{ outline: "none", boxShadow: "none" }}
            className="w-full bg-transparent pt-9 pb-4 px-4 text-sm text-paper placeholder:text-paper/20 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 resize-none"
          />
        </div>

        {/* Footer row: char count + submit */}
        <div className="flex items-center justify-between gap-4 border border-t-0 border-paper/10 rounded-b-2xl bg-paper/[0.02] px-4 py-3">
          <span className="font-mono text-[11px] text-paper/25 tabular-nums">
            {message.length} chars
          </span>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="relative flex items-center gap-2.5 overflow-hidden rounded-full bg-paper px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink"
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.span
                  key="sent"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  ✓ Sent
                </motion.span>
              ) : (
                <motion.span
                  key="send"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: EASE }}
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
