import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter_Tight, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { contact, identity, seo, socials } from "@/lib/content";

/* ── Fonts ────────────────────────────────────────────────────────────────
 * Self-hosted at build time by next/font — no render-blocking request to
 * Google, no layout shift. Each exposes a CSS variable consumed in
 * globals.css (--font-display / --font-sans / --font-mono).
 *
 * TO CHANGE THE TYPEFACE: swap the import and the loader call. Keep the
 * `variable` names the same and the rest of the site follows automatically.
 * ------------------------------------------------------------------------ */

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz"],
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

/* ── SEO metadata ─────────────────────────────────────────────────────────
 * Driven entirely by `seo` in lib/content.ts.
 * ------------------------------------------------------------------------ */

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: {
    default: seo.title,
    template: `%s — ${identity.name}`,
  },
  description: seo.description,
  keywords: [...seo.keywords],
  authors: [{ name: identity.name, url: seo.siteUrl }],
  creator: identity.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    siteName: identity.name,
    title: seo.title,
    description: seo.description,
    url: seo.siteUrl,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08090b" },
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
  ],
  width: "device-width",
  initialScale: 1,
};

/* Structured data so search engines resolve the site to a real person and
   surface the social profiles as sameAs links. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  jobTitle: identity.role,
  email: `mailto:${contact.email}`,
  url: seo.siteUrl,
  description: seo.description,
  address: { "@type": "PostalPlace", addressLocality: "Jammu", addressCountry: "IN" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Central University of Jammu",
  },
  knowsAbout: [
    "Cybersecurity",
    "Intrusion Detection",
    "Network Security",
    "Python",
    "Socket Programming",
  ],
  sameAs: socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
};

/* Runs before first paint so the stored theme is applied without a flash of
   the wrong colour scheme. Kept tiny and dependency-free on purpose. */
const themeScript = `
(function(){
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${bricolage.variable} ${interTight.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        {/*
          NO-JAVASCRIPT FALLBACK.

          Scroll-reveal animations are server-rendered in their *hidden* state
          (Motion writes `opacity:0` inline), and the preloader panel covers the
          viewport until JS clears it. Both are correct while JS runs — and both
          would leave a blank page for anyone whose JS is disabled or fails to
          load. Search engines still read the markup either way, but people
          shouldn't get a blank screen, so force everything visible.
        */}
        <noscript>
          <style>{`
            [data-preloader] { display: none !important; }
            /* Two ways content starts hidden, and both must be undone:
               reveals use opacity, and the hero headline lines use only a
               translate inside a clipping mask (no opacity at all). Matching
               opacity alone would leave the biggest text on the page invisible. */
            [style*="opacity:0"], [style*="opacity: 0"],
            [style*="transform:translate"], [style*="transform: translate"] {
              opacity: 1 !important;
              transform: none !important;
            }
          `}</style>
        </noscript>
      </head>
      <body className="grain antialiased">
        {/* Skip link — first tab stop, hidden until focused. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:font-mono focus:text-xs focus:text-accent-ink"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
