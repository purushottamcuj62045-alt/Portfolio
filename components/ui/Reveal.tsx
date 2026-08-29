"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/* ---------------------------------------------------------------------------
 * Reveal.tsx
 * ---------------------------------------------------------------------------
 * The scroll-animation primitive used by every section.
 *
 * Design rules baked in here, so individual sections can't drift from them:
 *   · Only `transform` and `opacity` animate — both are GPU-composited, so
 *     reveals never trigger layout or paint and stay at 60fps.
 *   · `once: true` — content animates in a single time. Re-animating on every
 *     scroll-past is the #1 thing that makes a portfolio feel cheap.
 *   · The viewport margin fires the animation slightly BEFORE the element
 *     reaches the fold, so content is already settled when you look at it.
 *   · prefers-reduced-motion short-circuits to a plain, instantly-visible div.
 *
 * USAGE
 *   <Reveal>…</Reveal>                     simple fade + rise
 *   <Reveal delay={0.1}>…</Reveal>         manual stagger
 *   <Reveal as="li" y={12}>…</Reveal>      different element / distance
 *
 * For lists, wrap the container in <Stagger> and each child in <StaggerItem>
 * instead of hand-tuning delays.
 * ------------------------------------------------------------------------- */

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before animating. Use for deliberate sequencing. */
  delay?: number;
  /** Pixels to travel upward. Keep small — big travel reads as "flashy". */
  y?: number;
  /** Render as a different element for semantic correctness. */
  as?: "div" | "section" | "li" | "article" | "span" | "header" | "footer";
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1], // matches --ease-out in globals.css
      }}
    >
      {children}
    </MotionTag>
  );
}

/* ── Stagger container ────────────────────────────────────────────────────
 * Children animate in sequence without you computing delays by hand.
 * ------------------------------------------------------------------------ */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Stagger({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}
