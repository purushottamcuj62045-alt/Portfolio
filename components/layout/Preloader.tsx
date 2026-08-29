"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { identity } from "@/lib/content";
import {
  INTRO_HOLD_MS,
  INTRO_WIPE_S,
  SCRAMBLE_LOCK_EVERY,
  SCRAMBLE_TICK_MS,
} from "@/lib/motion";

/* ---------------------------------------------------------------------------
 * Preloader.tsx
 * ---------------------------------------------------------------------------
 * The page entrance: the name resolves out of scrambled characters, as if
 * being decrypted, then the panel wipes upward to reveal the hero.
 *
 * Chosen over a percentage bar because a fake progress meter is a lie — the
 * page is already loaded by the time this runs. A decrypt is honest set
 * dressing, it's thematically right for a security portfolio, and it's over
 * in ~1.5s.
 *
 * Guards:
 *   · prefers-reduced-motion  → never renders at all
 *   · unmounts completely after the exit, so it costs nothing afterward
 *
 * All timing lives in lib/motion.ts, shared with the hero so the two stay in
 * sync — see the notes there for how to shorten or remove the intro.
 * ------------------------------------------------------------------------- */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@*<>/\\";

export function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    // Reduced motion: skip the whole sequence.
    if (reduced) {
      setDone(true);
      return;
    }

    const target = identity.name.toUpperCase();
    const startedAt = performance.now();
    /** ms of scramble before every character has locked in. */
    const scrambleMs = target.length * SCRAMBLE_LOCK_EVERY * SCRAMBLE_TICK_MS;

    let holdTimer: number;

    const interval = window.setInterval(() => {
      // Progress is measured against the WALL CLOCK, not a tick counter.
      // Background tabs clamp setInterval to roughly 1Hz, so counting ticks
      // would stretch a 1.5s intro into a 30s one for anyone who opens the
      // site in a background tab and comes back to it later.
      const elapsed = performance.now() - startedAt;
      const locked = Math.floor(elapsed / (SCRAMBLE_TICK_MS * SCRAMBLE_LOCK_EVERY));

      setText(
        target
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < locked) return char; // resolved
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );

      if (locked >= target.length) {
        window.clearInterval(interval);
        holdTimer = window.setTimeout(() => setDone(true), INTRO_HOLD_MS);
      }
    }, SCRAMBLE_TICK_MS);

    // Failsafe: whatever happens to the interval — heavy throttling, a stalled
    // main thread — the panel is guaranteed to clear. Nobody ever gets stuck
    // looking at a blank screen.
    const failsafe = window.setTimeout(
      () => setDone(true),
      scrambleMs + INTRO_HOLD_MS + 1000,
    );

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(holdTimer);
      window.clearTimeout(failsafe);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          // The whole panel slides up and out, revealing the hero beneath it.
          exit={{ y: "-100%" }}
          transition={{ duration: INTRO_WIPE_S, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[80] grid place-items-center bg-bg"
          aria-hidden="true"
          // Stable hook for the <noscript> fallback in app/layout.tsx, which
          // has to hide this panel for visitors whose JS never runs.
          data-preloader=""
        >
          <div className="px-6 text-center">
            <p className="font-mono text-[clamp(1rem,4.5vw,2rem)] tracking-[0.2em] text-fg">
              {text || " "}
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="eyebrow mt-4"
            >
              {identity.shortRole}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
