"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, type MouseEvent, type ReactNode } from "react";

import { Icon, type IconName } from "./Icon";

/* ---------------------------------------------------------------------------
 * Button.tsx
 * ---------------------------------------------------------------------------
 * One button, three looks, plus the site's signature micro-interaction: a
 * *magnetic* hover where the button drifts a few pixels toward the cursor and
 * springs back on exit. It's a small thing, but it's the difference between a
 * page that feels responsive and one that feels like a printout.
 *
 * The pull is capped at ~18% of the cursor offset and clamped by the spring,
 * so it stays a suggestion rather than a gimmick. Disabled entirely under
 * prefers-reduced-motion and on touch (pointer events never fire there).
 *
 * VARIANTS
 *   primary  solid accent fill — use once per viewport, for the main action
 *   ghost    hairline outline  — secondary actions
 *   quiet    text only         — tertiary / inline
 * ------------------------------------------------------------------------- */

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "quiet";
  /** Trailing icon. `arrow` and `external` are the usual choices. */
  icon?: IconName;
  /** Opens in a new tab and adds the correct rel attributes. */
  external?: boolean;
  download?: boolean;
  className?: string;
  ariaLabel?: string;
};

const base =
  "group relative inline-flex items-center justify-center gap-2.5 rounded-full font-mono text-[0.8125rem] tracking-wide transition-colors duration-300 select-none";

const variants = {
  primary:
    "bg-accent text-accent-ink px-6 py-3 hover:bg-fg hover:text-bg font-medium",
  ghost:
    "border border-line-strong text-fg px-6 py-3 hover:border-accent hover:text-accent-text",
  quiet:
    "text-muted px-1 py-1 hover:text-fg",
} as const;

export function Button({
  children,
  href,
  onClick,
  variant = "ghost",
  icon,
  external = false,
  download = false,
  className = "",
  ariaLabel,
}: ButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Raw pointer offset, smoothed by a spring so motion decelerates naturally.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 260, damping: 22, mass: 0.4 };
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);

  function handleMove(event: MouseEvent) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Offset of the cursor from the button's centre, scaled down hard.
    rawX.set((event.clientX - (rect.left + rect.width / 2)) * 0.18);
    rawY.set((event.clientY - (rect.top + rect.height / 2)) * 0.18);
  }

  function handleLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  const classes = `${base} ${variants[variant]} ${className}`;

  const inner = (
    <>
      <span>{children}</span>
      {icon && (
        <Icon
          name={icon}
          className={
            // The arrow nudges forward on hover; external icons lift diagonally.
            icon === "arrow"
              ? "size-4 transition-transform duration-300 group-hover:translate-x-1"
              : "size-3.5 opacity-60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
          }
        />
      )}
    </>
  );

  const motionProps = {
    style: { x, y },
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    whileTap: reduced ? undefined : { scale: 0.97 },
  };

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        download={download || undefined}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
        {...motionProps}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes}
      {...motionProps}
    >
      {inner}
    </motion.button>
  );
}
