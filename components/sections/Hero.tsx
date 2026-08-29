"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { contact, identity, stats } from "@/lib/content";
import { EASE_OUT, introExitAt } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

/* ---------------------------------------------------------------------------
 * Hero.tsx
 * ---------------------------------------------------------------------------
 * The landing view. Three ideas hold it together:
 *
 *  1. TYPE IS THE HERO. No stock gradient blob, no illustration — the headline
 *     at ~7vw carries the whole viewport. Each line rises out of a clipped
 *     mask, the way a title card resolves, rather than fading in place.
 *
 *  2. AMBIENT DEPTH, NOT DECORATION. A faded blueprint grid and one slowly
 *     drifting accent glow sit behind everything. Both are pure CSS and both
 *     are masked at the edges so nothing reads as a hard rectangle.
 *
 *  3. PARALLAX WITH RESTRAINT. On scroll the headline drifts up slightly
 *     faster than the page and fades — enough to feel like depth, not enough
 *     to notice as an effect.
 *
 * The decorative node graph on the right is a nod to network topology. It is
 * aria-hidden and hidden entirely below `lg`.
 * ------------------------------------------------------------------------- */

/** Splits a headline line so the accent word can be coloured. */
function AccentLine({ line, accent }: { line: string; accent: string }) {
  if (!line.includes(accent)) return <>{line}</>;
  const [before, after] = line.split(accent);
  return (
    <>
      {before}
      <span className="text-accent-text">{accent}</span>
      {after}
    </>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Progress from "hero at top of screen" to "hero fully scrolled past".
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Entrance timing. Everything is offset by the preloader's exit so the hero
  // doesn't start animating behind a panel nobody can see through. The offset
  // is derived from the preloader's own timing (lib/motion.ts) rather than
  // hard-coded, so changing one can't desynchronise the other.
  const START = reduced ? 0 : introExitAt(identity.name.length);
  const rise = (delay: number) => ({
    initial: reduced ? undefined : { opacity: 0, y: 24 },
    animate: reduced ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: START + delay, ease: EASE_OUT },
  });

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-14"
    >
      {/* ── Ambient background ─────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Blueprint grid, radially masked (see .blueprint in globals.css) */}
        <div className="blueprint absolute inset-0" />

        {/* One slow-drifting accent glow. The only "gradient" on the page. */}
        <div className="animate-drift absolute -right-[10%] top-[8%] size-[38rem] rounded-full bg-accent opacity-[0.08] blur-[130px]" />

        {/* Decorative network topology — desktop only. */}
        <svg
          viewBox="0 0 400 400"
          className="absolute -right-16 top-1/2 hidden size-[30rem] -translate-y-1/2 opacity-[0.16] lg:block"
          fill="none"
        >
          <g stroke="currentColor" strokeWidth="0.75" className="text-fg">
            <path d="M200 60 L320 130 M200 60 L80 130 M320 130 L320 270 M80 130 L80 270 M320 270 L200 340 M80 270 L200 340 M200 60 L200 340 M80 130 L320 270 M320 130 L80 270" />
          </g>
          {[
            [200, 60], [320, 130], [80, 130], [320, 270], [80, 270], [200, 340],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="4" className="fill-accent">
              {!reduced && (
                <animate
                  attributeName="opacity"
                  values="0.25;1;0.25"
                  dur="3.5s"
                  begin={`${i * 0.45}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          ))}
        </svg>
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <Container>
        <motion.div style={reduced ? undefined : { y: headlineY, opacity: fade }}>
          {/* Availability pill */}
          {identity.availability && (
            <motion.div {...rise(0)} className="mb-8">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-elevated/50 py-1.5 pl-2.5 pr-4 backdrop-blur-sm">
                <span className="relative flex size-1.5">
                  <span className="animate-ping-soft absolute inline-flex size-full rounded-full bg-accent" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
                </span>
                <span className="font-mono text-[0.6875rem] tracking-wide text-muted">
                  {identity.availability}
                </span>
              </span>
            </motion.div>
          )}

          {/* Headline — each line rises out of its own clipping mask. */}
          <h1 className="display max-w-5xl text-[clamp(2.6rem,7.2vw,6rem)]">
            {identity.headline.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.12em]">
                <motion.span
                  className="block"
                  initial={reduced ? undefined : { y: "110%" }}
                  animate={reduced ? undefined : { y: 0 }}
                  transition={{
                    duration: 1,
                    delay: START + 0.08 + i * 0.11,
                    ease: EASE_OUT,
                  }}
                >
                  <AccentLine line={line} accent={identity.headlineAccent} />
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Tagline */}
          <motion.p
            {...rise(0.45)}
            className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
          >
            {identity.tagline}
          </motion.p>

          {/* Calls to action */}
          <motion.div {...rise(0.55)} className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="#work" variant="primary" icon="arrow">
              View work
            </Button>
            <Button href="#contact" variant="ghost">
              Get in touch
            </Button>
            <Button href={contact.resume} variant="quiet" icon="external" external>
              Résumé
            </Button>
          </motion.div>
        </motion.div>
      </Container>

      {/* ── Stats strip ────────────────────────────────────────────────── */}
      <Container className="mt-16 sm:mt-24">
        <motion.dl
          {...rise(0.7)}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-bg px-5 py-5 sm:px-6 sm:py-6">
              <dt className="eyebrow">{stat.label}</dt>
              <dd className="display mt-2 text-3xl tabular-nums sm:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </Container>

      {/* ── Scroll cue ─────────────────────────────────────────────────── */}
      <motion.div
        aria-hidden
        initial={reduced ? undefined : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        transition={{ delay: START + 1.1, duration: 0.8 }}
        style={reduced ? undefined : { opacity: fade }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <span className="eyebrow flex flex-col items-center gap-2">
          Scroll
          <span className="block h-8 w-px overflow-hidden bg-line">
            <motion.span
              className="block h-3 w-px bg-accent"
              animate={reduced ? undefined : { y: [-12, 32] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </span>
      </motion.div>
    </section>
  );
}
