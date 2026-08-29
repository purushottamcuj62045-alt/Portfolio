"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/* ---------------------------------------------------------------------------
 * CursorGlow.tsx
 * ---------------------------------------------------------------------------
 * A soft accent-coloured glow that trails the cursor with a little spring lag.
 * It does NOT replace the system cursor — hiding the real pointer is the
 * classic portfolio mistake that breaks affordances and accessibility. This
 * sits behind the content as ambient lighting.
 *
 * Cost control:
 *   · position is written to motion values, never React state, so moving the
 *     mouse never triggers a React render
 *   · a single transform on one composited layer — no layout, no paint
 *   · only mounts for devices with a real hovering pointer, so phones and
 *     tablets pay nothing
 *   · respects prefers-reduced-motion
 * ------------------------------------------------------------------------- */

export function CursorGlow() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  // Loose spring — the lag is what makes it feel like light rather than a dot.
  const glowX = useSpring(x, { stiffness: 90, damping: 26, mass: 0.6 });
  const glowY = useSpring(y, { stiffness: 90, damping: 26, mass: 0.6 });

  useEffect(() => {
    // Only for devices with a precise, hovering pointer (i.e. a mouse).
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!query.matches || reduced) return;

    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    // Outer element owns the cursor position; the inner one owns the centring
    // offset. Keeping them separate avoids x/translateX fighting for the same
    // transform channel.
    <motion.div
      aria-hidden="true"
      style={{ x: glowX, y: glowY }}
      className="pointer-events-none fixed left-0 top-0 z-0 hidden lg:block"
    >
      <div className="size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-[0.07] blur-[100px]" />
    </motion.div>
  );
}
