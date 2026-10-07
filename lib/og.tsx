import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph card: paper, ink, one accent rule — matches the site. */
export function renderOg({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3f1ec",
          color: "#141414",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          backgroundImage: "linear-gradient(#e2ded5 1px, transparent 1px), linear-gradient(90deg, #e2ded5 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: "#69665f" }}>
          <span style={{ color: "#141414", fontWeight: 700 }}>Daniel</span>
          <span style={{ color: "#d2461e" }}>/</span>
          <span>{eyebrow}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 72, height: 4, background: "#d2461e", marginBottom: 28 }} />
          <div style={{ fontSize: title.length > 28 ? 68 : 88, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02, maxWidth: 1000 }}>{title}</div>
          {subtitle && <div style={{ marginTop: 22, fontSize: 30, color: "#45433f", maxWidth: 980, lineHeight: 1.35 }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#69665f", letterSpacing: 1 }}>
          <span>{site.name}</span>
          <span>{site.role}</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
