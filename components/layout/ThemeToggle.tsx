"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { Icon } from "@/components/ui/Icon";

/* ---------------------------------------------------------------------------
 * ThemeToggle.tsx
 * ---------------------------------------------------------------------------
 * Flips `data-theme` on <html> and remembers the choice in localStorage.
 * The initial value is applied by the blocking script in app/layout.tsx, so
 * there is never a flash of the wrong theme — this component only reads the
 * attribute that script already set.
 *
 * The icon cross-fades and rotates between states rather than hard-swapping.
 * ------------------------------------------------------------------------- */

type Theme = "dark" | "light";

export function ThemeToggle() {
  // `null` until mounted so server and client markup agree during hydration.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode / storage disabled — the toggle still works this session.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className="relative grid size-9 place-items-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-line-strong hover:text-fg"
    >
      {/* Nothing is rendered until `theme` resolves after mount, which keeps
          hydration clean. Note the guard is OUTSIDE the motion element: an
          always-present element keyed "pending" would have to run its exit
          animation before the real icon could enter, leaving the button
          visibly empty for a moment on every page load. */}
      <AnimatePresence mode="wait" initial={false}>
        {theme && (
          <motion.span
            key={theme}
            initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute grid place-items-center"
          >
            <Icon name={theme === "light" ? "moon" : "sun"} className="size-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
