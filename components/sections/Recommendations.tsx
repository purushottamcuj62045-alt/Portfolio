import { recommendations } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

/* ---------------------------------------------------------------------------
 * Recommendations.tsx
 * ---------------------------------------------------------------------------
 * Self-switching section.
 *
 *   recommendations.quotes is EMPTY  → renders a short, honest call-out that
 *                                      points at the real LinkedIn profile
 *   recommendations.quotes has items → renders them as a proper quote grid
 *
 * Add a quote to lib/content.ts and this section changes shape on its own.
 * No component edits, and no placeholder lorem-ipsum testimonials sitting on
 * a live site waiting to be spotted.
 *
 * Deliberately not wrapped in <Section> — it has no numbered index and is
 * styled as a quieter interstitial between Journey and Contact.
 * ------------------------------------------------------------------------- */

export function Recommendations() {
  const { quotes, fallback } = recommendations;

  /* ── Populated state ─────────────────────────────────────────────────── */
  if (quotes.length > 0) {
    return (
      <section aria-labelledby="recs-heading" className="border-t border-line py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="eyebrow">Recommendations</span>
              <span aria-hidden className="h-px flex-1 bg-line" />
            </div>
            <h2 id="recs-heading" className="display mt-6 text-[clamp(1.75rem,4vw,2.75rem)]">
              What people say
            </h2>
          </Reveal>

          <Stagger className="mt-14 grid gap-5 md:grid-cols-2">
            {quotes.map((quote) => (
              <StaggerItem key={quote.name} as="article">
                <figure className="flex h-full flex-col rounded-xl border border-line bg-elevated/30 p-7 transition-colors duration-500 hover:border-line-strong">
                  <blockquote className="flex-1 text-pretty text-[0.9375rem] leading-relaxed text-fg">
                    {/* Hanging quote mark — a small typographic nicety. */}
                    <span aria-hidden className="mr-1 text-accent-text">&ldquo;</span>
                    {quote.quote}
                    <span aria-hidden className="text-accent-text">&rdquo;</span>
                  </blockquote>
                  <figcaption className="mt-6 border-t border-line pt-5">
                    <p className="font-display text-sm font-semibold text-fg">{quote.name}</p>
                    <p className="mt-1 font-mono text-xs text-faint">
                      {quote.role} · {quote.org}
                    </p>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
    );
  }

  /* ── Empty state ─────────────────────────────────────────────────────── */
  return (
    <section aria-labelledby="recs-heading" className="border-t border-line py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-line bg-elevated/30 p-8 sm:p-10 lg:flex-row lg:items-center lg:gap-14">
            <div className="max-w-2xl">
              <span className="eyebrow">Recommendations</span>
              <h2 id="recs-heading" className="display mt-4 text-[clamp(1.5rem,3.2vw,2.25rem)]">
                {fallback.heading}
              </h2>
              <p className="mt-4 text-pretty text-[0.9375rem] leading-relaxed text-muted">
                {fallback.body}
              </p>
            </div>

            <div className="shrink-0">
              <Button href={fallback.ctaHref} variant="ghost" icon="external" external>
                {fallback.ctaLabel}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
