"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { useEffect, useState } from "react";

import { identity, navigation } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "./ThemeToggle";

/* ---------------------------------------------------------------------------
 * Nav.tsx
 * ---------------------------------------------------------------------------
 * Three jobs:
 *   1. Track which section is on screen and highlight it. The highlight is a
 *      single pill that SLIDES between items via Motion's shared `layoutId`,
 *      instead of each item fading its own background in and out.
 *   2. Go from transparent over the hero to a blurred bar once you scroll.
 *   3. Collapse to a full-screen overlay menu on mobile.
 *
 * Active-section detection uses IntersectionObserver rather than a scroll
 * listener — the browser does the work off the main thread, so it costs
 * effectively nothing while scrolling.
 *
 * Smooth scrolling itself is native (`scroll-behavior: smooth` in
 * globals.css). No scroll hijacking, so the browser's own scrollbar, keyboard
 * paging and Find-in-page all keep working.
 * ------------------------------------------------------------------------- */

export function Nav() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Reading-progress bar across the very top of the viewport.
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  // Swap the nav to its blurred state once we leave the hero. Subscribing to
  // the motion value keeps this off React's render path until it flips.
  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 40);
  });

  /* — Active section tracking — */
  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that is visible.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        // Only count a section as active once it occupies the middle band of
        // the screen — prevents the highlight flickering at section seams.
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* — Lock body scroll while the mobile menu is open — */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* — Escape closes the mobile menu — */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      {/* Reading progress */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-accent"
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-line bg-bg/70 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-[76rem] items-center justify-between gap-4 px-6 sm:px-8 lg:px-12"
        >
          {/* — Monogram / home — */}
          <a
            href="#top"
            className="group flex items-center gap-2.5"
            aria-label={`${identity.name} — back to top`}
          >
            <span className="grid size-8 place-items-center rounded-md bg-accent font-mono text-xs font-semibold text-accent-ink transition-transform duration-300 group-hover:rotate-[-6deg]">
              {identity.initials}
            </span>
            <span className="hidden font-mono text-sm text-fg sm:inline">
              {identity.shortName}
            </span>
          </a>

          {/* — Desktop nav — */}
          <ul className="hidden items-center gap-1 rounded-full border border-line bg-elevated/40 p-1 backdrop-blur-sm md:flex">
            {navigation.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="relative">
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative z-10 block rounded-full px-4 py-1.5 font-mono text-xs transition-colors duration-300 ${
                      isActive ? "text-accent-ink" : "text-muted hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </a>
                  {/* The single shared pill that slides between items. */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* — Right cluster — */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden rounded-full border border-line-strong px-4 py-2 font-mono text-xs text-fg transition-colors duration-300 hover:border-accent hover:text-accent-text sm:inline-block"
            >
              Get in touch
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid size-9 place-items-center rounded-full border border-line text-fg md:hidden"
            >
              {/* Two bars that morph into an X. */}
              <span className="relative block h-3 w-4">
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 top-0 h-px bg-current"
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 bottom-0 h-px bg-current"
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* — Mobile overlay menu — */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-2xl md:hidden"
          >
            <ul className="flex h-full flex-col justify-center gap-2 px-8">
              {navigation.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.08 + i * 0.05,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline gap-4 border-b border-line py-4"
                  >
                    <span className="eyebrow text-accent-text">{item.index}</span>
                    <span className="display text-4xl">{item.label}</span>
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-sm text-muted"
                >
                  Download résumé <Icon name="external" className="size-3.5" />
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
