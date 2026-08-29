import { about } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/* ---------------------------------------------------------------------------
 * About.tsx
 * ---------------------------------------------------------------------------
 * A pull quote carries the personality, then a two-column split: prose on the
 * left, a compact spec list on the right. The spec list is the detail that
 * makes this read as a considered document rather than a bio blob — it gives
 * a skimming recruiter four facts in two seconds.
 *
 * Server component: nothing here is interactive, so none of it ships JS.
 * ------------------------------------------------------------------------- */

export function About() {
  return (
    <Section
      id="about"
      index="01"
      label="About"
      title={
        <>
          I build the thing to <span className="text-accent-text">understand</span> the
          thing.
        </>
      }
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* — Prose — */}
        <div className="lg:col-span-7">
          <Reveal>
            <blockquote className="display border-l-2 border-accent pl-6 text-[clamp(1.25rem,2.4vw,1.75rem)] leading-snug text-fg">
              {about.pullQuote}
            </blockquote>
          </Reveal>

          <div className="mt-10 space-y-6">
            {about.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={0.08 + i * 0.06}>
                <p className="text-pretty text-base leading-[1.75] text-muted sm:text-[1.0625rem]">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* — Spec list — */}
        <div className="lg:col-span-5 lg:pl-8">
          <Reveal delay={0.15}>
            <dl className="divide-y divide-line border-y border-line">
              {about.facts.map((fact) => (
                <div
                  key={fact.key}
                  className="flex items-baseline justify-between gap-6 py-4"
                >
                  <dt className="eyebrow shrink-0">{fact.key}</dt>
                  <dd className="text-right font-mono text-sm text-fg">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
