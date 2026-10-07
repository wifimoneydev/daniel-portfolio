import { getTechProject, getTechProjects } from "@/lib/content/loader";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "Project case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getTechProjects().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getTechProject(slug);
  return renderOg({ eyebrow: "Tech · Case study", title: p?.title ?? "Project", subtitle: p?.summary });
}
