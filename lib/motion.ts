/* ---------------------------------------------------------------------------
 * motion.ts — shared animation timing
 * ---------------------------------------------------------------------------
 * The hero has to start animating exactly as the preloader panel clears. That
 * makes the two components coupled in time, so their timings live here rather
 * than as magic numbers in two files that would silently drift apart the first
 * time someone tweaks one of them.
 *
 * TO SPEED UP OR SLOW DOWN THE PAGE ENTRANCE: change the values below.
 * TO REMOVE THE PRELOADER ENTIRELY: delete <Preloader /> from app/page.tsx and
 * set INTRO_EXIT_AT to 0 — the hero then animates immediately on load.
 * ------------------------------------------------------------------------- */

/** Milliseconds between scramble re-rolls in the preloader. */
export const SCRAMBLE_TICK_MS = 45;

/** Ticks required to lock in each character of the name. */
export const SCRAMBLE_LOCK_EVERY = 2;

/** Pause on the fully-resolved name before the panel wipes away, in ms. */
export const INTRO_HOLD_MS = 380;

/** Duration of the preloader's upward wipe, in seconds. */
export const INTRO_WIPE_S = 0.9;

/**
 * When the hero should begin its entrance, in seconds from page load.
 *
 * Derived from the preloader's own timing so the two stay in sync: the
 * scramble takes (name length x LOCK_EVERY x TICK_MS), then the hold, then the
 * hero starts as the wipe begins so the two motions overlap slightly rather
 * than running back to back.
 *
 * `nameLength` is passed in by the caller so this stays a pure function.
 */
export function introExitAt(nameLength: number): number {
  const scrambleMs = nameLength * SCRAMBLE_LOCK_EVERY * SCRAMBLE_TICK_MS;
  return (scrambleMs + INTRO_HOLD_MS) / 1000;
}

/** The site's standard easing curve. Mirrors --ease-out in globals.css. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
