import { CursorGlow } from "@/components/layout/CursorGlow";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Preloader } from "@/components/layout/Preloader";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Projects } from "@/components/sections/Projects";
import { Recommendations } from "@/components/sections/Recommendations";
import { Skills } from "@/components/sections/Skills";
import { Terminal } from "@/components/sections/Terminal";

/* ---------------------------------------------------------------------------
 * page.tsx
 * ---------------------------------------------------------------------------
 * The whole site is one page. Section order is the narrative order:
 *
 *   Hero      → who and what
 *   About     → why they should care
 *   Skills    → what I can do, with proof links
 *   Projects  → the proof itself
 *   Journey   → how I got here
 *   Terminal  → personality (and a reason to stay a few seconds longer)
 *   Recs      → third-party validation
 *   Contact   → the ask
 *
 * TO REORDER: move a component here, then reorder `navigation` in
 * lib/content.ts to match.
 * TO REMOVE A SECTION: delete its line here and its entry in `navigation`.
 * ------------------------------------------------------------------------- */

export default function Home() {
  return (
    <>
      <Preloader />
      <CursorGlow />
      <Nav />

      <main id="main" className="relative">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Terminal />
        <Recommendations />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
