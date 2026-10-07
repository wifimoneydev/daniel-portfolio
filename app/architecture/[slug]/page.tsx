import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArchitectureProject, getArchitectureProjects, getRelatedProjects, toSummary } from "@/lib/content/loader";
import { ARCHITECTURE_SECTIONS, matchCanonical } from "@/lib/content/sections";
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

  const { byId, extras } = matchCanonical(ARCHITECTURE_SECTIONS, project.sections);
  const concept = byId.get("concept");
  const process = byId.get("process");
  const caseStudy = [byId.get("case-study"), ...extras].filter((s): s is NonNullable<typeof s> => !!s);
  const related = getRelatedProjects(project);
  const hero = project.hero;

  return (
    <article>
      {/* ---------------------------------------------------------- Hero */}
      {hero && (
        <figure className="relative">
          <div className="relative h-[62svh] max-h-[56rem] min-h-[22rem] w-full bg-paper-3 sm:h-[72svh] lg:h-[82svh]">
            <Image src={hero.src} alt={hero.alt} fill priority sizes="100vw" className="anim-fade object-cover" />
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
          {process && (
            <TextBlock label="Process">
              <Mdx source={process.body} />
            </TextBlock>
          )}
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
              <ArrowLink href="/architecture">All architecture</ArrowLink>
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
