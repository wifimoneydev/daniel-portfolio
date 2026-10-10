import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getArchitectureProject, getArchitectureProjects, getRelatedProjects, toSummary } from "@/lib/content/loader";
import { ARCHITECTURE_SECTIONS, matchCanonical, slugify } from "@/lib/content/sections";
import { Mdx } from "@/lib/mdx";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import { pad } from "@/lib/utils";
import { ArrowLink, Container, TitleBlock } from "@/components/ui/primitives";
import { Gallery } from "@/components/architecture/gallery";
import { ProjectCard } from "@/components/projects/project-card";
import { ContactCta } from "@/components/sections/contact-cta";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArchitectureProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getArchitectureProject(slug);
  if (!p) return {};
  return {
    ...pageMetadata({
      title: p.seo.title ?? `${p.title} — Architecture`,
      description: p.seo.description ?? p.summary,
      path: p.href,
      type: "article",
    }),
    keywords: [p.title, "Architecture", ...(p.projectType ? [p.projectType] : []), site.name],
  };
}

export default async function ArchitectureProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getArchitectureProject(slug);
  if (!project) notFound();

  const { byId } = matchCanonical(ARCHITECTURE_SECTIONS, project.sections);
  const canonicalOf = (id: string) =>
    ARCHITECTURE_SECTIONS.find((d) => d.id === id || d.aliases.map(slugify).includes(id))?.id;
  // Concept leads; "Case study" follows the gallery. Every other "## Heading"
  // (Process, Design philosophy, Spatial planning, …) appears before the gallery, in written order.
  const concept = byId.get("concept");
  const narrative = project.sections.filter((s) => !["concept", "case-study"].includes(canonicalOf(s.id) ?? ""));
  const caseStudy = [byId.get("case-study")].filter((s): s is NonNullable<typeof s> => !!s);
  const related = getRelatedProjects(project);
  const hero = project.hero;

  return (
    <article>
      {/* ---------------------------------------------------------- Hero */}
      {hero && (
        <figure className="relative">
          {/* Phones and tablets: show the whole image at its own proportions (drawings stay legible).
              Desktop: full-bleed, cropped band. */}
          <div
            className="relative aspect-[var(--hero-ar)] max-h-[56rem] w-full bg-paper-3 lg:aspect-auto lg:h-[82svh] lg:min-h-[22rem]"
            style={{ "--hero-ar": `${hero.width} / ${hero.height}` } as CSSProperties}
          >
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              priority
              sizes="100vw"
              className="anim-fade object-cover"
              style={hero.position ? { objectPosition: hero.position } : undefined}
            />
          </div>
          {hero.caption && (
            <Container>
              <figcaption className="t-label mt-3">
                <span className="text-ink-2">Fig. 00</span> — {hero.caption}
              </figcaption>
            </Container>
          )}
        </figure>
      )}

      {/* ---------------------------------------------------------- Title block */}
      <header className="pt-10 pb-14 sm:pt-14 sm:pb-20">
        <Container>
          <nav aria-label="Breadcrumb" className="t-label">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/architecture" className="link hover:text-ink">
                  Architecture
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/architecture/projects" className="link hover:text-ink">
                  Projects
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-ink-2">
                {project.title}
              </li>
            </ol>
          </nav>
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="t-label">
                <span className="text-accent-ink">A-{pad(project.index, 3)}</span> / {project.title}
              </p>
              <h1 className="t-h1 mt-5 text-ink">{project.title}</h1>
              <p className="t-lead mt-6 max-w-[56ch]">{project.summary}</p>
            </div>
            <div className="lg:col-span-5">
              <TitleBlock
                columns={2}
                items={[
                  { label: "Year", value: project.year },
                  { label: "Completion", value: project.completion },
                  { label: "Type", value: project.projectType },
                  { label: "Location", value: project.location },
                  { label: "Role", value: project.role },
                  { label: "Status", value: project.status },
                  { label: "Tools", value: project.tools.length ? project.tools.join(", ") : undefined },
                ]}
              />
            </div>
          </div>
        </Container>
      </header>

      {/* ---------------------------------------------------------- Description / concept / process */}
      <Container className="pb-16 sm:pb-24">
        <div className="space-y-14">
          {project.intro && (
            <TextBlock label="Description">
              <Mdx source={project.intro} />
            </TextBlock>
          )}
          {(project.concept || concept) && (
            <TextBlock label="Concept">
              {project.concept && <p className="t-lead max-w-[60ch] text-ink">{project.concept}</p>}
              {concept && <Mdx source={concept.body} />}
            </TextBlock>
          )}
          {narrative.map((s) => (
            <TextBlock key={s.id} label={s.title}>
              <Mdx source={s.body} />
            </TextBlock>
          ))}
        </div>
      </Container>

      {/* ---------------------------------------------------------- Gallery */}
      {project.gallery.length > 0 && (
        <section aria-label="Drawings and images" className="pb-20 sm:pb-28">
          <Container>
            <Gallery images={project.gallery} />
          </Container>
        </section>
      )}

      {/* ---------------------------------------------------------- Case study / extra sections */}
      {caseStudy.length > 0 && (
        <Container className="pb-20 sm:pb-28">
          <div className="space-y-14">
            {caseStudy.map((s) => (
              <TextBlock key={s.id} label={s.title}>
                <Mdx source={s.body} />
              </TextBlock>
            ))}
          </div>
        </Container>
      )}

      {project.downloads.length > 0 && (
        <Container className="pb-20">
          <TextBlock label="Downloads">
            <ul className="space-y-2">
              {project.downloads.map((d) => (
                <li key={d.href}>
                  <a href={d.href} className="link-underlined text-ink" download>
                    {d.label}
                  </a>
                </li>
              ))}
            </ul>
          </TextBlock>
        </Container>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-rule">
          <Container className="py-16 sm:py-20">
            <div className="mb-10 flex items-baseline justify-between gap-6">
              <h2 id="related-title" className="t-label">
                Related work
              </h2>
              <ArrowLink href="/architecture/projects">All projects</ArrowLink>
            </div>
            <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug} className="flex">
                  <ProjectCard project={toSummary(p)} className="w-full" />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <Container className="border-t border-rule py-10">
        <Link href="/architecture/projects" className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink hover:text-accent-ink">
          <ArrowLeft aria-hidden className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span className="link">All architectural projects</span>
        </Link>
      </Container>

      <ContactCta title="Architecture or design opportunity?" />
    </article>
  );
}

function TextBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-rule pt-5 lg:grid-cols-12 lg:gap-12">
      <h2 className="t-label lg:col-span-3">{label}</h2>
      <div className="space-y-5 lg:col-span-8">{children}</div>
    </section>
  );
}
