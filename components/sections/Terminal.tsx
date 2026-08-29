"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { contact, identity, journey, projects, skillGroups } from "@/lib/content";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/* ---------------------------------------------------------------------------
 * Terminal.tsx
 * ---------------------------------------------------------------------------
 * A real, working shell. Type `help`.
 *
 * It's an easter egg, but a defensible one: for a security engineer, a
 * terminal is the native interface, and a recruiter who pokes at it gets the
 * same information as the rest of the page in the format the work lives in.
 *
 * Everything it prints is generated from lib/content.ts, so the commands can
 * never go stale — add a project and `projects` lists it automatically.
 *
 * Accessibility: output is a live region, the input is a real <form> with a
 * label, and the whole thing is skippable by keyboard. It never autofocuses
 * on page load (that would yank the viewport down to it).
 * ------------------------------------------------------------------------- */

type Line = { type: "input" | "output" | "error" | "accent"; text: string };

const PROMPT = "visitor@portfolio:~$";

const BANNER: Line[] = [
  { type: "accent", text: `${identity.name} — ${identity.shortRole}` },
  { type: "output", text: "Type 'help' for available commands." },
];

export function Terminal() {
  const [history, setHistory] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  /** Previously entered commands, for up/down arrow recall. */
  const [recall, setRecall] = useState<string[]>([]);
  const [recallIndex, setRecallIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Keep the newest output in view — but scroll the PANEL, never the page. */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  /* ── Command table ────────────────────────────────────────────────────
   * Each command returns the lines to print. Add an entry here and it shows
   * up in `help` automatically.
   * -------------------------------------------------------------------- */
  const commands: Record<string, { description: string; run: () => Line[] }> = {
    help: {
      description: "List available commands",
      run: () =>
        Object.entries(commands).map(([name, cmd]) => ({
          type: "output" as const,
          text: `  ${name.padEnd(10)} ${cmd.description}`,
        })),
    },
    whoami: {
      description: "Who is this",
      run: () => [
        { type: "accent", text: identity.name },
        { type: "output", text: identity.role },
        { type: "output", text: `Location: ${identity.location}` },
        { type: "output", text: `Status:   ${identity.availability}` },
      ],
    },
    skills: {
      description: "Print the skill ledger",
      run: () =>
        skillGroups.flatMap((group) => [
          { type: "accent" as const, text: `[${group.tag}] ${group.title}` },
          ...group.skills.map((skill) => ({
            type: "output" as const,
            text: `  ${skill.name.padEnd(34)} ${skill.level}`,
          })),
        ]),
    },
    projects: {
      description: "List shipped projects",
      run: () =>
        projects.map((project) => ({
          type: "output" as const,
          text: `  ${project.year}  ${project.title.padEnd(38)} ${project.stack.slice(0, 3).join(", ")}`,
        })),
    },
    certs: {
      description: "List certifications",
      run: () =>
        journey
          .filter((entry) => entry.kind !== "education")
          .map((entry) => ({
            type: "output" as const,
            text: `  ${entry.period.padEnd(12)} ${entry.title} — ${entry.org}`,
          })),
    },
    contact: {
      description: "Show contact details",
      run: () => [
        { type: "output", text: `  email     ${contact.email}` },
        { type: "output", text: `  phone     ${contact.phone}` },
        { type: "output", text: `  location  ${contact.location}` },
        { type: "output", text: `  resume    ${contact.resume}` },
      ],
    },
    sudo: {
      description: "Attempt privilege escalation",
      run: () => [
        { type: "error", text: "visitor is not in the sudoers file." },
        { type: "output", text: "This incident will be reported. (It won't. There's no backend.)" },
      ],
    },
    clear: {
      description: "Clear the screen",
      run: () => [],
    },
  };

  function submit(event: FormEvent) {
    event.preventDefault();
    const raw = value.trim();
    if (!raw) return;

    const name = raw.toLowerCase().split(" ")[0];
    setRecall((prev) => [raw, ...prev]);
    setRecallIndex(-1);
    setValue("");

    if (name === "clear") {
      setHistory([]);
      return;
    }

    const entry = commands[name];
    const output: Line[] = entry
      ? entry.run()
      : [
          {
            type: "error",
            text: `command not found: ${name}. Try 'help'.`,
          },
        ];

    setHistory((prev) => [...prev, { type: "input", text: raw }, ...output]);
  }

  /* Up/down arrows walk back through previous commands, like a real shell. */
  function handleKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    if (recall.length === 0) return;

    const next =
      event.key === "ArrowUp"
        ? Math.min(recallIndex + 1, recall.length - 1)
        : Math.max(recallIndex - 1, -1);

    setRecallIndex(next);
    setValue(next === -1 ? "" : recall[next]);
  }

  const lineColour: Record<Line["type"], string> = {
    input: "text-fg",
    output: "text-muted",
    error: "text-signal",
    accent: "text-accent-text",
  };

  return (
    <section aria-labelledby="terminal-heading" className="border-t border-line py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="mb-6 flex items-center gap-4">
            <span className="eyebrow">Interactive</span>
            <span aria-hidden className="h-px flex-1 bg-line" />
          </div>
          <h2 id="terminal-heading" className="sr-only">
            Interactive terminal
          </h2>

          {/* Panel */}
          <div
            className="overflow-hidden rounded-xl border border-line bg-sunken font-mono text-[0.8125rem] shadow-2xl shadow-black/20"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-signal/70" />
              <span className="size-2.5 rounded-full bg-accent/70" />
              <span className="size-2.5 rounded-full bg-azure/70" />
              <span className="ml-2 text-xs text-faint">
                {identity.shortName.toLowerCase()}@portfolio — bash
              </span>
            </div>

            {/* Scrollback */}
            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-label="Terminal output"
              className="h-72 space-y-1 overflow-y-auto px-4 py-4"
            >
              {history.map((line, i) => (
                <p key={i} className={`whitespace-pre-wrap break-words ${lineColour[line.type]}`}>
                  {line.type === "input" && <span className="text-accent-text">{PROMPT} </span>}
                  {line.text}
                </p>
              ))}

              {/* Prompt */}
              <form onSubmit={submit} className="flex items-center gap-2 pt-1">
                <label htmlFor="terminal-input" className="shrink-0 text-accent-text">
                  {PROMPT}
                </label>
                <input
                  id="terminal-input"
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-label="Type a command, then press Enter. Type help for options."
                  // Native caret, tinted to the accent. A hand-drawn block
                  // caret would sit at the end of the flex row rather than
                  // tracking the real text cursor.
                  className="min-w-0 flex-1 bg-transparent text-fg caret-accent outline-none"
                />
              </form>
            </div>
          </div>

          <p className="mt-4 font-mono text-xs text-faint">
            Try <span className="text-accent-text">whoami</span>,{" "}
            <span className="text-accent-text">projects</span> or{" "}
            <span className="text-accent-text">sudo</span>. Arrow keys recall history.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
