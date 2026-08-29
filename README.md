# Purushottam Kumar — Portfolio

A personal portfolio site for a cybersecurity engineer. Built with Next.js 15
(App Router), Tailwind CSS v4 and Motion.

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start
```

---

## The one file you'll actually edit

**Everything you see on the site comes from [`lib/content.ts`](lib/content.ts).**
Names, links, project write-ups, certifications, skills, SEO text — all of it.
You should almost never need to open a component to change content.

The file is split into clearly-labelled blocks:

| Block            | Controls                                              |
| ---------------- | ----------------------------------------------------- |
| `identity`       | Name, role, hero headline, tagline, availability pill |
| `contact`        | Email, phone, location, résumé path                    |
| `socials`        | The link list in the contact section and footer        |
| `stats`          | The four numbers under the hero                        |
| `about`          | Pull quote, bio paragraphs, the spec list              |
| `skillGroups`    | The skill ledger, grouped and rated                    |
| `projects`       | Every project card                                     |
| `journey`        | Education + certifications timeline                    |
| `recommendations`| Testimonials (see below)                               |
| `navigation`     | Nav links and section numbering                        |
| `seo`            | Title, description, keywords                           |

---

## Common tasks

### Add a project

Copy any object in the `projects` array and edit it:

```ts
{
  slug: "my-new-tool",          // unique — used for anchor links
  title: "My New Tool",
  category: "blue-team",        // blue-team | red-team | web | systems
  categoryLabel: "Blue team",   // the text on the badge
  year: "2026",
  featured: false,              // true = big case-study row, false = compact card
  summary: "One line that sells it.",
  stack: ["Python", "Scapy"],
  links: {
    github: "https://github.com/...",
    demo: "https://...",        // omit this line if there's no live demo
  },
},
```

`featured: true` projects get the large two-column layout with a longer
`detail` write-up and a `metrics` row. **Keep it to two** — the whole point of
the two-tier layout is that the featured slots mean something. Featured entries
also take:

```ts
detail: "The full case-study paragraph.",
metrics: [
  { value: "2", label: "Detection engines" },
  // exactly 3 works best — they render in a 3-column grid
],
```

Project cards use generated SVG artwork rather than screenshots (most of these
projects are terminal programs, so a screenshot would be a picture of scrolling
text). The artwork is picked by `category`. To use a **real screenshot**
instead, drop the image in `public/` and swap `<ProjectVisual />` for
`next/image` in `components/sections/Projects.tsx`.

### Add a certification

Add to the `journey` array — it renders newest-first in the order you write it:

```ts
{
  period: "2026",
  title: "CompTIA Security+",
  org: "CompTIA",
  kind: "cert",                 // cert | education | progress
  credential: "/security-plus.pdf",   // optional; put the file in public/
  description: "What it covered.",
},
```

`kind` picks the timeline marker: `progress` pulses, `cert` is a filled dot,
`education` is a hollow ring.

### Add a testimonial

The recommendations section **switches layout on its own**. While
`recommendations.quotes` is empty it shows a short call-out pointing at
LinkedIn. Add a real quote and it becomes a proper quote grid — no component
changes needed:

```ts
export const recommendations = {
  quotes: [
    {
      quote: "…",
      name: "Dr. A. Sharma",
      role: "Professor",
      org: "Central University of Jammu",
    },
  ],
  // …
}
```

### Add or remove a section

1. Add/remove the component in [`app/page.tsx`](app/page.tsx)
2. Add/remove the matching entry in `navigation` in `lib/content.ts`

The `id` in `navigation` must match the section's `id`. That's what drives both
smooth scrolling and the nav's active-state highlight.

---

## Changing the colours

All colours are CSS variables at the top of
[`app/globals.css`](app/globals.css), defined twice — once for dark (the
default) and once under `[data-theme="light"]`.

**To re-skin the entire site, change the accents block:**

```css
--accent:      #d8ff47;   /* citron — primary accent, fills and highlights */
--accent-ink:  #0a0c04;   /* text placed ON an accent fill                 */
--accent-text: #d8ff47;   /* accent used AS text (needs per-theme contrast)*/
--signal:      #ff5c38;   /* coral — red-team / offensive only             */
--azure:       #6e9bff;   /* blue  — blue-team / defensive only            */
```

Two things worth knowing before you change them:

- **`--accent-text` is separate from `--accent` on purpose.** Citron is bright
  enough to use as text on black but unreadable on white, so the light theme
  darkens it to `#5d7a00`. If you pick a new accent, check it in both themes.
- **`--signal` and `--azure` carry meaning.** They tag red-team and blue-team
  work respectively. They're not decoration — keep them semantic or the
  category badges stop communicating anything.

Everything else is neutral (`--bg`, `--fg`, `--line`…) and will follow along.

### Changing the fonts

Three faces, all loaded and self-hosted by `next/font` in
[`app/layout.tsx`](app/layout.tsx):

- **Bricolage Grotesque** — display / headings
- **Inter Tight** — body
- **JetBrains Mono** — labels, tags, the terminal

Swap the import and the loader call. Keep the `variable` names
(`--font-bricolage` etc.) and everything else follows.

---

## Wiring up the contact form

Out of the box the form opens the visitor's mail client with the message
pre-filled, and the UI says so plainly. To receive real submissions instead:

1. Get a free access key at <https://web3forms.com> (no account, no server)
2. Copy `.env.example` to `.env.local`
3. Paste the key:

```bash
NEXT_PUBLIC_WEB3FORMS_KEY=your-key-here
```

The form switches to real AJAX submission automatically — the button text
changes from "Compose email" to "Send message" and the fallback notice
disappears. A honeypot field is already in place for spam.

---

## Structure

```
app/
  layout.tsx           fonts, SEO metadata, JSON-LD, theme script, no-JS fallback
  page.tsx             section order — the whole site is one page
  globals.css          design tokens, base styles, keyframes
  opengraph-image.tsx  generated link-preview card
  sitemap.ts robots.ts

components/
  layout/    Nav · Footer · Preloader · CursorGlow · ThemeToggle
  sections/  Hero · About · Skills · Projects · Journey · Terminal ·
             Recommendations · Contact
  ui/        Section · Reveal · Button · Icon · ProjectVisual

lib/
  content.ts   ← all site content
  motion.ts    shared intro timing (hero and preloader stay in sync)
```

---

## Notes on the animation

- **`Reveal` is the only scroll-animation primitive.** It animates `transform`
  and `opacity` only — both GPU-composited, so reveals never cause layout or
  paint — and uses `once: true` so nothing re-animates when you scroll back up.
  For lists, use `<Stagger>` + `<StaggerItem>` rather than hand-tuning delays.
- **`prefers-reduced-motion` is honoured throughout.** The preloader doesn't
  render at all, reveals resolve to plain visible content, the cursor glow
  never mounts, and `globals.css` has a global override as a backstop.
- **The cursor glow only mounts for real mice** (`hover: hover and
  pointer: fine`), so phones and tablets pay nothing for it.
- **Nothing hijacks scrolling.** Smooth scroll is native CSS, so the scrollbar,
  keyboard paging and find-in-page all still work.

### Changing the intro

Timing lives in [`lib/motion.ts`](lib/motion.ts) and is shared by the
preloader and the hero so the two can't drift apart. To remove the intro
entirely, delete `<Preloader />` from `app/page.tsx` — the hero's start delay
is derived from the preloader's duration, so shortening one adjusts the other
automatically.

---

## Deploying

Every route is static, so this deploys anywhere.

- **Vercel** — import the repo, done. Set `NEXT_PUBLIC_SITE_URL` (and the
  Web3Forms key if you're using it) in the project's environment variables.
- **Cloudflare Pages** — build `npm run build`, using the
  [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) adapter.
- **Static export** — add `output: "export"` to `next.config.ts` and delete
  `app/opengraph-image.tsx` (it needs a runtime), replacing it with a plain
  1200×630 `opengraph-image.png` in `app/`.

Set `NEXT_PUBLIC_SITE_URL` wherever you deploy — canonical URLs, the sitemap
and OG tags all read from it.

### Files carried over from the previous site

`public/` contains the résumé and the five certificate files, downloaded from
the existing Cloudflare Worker so every credential link keeps working:

```
resume.pdf  thm-soc-level-1.pdf  networking-basics.pdf
networking-devices-config.png  intro-to-modern-ai.pdf  endpoint-security.pdf
```
