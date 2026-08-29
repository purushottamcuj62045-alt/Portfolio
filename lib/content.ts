/* ---------------------------------------------------------------------------
 * content.ts — SINGLE SOURCE OF TRUTH
 * ---------------------------------------------------------------------------
 * Every word, link and date rendered on this site comes from this file.
 * To update the portfolio you should almost never need to touch a component:
 * edit the data below and the UI re-flows automatically.
 *
 * Navigation is driven by `navigation` at the bottom — remove an entry there
 * and the nav link disappears (also delete the matching <section> in page.tsx).
 * ------------------------------------------------------------------------- */

/* ── Identity ─────────────────────────────────────────────────────────────── */

export const identity = {
  name: "Purushottam Kumar",
  shortName: "Purushottam",
  initials: "PK",
  /** Shown under the name in the hero and used in the <title> tag. */
  role: "Cybersecurity & Full-Stack Engineer",
  /** Compact role used in the footer and structured data. */
  shortRole: "Cybersecurity Analyst",
  location: "Jammu, India",
  /** Availability pill in the hero. Set to null to hide the pill entirely. */
  availability: "Available for cybersecurity roles",
  /** Hero headline — each string renders as its own line. */
  headline: ["Defending digital assets.", "Building resilient", "security architectures."],
  /** The word inside `headline` that receives the accent colour. */
  headlineAccent: "resilient",
  tagline:
    "Cybersecurity engineer who ships. I hunt threats, fortify systems, and turn vulnerabilities into hardened defenses.",
} as const;

/* ── Contact & social ─────────────────────────────────────────────────────── */

export const contact = {
  email: "purushottamcuj62045@gmail.com",
  phone: "+91 7549308113",
  location: "Jammu, India",
  availability: "Available for remote work",
  resume: "/resume.pdf",
} as const;

export type SocialLink = {
  label: string;
  href: string;
  /** Handle shown next to the label on wide screens. */
  handle: string;
  /** Key into the icon map in components/ui/Icon.tsx */
  icon: "github" | "linkedin" | "mail" | "document";
};

export const socials: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/purushottamcuj62045-alt",
    handle: "purushottamcuj62045-alt",
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/purushottam-k-08a414383/",
    handle: "purushottam-k",
    icon: "linkedin",
  },
  {
    label: "Email",
    href: "mailto:purushottamcuj62045@gmail.com",
    handle: "purushottamcuj62045@gmail.com",
    icon: "mail",
  },
  {
    label: "Resume",
    href: "/resume.pdf",
    handle: "PDF",
    icon: "document",
  },
];

/* ── Hero stats ───────────────────────────────────────────────────────────── */
/* Keep to exactly 4 entries — the grid is designed as 2x2 / 1x4.            */

export const stats = [
  { value: "7+", label: "Repos shipped" },
  { value: "3", label: "Blue / red team tools" },
  { value: "5", label: "Certifications earned" },
  { value: "2029", label: "Expected graduation" },
] as const;

/* ── About ────────────────────────────────────────────────────────────────── */

export const about = {
  /** Short, quotable line rendered large above the paragraphs. */
  pullQuote: "I don't learn security from slides. I learn it from packet captures.",
  /** Rendered as separate paragraphs, in order. */
  paragraphs: [
    "I'm a Computer Science undergraduate at Central University of Jammu specialising in cybersecurity — and I learn by building the thing rather than reading about it.",
    "That means most of what I know came out of a terminal: writing an intrusion detection system that watches live traffic with Scapy and flags anomalies with an Isolation Forest, standing up socket servers from scratch to understand what actually happens on the wire, and auditing my own web apps against the OWASP Top 10.",
    "I work both sides of the line. Blue team is where I'm heading — detection engineering, log analysis, incident response — but building offensive tooling is what taught me what defenders are actually up against.",
  ],
  /** Small key/value facts rendered as a spec list beside the bio. */
  facts: [
    { key: "Focus", value: "Detection engineering, SOC" },
    { key: "Studying", value: "B.Tech CS (Cybersecurity)" },
    { key: "Based in", value: "Jammu, India" },
    { key: "Currently", value: "CompTIA Security+ prep" },
  ],
} as const;

/* ── Skills ───────────────────────────────────────────────────────────────── */
/*
 * `value` (0–100) drives the width of the proficiency bar only.
 * `level` is the honest text label — the disclaimer below states plainly that
 * these are self-assessed, not certification scores.
 *
 * `proof` links a skill to the project that demonstrates it. Use a project
 * `slug` from the `projects` array; the row then links to that case study.
 */

export type SkillLevel = "Comfortable" | "Working knowledge";

export type Skill = {
  name: string;
  level: SkillLevel;
  value: number;
  /** Slug of the project that proves this skill. */
  proof?: string;
};

export type SkillGroup = {
  title: string;
  /** Short monospace tag shown beside the group title. */
  tag: string;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Security",
    tag: "SEC",
    skills: [
      { name: "Scapy / packet analysis", level: "Comfortable", value: 78, proof: "ids" },
      { name: "Network security", level: "Working knowledge", value: 60, proof: "port-scanner" },
      { name: "SOC operations / log analysis", level: "Working knowledge", value: 62, proof: "ids" },
      { name: "OWASP Top 10 audit", level: "Working knowledge", value: 55, proof: "pluton" },
    ],
  },
  {
    title: "Languages",
    tag: "LANG",
    skills: [
      { name: "Python", level: "Comfortable", value: 82, proof: "ids" },
      { name: "TypeScript / JavaScript", level: "Comfortable", value: 70, proof: "pluton" },
      { name: "C", level: "Working knowledge", value: 55 },
      { name: "Bash", level: "Working knowledge", value: 58 },
    ],
  },
  {
    title: "Systems",
    tag: "SYS",
    skills: [
      { name: "Socket programming", level: "Comfortable", value: 80, proof: "chat-server" },
      { name: "Multithreading / concurrency", level: "Comfortable", value: 72, proof: "chat-server" },
      { name: "Linux", level: "Working knowledge", value: 62 },
      { name: "Scikit-learn (anomaly detection)", level: "Working knowledge", value: 55, proof: "ids" },
    ],
  },
];

export const skillsDisclaimer =
  "Self-assessed against real project usage, not a certification score. Rows marked with a proof link open the project that demonstrates the skill.";

/* ── Projects ─────────────────────────────────────────────────────────────── */
/*
 * TO ADD A PROJECT: copy any object below, change the fields, done.
 *   slug          unique; used for anchors and skill cross-links
 *   category      drives the card accent colour:
 *                 "blue-team" | "red-team" | "web" | "systems"
 *   featured      true  -> large two-column case-study card
 *                 false -> compact card in the grid below
 *   metrics       featured cards only; 2–3 short facts
 *   links.demo    omit when there is no live deployment
 */

export type ProjectCategory = "blue-team" | "red-team" | "web" | "systems";

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  /** One-line hook shown on every card. */
  summary: string;
  /** Longer case-study body — featured cards only. */
  detail?: string;
  metrics?: { value: string; label: string }[];
  stack: string[];
  featured: boolean;
  links: { github?: string; demo?: string };
  year: string;
};

export const projects: Project[] = [
  {
    slug: "ids",
    title: "Network Intrusion Detection System",
    category: "blue-team",
    categoryLabel: "Blue team",
    year: "2026",
    featured: true,
    summary:
      "Real-time IDS that watches live network traffic and flags attacks using both signature rules and unsupervised machine learning.",
    detail:
      "Sniffs packets off the wire with Scapy and runs them through two detection paths in parallel. Signature-based rules catch known patterns such as SYN floods and port scans, while an Isolation Forest model learns a baseline of normal traffic and surfaces anomalies nobody wrote a rule for. Detections are emitted as structured JSON alerts so they can be piped straight into a SIEM, and packet capture runs on its own thread to keep detection off the capture path.",
    metrics: [
      { value: "2", label: "Detection engines" },
      { value: "JSON", label: "SIEM-ready alerts" },
      { value: "Live", label: "Real-time capture" },
    ],
    stack: ["Python", "Scapy", "Scikit-learn", "Isolation Forest", "Threading"],
    links: { github: "https://github.com/purushottamcuj62045-alt/IDS-Intrusion-detection-system-" },
  },
  {
    slug: "pluton",
    title: "Pluton — AI Code Reviewer",
    category: "web",
    categoryLabel: "Web / AI",
    year: "2026",
    featured: true,
    summary:
      "AI code reviewer that auto-detects language and scores a submission on performance, security, readability and maintainability.",
    detail:
      "Paste in a file and Pluton identifies the language on its own, then returns a structured review across four axes — performance, security, readability and maintainability — each with a score and concrete feedback rather than a wall of prose. Built as a React and TypeScript front end and deployed to the edge on Cloudflare Workers, so reviews come back without a cold-start penalty.",
    metrics: [
      { value: "4", label: "Review dimensions" },
      { value: "Auto", label: "Language detection" },
      { value: "Edge", label: "Cloudflare Workers" },
    ],
    stack: ["TypeScript", "React", "HTML", "CSS", "Cloudflare Workers"],
    links: {
      github: "https://github.com/purushottamcuj62045-alt/Pluton",
      demo: "https://gemini-codelens.shristinayak18.workers.dev/",
    },
  },
  {
    slug: "chat-server",
    title: "Multi-Client Chat Server",
    category: "systems",
    categoryLabel: "Systems",
    year: "2025",
    featured: false,
    summary:
      "Real-time multi-client chat built on raw Python sockets and multithreading, with nickname authentication, message broadcasting and graceful disconnect handling.",
    stack: ["Python", "Sockets", "Threading"],
    links: {
      github:
        "https://github.com/purushottamcuj62045-alt/Python-Programs/tree/main/Projects/Chatting-Server",
    },
  },
  {
    slug: "brute-force",
    title: "Brute-Force Cracking Simulator",
    category: "red-team",
    categoryLabel: "Red team",
    year: "2025",
    featured: false,
    summary:
      "Measures the real computational cost of an exhaustive key-space search, demonstrating brute-force mechanics with live feedback as it runs.",
    stack: ["Python", "Cryptography"],
    links: {
      github:
        "https://github.com/purushottamcuj62045-alt/Python-Programs/blob/main/Projects/Bruteforce-Password_cracker",
    },
  },
  {
    slug: "port-scanner",
    title: "Threaded TCP Port Scanner",
    category: "red-team",
    categoryLabel: "Recon",
    year: "2025",
    featured: false,
    summary:
      "Scans a target for open TCP ports and grabs service banners for basic network reconnaissance, with timeout handling to keep scans fast.",
    stack: ["Python", "Sockets", "Threading"],
    links: {
      github:
        "https://github.com/purushottamcuj62045-alt/Python-Programs/blob/main/practice-and-concept/socket/port_scan_thread.py",
    },
  },
  {
    slug: "ftp-server",
    title: "FTP Server From Scratch",
    category: "systems",
    categoryLabel: "Systems",
    year: "2025",
    featured: false,
    summary:
      "A working FTP server implemented directly on Python sockets to understand the file-transfer protocol and client-server architecture from first principles.",
    stack: ["Python", "FTP", "Sockets"],
    links: {
      github:
        "https://github.com/purushottamcuj62045-alt/Python-Programs/tree/main/Projects/Ftp-server",
    },
  },
];

/* ── Journey (education + certifications in one timeline) ─────────────────── */
/*
 * `kind` drives the timeline marker style:
 *   "progress"  pulsing ring (in-flight)
 *   "cert"      filled dot
 *   "education" hollow ring
 */

export type JourneyEntry = {
  period: string;
  title: string;
  org: string;
  description: string;
  kind: "education" | "cert" | "progress";
  /** Path to the certificate file in /public, when one exists. */
  credential?: string;
};

export const journey: JourneyEntry[] = [
  {
    period: "In progress",
    title: "CompTIA Security+ · TryHackMe Path",
    org: "Self-directed",
    kind: "progress",
    description:
      "Working through offensive and defensive labs to build toward an industry-recognised security certification.",
  },
  {
    period: "2026",
    title: "SOC Level 1",
    org: "TryHackMe",
    kind: "cert",
    credential: "/thm-soc-level-1.pdf",
    description:
      "65+ hour hands-on path covering security monitoring, log and network traffic analysis, threat intelligence, phishing analysis, SIEM tooling and incident response fundamentals.",
  },
  {
    period: "2026",
    title: "Endpoint Security",
    org: "Cisco",
    kind: "cert",
    credential: "/endpoint-security.pdf",
    description:
      "Core principles of protecting devices from malware and exploits, endpoint hardening techniques, and threat detection and response fundamentals.",
  },
  {
    period: "2026",
    title: "Networking Devices and Basic Configuration",
    org: "Cisco",
    kind: "cert",
    credential: "/networking-devices-config.png",
    description:
      "Configuring switches and routers with Cisco IOS, IPv4 subnetting, Ethernet, ARP, DNS, DHCP and the Transport Layer.",
  },
  {
    period: "2026",
    title: "Networking Basics",
    org: "Cisco",
    kind: "cert",
    credential: "/networking-basics.pdf",
    description:
      "Network types and topologies, the OSI and TCP/IP models, IP addressing, subnetting and core networking devices.",
  },
  {
    period: "2026",
    title: "Introduction to Modern AI",
    org: "Cisco",
    kind: "cert",
    credential: "/intro-to-modern-ai.pdf",
    description:
      "Machine learning fundamentals, real-world AI applications and the ethical impact of AI systems.",
  },
  {
    period: "2025 — 2029",
    title: "B.Tech, Computer Science (Cybersecurity)",
    org: "Central University of Jammu",
    kind: "education",
    description:
      "Core foundations in networking, operating systems, data structures and software engineering, with a cybersecurity specialisation.",
  },
];

/* ── Recommendations ──────────────────────────────────────────────────────── */
/*
 * No written testimonials yet, so this section points visitors at LinkedIn
 * instead of inventing quotes.
 *
 * WHEN YOU GET A REAL RECOMMENDATION: add it to `quotes` below and the section
 * automatically switches from the call-to-action to a proper quote layout.
 * Nothing else needs to change.
 *
 *   quotes: [{ quote: "...", name: "...", role: "...", org: "..." }]
 */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  org: string;
};

export const recommendations = {
  quotes: [] as Testimonial[],
  /** Shown while `quotes` is empty. */
  fallback: {
    heading: "Recommendations live on LinkedIn",
    body: "I'd rather point you at the real thing than paste selected quotes here. Endorsements and recommendations from coursework, collaborators and CTF teammates are on my LinkedIn profile.",
    ctaLabel: "View LinkedIn profile",
    ctaHref: "https://www.linkedin.com/in/purushottam-k-08a414383/",
  },
} as const;

/* ── Navigation ───────────────────────────────────────────────────────────── */
/* `id` must match the id on the matching <section> in app/page.tsx.         */

export const navigation = [
  { id: "about", label: "About", index: "01" },
  { id: "skills", label: "Skills", index: "02" },
  { id: "work", label: "Work", index: "03" },
  { id: "journey", label: "Journey", index: "04" },
  { id: "contact", label: "Contact", index: "05" },
] as const;

/* ── SEO ──────────────────────────────────────────────────────────────────── */

export const seo = {
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio1.purushottamcuj62045.workers.dev",
  title: `${identity.name} — ${identity.role}`,
  description:
    "Cybersecurity engineer and CS undergraduate at Central University of Jammu. I build intrusion detection systems, socket servers and security tooling in Python. TryHackMe SOC Level 1 certified.",
  keywords: [
    "Purushottam Kumar",
    "cybersecurity engineer",
    "SOC analyst",
    "intrusion detection system",
    "Scapy",
    "Python security",
    "Central University of Jammu",
    "blue team",
    "full-stack developer",
  ],
} as const;
