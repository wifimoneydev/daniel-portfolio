import { site } from "@/data/site";
import { ogSize, renderOg } from "@/lib/og";

export const alt = `${site.name} — ${site.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Portfolio", title: site.name, subtitle: `${site.role}, ${site.background}.` });
}
