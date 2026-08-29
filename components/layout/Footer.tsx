import { identity, socials } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";

/* ---------------------------------------------------------------------------
 * Footer.tsx
 * ---------------------------------------------------------------------------
 * Closing marker. Deliberately quiet — by this point the visitor has either
 * emailed or they haven't, so the footer's only jobs are attribution, one last
 * set of links, and a way back to the top.
 * ------------------------------------------------------------------------- */

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-12">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          {/* Attribution */}
          <div>
            <a href="#top" className="group inline-flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded bg-accent font-mono text-[0.625rem] font-semibold text-accent-ink transition-transform duration-300 group-hover:rotate-[-6deg]">
                {identity.initials}
              </span>
              <span className="font-mono text-sm text-fg">{identity.name}</span>
            </a>
            <p className="mt-3 font-mono text-xs text-faint">
              © {year} · {identity.shortRole} · Central University of Jammu
            </p>
          </div>

          {/* Links */}
          <ul className="flex items-center gap-2">
            {socials.map((social) => {
              const opensNewTab = social.href.startsWith("http") || social.icon === "document";
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={opensNewTab ? "_blank" : undefined}
                    rel={opensNewTab ? "noopener noreferrer" : undefined}
                    aria-label={social.label}
                    className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-accent hover:text-accent-text"
                  >
                    <Icon name={social.icon} className="size-4" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Colophon — the kind of detail engineers notice. */}
        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.6875rem] text-faint">
          
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 font-mono text-[0.6875rem] text-faint transition-colors duration-300 hover:text-fg"
          >
            Back to top
            <Icon
              name="arrow"
              className="size-3 -rotate-90 transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </Container>
    </footer>
  );
}
