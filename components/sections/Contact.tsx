"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";

import { contact, identity, socials } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/* ---------------------------------------------------------------------------
 * Contact.tsx
 * ---------------------------------------------------------------------------
 * TWO MODES, chosen automatically:
 *
 *   NEXT_PUBLIC_WEB3FORMS_KEY set    → real AJAX submission, message lands in
 *                                      the inbox, visitor never leaves the page
 *   key absent                       → the form opens the visitor's mail client
 *                                      with everything pre-filled, and the UI
 *                                      says so up front rather than pretending
 *                                      to have sent something
 *
 * Getting a key takes about a minute at https://web3forms.com — it's free and
 * needs no account or server. See the README.
 *
 * The honeypot field is a standard spam trap: it's invisible to humans and
 * off the tab order, so anything that fills it is a bot and gets dropped.
 * ------------------------------------------------------------------------- */

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = "idle" | "sending" | "sent" | "error";

/* Shared field styling, so inputs and the textarea can never drift apart. */
const fieldClass =
  "w-full rounded-lg border border-line bg-elevated/40 px-4 py-3 text-sm text-fg placeholder:text-faint transition-colors duration-300 focus:border-accent focus:outline-none";

function Field({
  id,
  label,
  type = "text",
  required = false,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-2 block">
        {label} {required && <span className="text-accent-text">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className={fieldClass}
      />
    </div>
  );
}

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot — real people never see this field, so a value means a bot.
    if (data.get("company")) return;

    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const subject = String(data.get("subject") ?? "");
    const message = String(data.get("message") ?? "");

    /* — Fallback mode: hand off to the visitor's mail client — */
    if (!WEB3FORMS_KEY) {
      const body = `${message}\n\n—\nFrom: ${name} <${email}>`;
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
      return;
    }

    /* — Real submission — */
    setStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name,
          email,
          subject: subject || `Portfolio enquiry from ${name}`,
          message,
          from_name: "Portfolio contact form",
        }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the address is visible next to the button anyway.
    }
  }

  return (
    <Section
      id="contact"
      index="05"
      label="Contact"
      title={
        <>
          Let&rsquo;s talk <span className="text-accent-text">security</span>
        </>
      }
      lede="Open to internships, SOC analyst roles and security engineering work — remote or in Jammu. The fastest way to reach me is email."
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* ── Details column ─────────────────────────────────────────── */}
        <div className="lg:col-span-5">
          <Reveal>
            {/* Availability */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-line bg-elevated/50 py-1.5 pl-2.5 pr-4">
              <span className="relative flex size-1.5">
                <span className="animate-ping-soft absolute inline-flex size-full rounded-full bg-accent" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-[0.6875rem] tracking-wide text-muted">
                {contact.availability}
              </span>
            </div>

            {/* Email, with a copy affordance */}
            <div className="mt-8">
              <p className="eyebrow">Email</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${contact.email}`}
                  className="break-all font-display text-lg font-medium tracking-tight text-fg underline-offset-4 transition-colors duration-300 hover:text-accent-text hover:underline"
                >
                  {contact.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label={copied ? "Email copied" : "Copy email address"}
                  className="grid size-8 shrink-0 place-items-center rounded-md border border-line text-muted transition-colors duration-300 hover:border-line-strong hover:text-fg"
                >
                  <Icon name={copied ? "check" : "copy"} className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Phone + location */}
            <dl className="mt-8 divide-y divide-line border-y border-line">
              <div className="flex items-baseline justify-between gap-6 py-4">
                <dt className="eyebrow">Phone</dt>
                <dd>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="font-mono text-sm text-fg transition-colors duration-300 hover:text-accent-text"
                  >
                    {contact.phone}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-4">
                <dt className="eyebrow">Location</dt>
                <dd className="font-mono text-sm text-fg">{contact.location}</dd>
              </div>
            </dl>

            {/* Social links */}
            <ul className="mt-8 space-y-1">
              {socials.map((social) => {
                const opensNewTab = social.href.startsWith("http") || social.icon === "document";
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target={opensNewTab ? "_blank" : undefined}
                      rel={opensNewTab ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-3 rounded-lg py-2.5 transition-colors duration-300"
                    >
                      <Icon
                        name={social.icon}
                        className="size-4 shrink-0 text-faint transition-colors duration-300 group-hover:text-accent-text"
                      />
                      <span className="font-mono text-sm text-fg">{social.label}</span>
                      <span className="hidden truncate font-mono text-xs text-faint sm:inline">
                        {social.handle}
                      </span>
                      <Icon
                        name="arrow"
                        className="ml-auto size-3.5 shrink-0 text-faint opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

        {/* ── Form column ────────────────────────────────────────────── */}
        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-line bg-elevated/30 p-6 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Name" required placeholder="Jane Doe" />
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  required
                  placeholder="jane@company.com"
                />
              </div>

              <div className="mt-5">
                <Field id="subject" label="Subject" placeholder="Internship opportunity" />
              </div>

              <div className="mt-5">
                <label htmlFor="message" className="eyebrow mb-2 block">
                  Message <span className="text-accent-text">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me what you're working on…"
                  className={`${fieldClass} resize-y`}
                />
              </div>

              {/* Honeypot — hidden from people, irresistible to bots. */}
              <div aria-hidden className="absolute left-[-9999px]">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3 font-mono text-[0.8125rem] font-medium text-accent-ink transition-colors duration-300 hover:bg-fg hover:text-bg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "sending"
                    ? "Sending…"
                    : WEB3FORMS_KEY
                      ? "Send message"
                      : "Compose email"}
                  <Icon
                    name="arrow"
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>

                {/* Status messages, announced to screen readers. */}
                <div aria-live="polite" className="font-mono text-xs">
                  <AnimatePresence mode="wait">
                    {status === "sent" && (
                      <motion.span
                        key="sent"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 text-accent-text"
                      >
                        <Icon name="check" className="size-3.5" />
                        Message sent — I&rsquo;ll reply soon.
                      </motion.span>
                    )}
                    {status === "error" && (
                      <motion.span
                        key="error"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-signal"
                      >
                        Something went wrong. Email me directly instead.
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Say plainly what the button will do when no backend is set. */}
              {!WEB3FORMS_KEY && (
                <p className="mt-5 border-t border-line pt-5 font-mono text-xs leading-relaxed text-faint">
                  No form backend is configured yet, so this opens your mail client with the
                  message pre-filled. See the README to wire it up in about a minute.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>

      <span className="sr-only">
        Contact {identity.name} at {contact.email}
      </span>
    </Section>
  );
}
