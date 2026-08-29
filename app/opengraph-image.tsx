import { ImageResponse } from "next/og";

import { identity, seo } from "@/lib/content";

/* ---------------------------------------------------------------------------
 * opengraph-image.tsx
 * ---------------------------------------------------------------------------
 * The card that renders when the site is shared on LinkedIn, WhatsApp, Slack
 * or X. Generated at build time from the same content file as the page, so the
 * name and role can never drift out of sync with the site itself.
 *
 * Note: this uses inline styles, not Tailwind — Satori (the renderer behind
 * ImageResponse) supports a flexbox subset of CSS and no class names.
 *
 * NOTE FOR STATIC EXPORT (`output: "export"`): delete this file and drop a
 * plain 1200x630 `opengraph-image.png` into app/ instead.
 * ------------------------------------------------------------------------- */

export const alt = seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090b",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: monogram + availability */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: "#d8ff47",
              color: "#0a0c04",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            {identity.initials}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 18px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#8b9098",
              fontSize: "18px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: "#d8ff47",
              }}
            />
            {identity.availability}
          </div>
        </div>

        {/* Name and role */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "82px",
              fontWeight: 700,
              color: "#ededea",
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
            }}
          >
            {identity.name}
          </div>
          <div
            style={{
              marginTop: "20px",
              fontSize: "34px",
              color: "#d8ff47",
              letterSpacing: "-0.02em",
            }}
          >
            {identity.role}
          </div>
        </div>

        {/* Footer rule */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "28px",
            color: "#5a5f67",
            fontSize: "20px",
          }}
        >
          <div style={{ display: "flex" }}>{identity.location}</div>
          <div style={{ display: "flex" }}>Central University of Jammu</div>
        </div>
      </div>
    ),
    size,
  );
}
