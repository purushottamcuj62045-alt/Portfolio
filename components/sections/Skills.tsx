"use client";

import { motion, useReducedMotion } from "motion/react";

import { skillGroups, skillsDisclaimer, type Skill } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/* ---------------------------------------------------------------------------
 * Skills.tsx
 * ---------------------------------------------------------------------------
 * A proficiency LEDGER, not a logo wall.
 *
 * Icon grids of technology logos say nothing — every junior portfolio has one
 * and they all claim the same twenty tools. This instead states a level in
 * words, shows it as a bar, and links the row to the project that proves it.
 * The disclaimer underneath says outright that these are self-assessments.
 * Being visibly honest about the scale is more persuasive than a row of 90%
 * rings nobody believes.
 *
 * Bars fill on scroll-in, once, with a per-row stagger.
 * ------------------------------------------------------------------------- */

function SkillRow({ skill, index }: { skill: Skill; index: number }) {
  const reduced = useReducedMotion();

  const row = (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-fg transition-colors duration-300 group-hover:text-accent-text">
          {skill.name}
        </span>
        <span className="eyebrow shrink-0 whitespace-nowrap">
          {/* Abbreviated on narrow screens so the row never wraps. */}
          <span className="hidden sm:inline">{skill.level}</span>
          <span className="sm:hidden">{skill.level === "Comfortable" ? "Comf." : "Working"}</span>
        </span>
      </div>

      {/* Proficiency bar */}
      <div className="mt-2.5 h-px w-full bg-line">
        <motion.div
          className="h-px bg-accent"
          initial={reduced ? { width: `${skill.value}%` } : { width: 0 }}
          whileInView={{ width: `${skill.value}%` }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{
            duration: 1,
            delay: reduced ? 0 : 0.1 + index * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </>
  );

  // Rows that have a proof project become links to that case study.
  if (skill.proof) {
    return (
      <li>
        <a
          href={`#project-${skill.proof}`}
          className="group block py-3.5"
          aria-label={`${skill.name} — ${skill.level}. See the project that demonstrates it.`}
        >
          {row}
        </a>
      </li>
    );
  }

  return (
    <li className="group py-3.5">
      {row}
    </li>
  );
}

export function Skills() {
  return (
    <Section
      id="skills"
      index="02"
      label="Skills"
      title="What I actually reach for"
      lede="Grouped by what they're for, rated by how far I've taken them, and cross-linked to the code that backs the claim."
    >
      <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, groupIndex) => (
          <Reveal key={group.title} delay={groupIndex * 0.08}>
            <div>
              {/* Group header */}
              <div className="flex items-center gap-3 border-b border-line-strong pb-3">
                <h3 className="font-mono text-sm text-fg">{group.title}</h3>
                <span className="rounded bg-elevated px-1.5 py-0.5 font-mono text-[0.625rem] tracking-widest text-faint">
                  {group.tag}
                </span>
              </div>

              <ul className="divide-y divide-line">
                {group.skills.map((skill, i) => (
                  <SkillRow key={skill.name} skill={skill} index={i} />
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="mt-12 max-w-2xl border-l border-line pl-4 font-mono text-xs leading-relaxed text-faint">
          {skillsDisclaimer}
        </p>
      </Reveal>
    </Section>
  );
}
