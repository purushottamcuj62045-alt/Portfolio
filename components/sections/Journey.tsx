"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";

import { journey, type JourneyEntry } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/* ---------------------------------------------------------------------------
 * Journey.tsx
 * ---------------------------------------------------------------------------
 * Education and certifications in one timeline, newest first.
 *
 * This replaces a conventional "Experience" section. Inventing job history to
 * fill a template would be worse than useless, so the section is honest about
 * what it is: a record of what's been learned and certified, running from
 * work in progress at the top down to the degree that started it.
 *
 * The rail behind the markers fills as you scroll through the section —
 * `useScroll` drives a scaleY transform on a single element, so the whole
 * effect costs one composited layer and zero React renders.
 *
 * Entries with a `credential` file in /public link to the certificate.
 * ------------------------------------------------------------------------- */

const markerStyles: Record<JourneyEntry["kind"], string> = {
  progress: "bg-accent",
  cert: "bg-fg",
  education: "bg-bg border-2 border-fg",
};

function TimelineEntry({ entry, index }: { entry: JourneyEntry; index: number }) {
  const isLink = Boolean(entry.credential);

  const content = (
    <>
      {/* Marker sits on the rail */}
      <span
        aria-hidden
        className="absolute left-0 top-2 flex size-3 -translate-x-1/2 items-center justify-center"
      >
        {entry.kind === "progress" && (
          <span className="animate-ping-soft absolute size-3 rounded-full bg-accent" />
        )}
        <span
          className={`relative size-3 rounded-full transition-transform duration-300 group-hover:scale-125 ${markerStyles[entry.kind]}`}
        />
      </span>

      {/* Period */}
      <span className="eyebrow tabular-nums whitespace-nowrap sm:w-32 sm:shrink-0">
        {entry.period}
      </span>

      {/* Body */}
      <div className="mt-2 sm:mt-0">
        <h3 className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-display text-base font-semibold tracking-tight text-fg transition-colors duration-300 group-hover:text-accent-text">
          {entry.title}
          {isLink && (
            <Icon
              name="external"
              className="size-3 shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-accent-text"
            />
          )}
        </h3>
        <p className="mt-1 font-mono text-xs text-faint">{entry.org}</p>
        <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted">
          {entry.description}
        </p>
      </div>
    </>
  );

  const layout =
    "group relative flex flex-col pl-8 sm:flex-row sm:gap-8 sm:pl-10";

  return (
    <Reveal as="li" delay={Math.min(index * 0.05, 0.3)} y={16}>
      {isLink ? (
        <a
          href={entry.credential}
          target="_blank"
          rel="noopener noreferrer"
          className={`${layout} py-7`}
          aria-label={`${entry.title} — ${entry.org}. Opens the certificate.`}
        >
          {content}
        </a>
      ) : (
        <div className={`${layout} py-7`}>{content}</div>
      )}
    </Reveal>
  );
}

export function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Fill the rail across the section's travel through the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const railScale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <Section
      id="journey"
      index="04"
      label="Journey"
      title="Certifications and education"
      lede="No employment history yet — I'm two years into a four-year degree. What I do have is a paper trail of what I've studied and proved, most recent first."
    >
      <div ref={ref} className="relative">
        {/* Rail track */}
        <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-line" />
        {/* Rail fill — scales from the top as you scroll. */}
        <motion.span
          aria-hidden
          style={{ scaleY: reduced ? 1 : railScale }}
          className="absolute inset-y-0 left-0 w-px origin-top bg-accent"
        />

        <ol className="divide-y divide-line">
          {journey.map((entry, i) => (
            <TimelineEntry key={`${entry.title}-${entry.period}`} entry={entry} index={i} />
          ))}
        </ol>
      </div>
    </Section>
  );
}
