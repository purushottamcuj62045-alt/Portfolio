import { projects, type Project, type ProjectCategory } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/* ---------------------------------------------------------------------------
 * Projects.tsx
 * ---------------------------------------------------------------------------
 * Two tiers, on purpose.
 *
 * The two strongest projects get a full-width case-study row — generated
 * visual on one side, a real write-up and hard metrics on the other, sides
 * alternating so the eye zig-zags down the page. The remaining four sit in a
 * compact grid below. A flat 3x2 grid of identical cards would give a
 * throwaway port scanner the same visual weight as a machine-learning IDS,
 * which is exactly the hierarchy problem most portfolios have.
 *
 * Every card carries `id="project-<slug>"` so the Skills section can link
 * straight to the project that proves a given skill.
 * ------------------------------------------------------------------------- */

/* Category colour is semantic here — blue for defensive work, coral for
   offensive. It encodes information rather than decorating. */
const categoryStyles: Record<ProjectCategory, string> = {
  "blue-team": "text-azure border-azure/30 bg-azure/10",
  "red-team": "text-signal border-signal/30 bg-signal/10",
  web: "text-accent-text border-accent/30 bg-accent/10",
  systems: "text-muted border-line-strong bg-elevated",
};

function CategoryBadge({ project }: { project: Project }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-widest ${categoryStyles[project.category]}`}
    >
      {project.categoryLabel}
    </span>
  );
}

function StackList({ stack }: { stack: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {stack.map((tech) => (
        <li
          key={tech}
          className="rounded border border-line px-2 py-1 font-mono text-[0.6875rem] text-muted transition-colors duration-300 group-hover:border-line-strong"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {project.links.demo && (
        <a
          href={project.links.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-text underline-offset-4 transition-all duration-300 hover:underline"
        >
          Live demo
          <Icon name="external" className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </a>
      )}
      {project.links.github && (
        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted underline-offset-4 transition-colors duration-300 hover:text-fg hover:underline"
        >
          <Icon name="github" className="size-3.5" />
          Source
        </a>
      )}
    </div>
  );
}

/* ── Featured: full-width case study ─────────────────────────────────────── */

function FeaturedProject({ project, flip }: { project: Project; flip: boolean }) {
  return (
    <Reveal as="article">
      <div
        id={`project-${project.slug}`}
        className="group scroll-mt-28 grid items-center gap-8 rounded-2xl border border-line bg-elevated/30 p-5 transition-colors duration-500 hover:border-line-strong sm:p-8 lg:grid-cols-2 lg:gap-14 lg:p-10"
      >
        {/* Visual — order flips on alternating rows (desktop only). */}
        <div className={flip ? "lg:order-2" : ""}>
          <ProjectVisual
            category={project.category}
            className="aspect-[16/9] w-full transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>

        {/* Write-up */}
        <div className={flip ? "lg:order-1" : ""}>
          <div className="flex flex-wrap items-center gap-3">
            <CategoryBadge project={project} />
            <span className="eyebrow tabular-nums">{project.year}</span>
          </div>

          <h3 className="display mt-5 text-[clamp(1.5rem,3vw,2.25rem)]">{project.title}</h3>

          <p className="mt-4 text-pretty text-[0.9375rem] leading-relaxed text-muted">
            {project.detail ?? project.summary}
          </p>

          {/* Hard facts, in the same spec-list voice as the About section. */}
          {/* Grid, not flex-wrap: at mobile widths the longer labels wrap and
              flex collapses them into one metric per row, which reads as a
              list instead of a stat line. */}
          {project.metrics && (
            <dl className="mt-7 grid grid-cols-3 gap-4 border-y border-line py-5">
              {project.metrics.map((metric) => (
                // Column + mt-auto so the values sit on a shared baseline even
                // when labels wrap to different numbers of lines.
                <div key={metric.label} className="flex h-full flex-col">
                  <dt className="eyebrow block leading-tight">{metric.label}</dt>
                  <dd className="display mt-auto pt-1.5 text-xl">{metric.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-7">
            <StackList stack={project.stack} />
          </div>

          <div className="mt-6">
            <ProjectLinks project={project} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Compact card ────────────────────────────────────────────────────────── */

function CompactProject({ project }: { project: Project }) {
  return (
    <StaggerItem as="article">
      <div
        id={`project-${project.slug}`}
        className="group flex h-full scroll-mt-28 flex-col rounded-xl border border-line bg-elevated/30 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-line-strong"
      >
        <div className="flex items-start justify-between gap-3">
          <CategoryBadge project={project} />
          <span className="eyebrow tabular-nums">{project.year}</span>
        </div>

        <h3 className="mt-5 font-display text-lg font-semibold leading-snug tracking-tight text-fg">
          {project.title}
        </h3>

        <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-muted">
          {project.summary}
        </p>

        <div className="mt-6">
          <StackList stack={project.stack} />
        </div>

        <div className="mt-5 border-t border-line pt-4">
          <ProjectLinks project={project} />
        </div>
      </div>
    </StaggerItem>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <Section
      id="work"
      index="03"
      label="Work"
      title="Things I've built and broken"
      lede="Six projects, all of them shipped and all of them public. Two are written up in full below; the rest link straight to source."
    >
      {/* Featured case studies */}
      <div className="space-y-6 lg:space-y-8">
        {featured.map((project, i) => (
          <FeaturedProject key={project.slug} project={project} flip={i % 2 === 1} />
        ))}
      </div>

      {/* Everything else */}
      {rest.length > 0 && (
        <>
          <Reveal>
            <div className="mb-8 mt-20 flex items-center gap-4">
              <span className="eyebrow">Also shipped</span>
              <span aria-hidden className="h-px flex-1 bg-line" />
            </div>
          </Reveal>

          <Stagger className="grid gap-5 sm:grid-cols-2">
            {rest.map((project) => (
              <CompactProject key={project.slug} project={project} />
            ))}
          </Stagger>
        </>
      )}

      {/* Repo link-out */}
      <Reveal delay={0.1}>
        <div className="mt-14 flex justify-center">
          <a
            href="https://github.com/purushottamcuj62045-alt"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full border border-line px-5 py-3 font-mono text-xs text-muted transition-colors duration-300 hover:border-accent hover:text-accent-text"
          >
            <Icon name="github" className="size-4" />
            Everything else lives on GitHub
            <Icon
              name="arrow"
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
