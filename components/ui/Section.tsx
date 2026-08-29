import type { ReactNode } from "react";

import { Reveal } from "./Reveal";

/* ---------------------------------------------------------------------------
 * Section.tsx
 * ---------------------------------------------------------------------------
 * The consistent shell every content section sits inside. Owning the vertical
 * rhythm, max-width and heading treatment in one place is what keeps the page
 * feeling like a single designed object rather than eight stacked components.
 *
 * The numbered monospace eyebrow ("03 / WORK") is the site's main structural
 * signature — it gives the page an editorial spine and makes the nav's active
 * state legible at a glance.
 * ------------------------------------------------------------------------- */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[76rem] px-6 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  id,
  index,
  label,
  title,
  lede,
  children,
  /** Removes the top hairline — used for the first section after the hero. */
  seamless = false,
}: {
  id: string;
  index: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  seamless?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`scroll-mt-24 py-24 sm:py-32 lg:py-40 ${seamless ? "" : "border-t border-line"}`}
    >
      <Container>
        {/* — Section header — */}
        <header className="mb-14 sm:mb-20">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="eyebrow tabular-nums text-accent-text">{index}</span>
              <span className="eyebrow">{label}</span>
              {/* Hairline that runs to the edge — the editorial spine. */}
              <span aria-hidden className="h-px flex-1 bg-line" />
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              id={`${id}-heading`}
              className="display mt-6 max-w-3xl text-balance text-[clamp(2rem,5.5vw,3.5rem)]"
            >
              {title}
            </h2>
          </Reveal>

          {lede && (
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
                {lede}
              </p>
            </Reveal>
          )}
        </header>

        {children}
      </Container>
    </section>
  );
}
