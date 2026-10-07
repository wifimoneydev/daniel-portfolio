import { getArchitectureProject, getArchitectureProjects } from "@/lib/content/loader";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "Architecture project";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getArchitectureProjects().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getArchitectureProject(slug);
  return renderOg({ eyebrow: "Architecture", title: p?.title ?? "Project", subtitle: p?.summary });
}
