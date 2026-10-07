import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRelatedProjects, getTechProject, getTechProjects, toSummary, type TechProject } from "@/lib/content/loader";
import { matchCanonical, TECH_SECTIONS } from "@/lib/content/sections";
import { Mdx } from "@/lib/mdx";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import { pad, prettyUrl } from "@/lib/utils";
import { ArrowLink, ButtonLink, Container, TagList, TitleBlock } from "@/components/ui/primitives";
import { Github } from "@/components/ui/icons";
import { SystemDiagram } from "@/components/projects/system-diagram";
import { ProjectCard } from "@/components/projects/project-card";
import { CaseStudyNav } from "@/components/case-study/case-study-nav";
import { CaseSection, DecisionList, MetricsGrid, NoteList } from "@/components/case-study/case-study-parts";
import { ContactCta } from "@/components/sections/contact-cta";

export const dynamicParams = false;

export function generateStaticParams() {
  return getTechProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getTechProject(slug);
  if (!p) return {};
  return {
    ...pageMetadata({
      title: p.seo.title ?? `${p.title} — Case study`,
      description: p.seo.description ?? p.summary,
      path: p.href,
      type: "article",
    }),
    keywords: [p.title, ...p.categories, ...p.tools, site.name],
  };
}

/** Builds the ordered case-study sections from MDX + structured frontmatter. Empty sections are dropped. */
function buildSections(p: TechProject) {
  const { byId, extras } = matchCanonical(TECH_SECTIONS, p.sections);
  const structured: Partial<Record<(typeof TECH_SECTIONS)[number]["id"], ReactNode>> = {
    challenge: p.challenges.length ? <NoteList items={p.challenges} /> : null,
    "engineering-decisions": p.decisions.length ? <DecisionList items={p.decisions} /> : null,
    results: p.metrics.length ? <MetricsGrid metrics={p.metrics} /> : null,
    limitations: p.limitations.length ? <NoteList items={p.limitations} /> : null,
    lessons: p.lessons.length ? <NoteList items={p.lessons} /> : null,
    "next-steps": p.nextSteps.length ? <NoteList items={p.nextSteps} marker="→" /> : null,
  };

  const canonical = TECH_SECTIONS.map((def) => {
    const mdx = byId.get(def.id);
    const extra = structured[def.id];
    if (!mdx && !extra) return null;
    return { id: def.id, title: mdx?.title ?? def.title, mdx: mdx?.body, extra };
  }).filter((s): s is NonNullable<typeof s> => !!s);

  return [...canonical, ...extras.map((e) => ({ id: e.id, title: e.title, mdx: e.body, extra: null }))];
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getTechProject(slug);
  if (!project) notFound();

  const sections = buildSections(project);
  const related = getRelatedProjects(project);
  const all = getTechProjects();
  const next = all.length > 1 ? all[(all.findIndex((p) => p.slug === project.slug) + 1) % all.length] : undefined;
  const { links } = project;
  const screenshots = project.gallery;

  return (
    <article>
      {/* ---------------------------------------------------------- Header */}
      <header className="pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-20">
        <Container>
          <nav aria-label="Breadcrumb" className="t-label">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/projects" className="link hover:text-ink">
                  Work
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-ink-2">
                {project.title}
              </li>
            </ol>
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="anim-rise lg:col-span-8">
              <p className="t-label">
                <span className="text-accent-ink">Project {pad(project.index)}</span> / {project.title}
              </p>
              <h1 className="t-display mt-5 text-ink">{project.title}</h1>
              <p className="t-lead mt-6 max-w-[58ch]">{project.summary}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {links.live && (
                  <ButtonLink href={links.live} icon="external">
                    Live site
                  </ButtonLink>
                )}
                {links.demo && (
                  <ButtonLink href={links.demo} variant={links.live ? "secondary" : "primary"} icon="external">
                    Demo
                  </ButtonLink>
                )}
                {links.github && (
                  <ButtonLink href={links.github} variant={links.live || links.demo ? "secondary" : "primary"} icon={<Github className="size-4" />}>
                    View source
                  </ButtonLink>
                )}
              </div>
            </div>

            {project.highlights.length > 0 && (
              <aside aria-label="At a glance" className="anim-fade lg:col-span-4 lg:pt-14">
                <p className="t-label border-b border-rule pb-3">At a glance</p>
                <ul>
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-3 border-b border-rule py-3 text-[0.9375rem] text-ink">
                      <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                      {h}
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </div>

          <TitleBlock
            columns={4}
            className="mt-14"
            items={[
              { label: "Type", value: project.projectType },
              { label: "Year", value: project.year },
              { label: "Status", value: project.status },
              { label: "Role", value: project.role },
              { label: "Focus", value: project.categories.join(" · ") },
              {
                label: "Source",
                value: links.github ? (
                  <a href={links.github} target="_blank" rel="noopener noreferrer" className="link-underlined break-all">
                    {prettyUrl(links.github)}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : undefined,
              },
            ]}
          />
        </Container>
      </header>

      {/* ---------------------------------------------------------- Lead figure */}
      <Container className="pb-16 sm:pb-20">
        {project.thumbnail ? (
          <figure>
            <div className="overflow-hidden border border-rule bg-paper-2">
              <Image
                src={project.thumbnail.src}
                alt={project.thumbnail.alt}
                width={project.thumbnail.width}
                height={project.thumbnail.height}
                sizes="(min-width: 1360px) 1280px, 100vw"
                priority
                className="h-auto w-full"
              />
            </div>
            <figcaption className="t-label mt-3">
              <span className="text-ink-2">Fig. 01</span> — {project.thumbnail.caption ?? project.thumbnail.alt}
            </figcaption>
          </figure>
        ) : (
          <SystemDiagram steps={project.system} figure="Fig. 01" />
        )}
      </Container>

      {/* ---------------------------------------------------------- Body */}
      <Container className="pb-20 sm:pb-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-3">
            <CaseStudyNav items={sections.map((s) => ({ id: s.id, title: s.title }))} />
          </div>

          <div className="min-w-0 lg:col-span-9 xl:col-span-8">
            {project.intro && (
              <div className="mb-14 [&_.prose]:text-[1.1875rem] [&_.prose]:leading-[1.6] [&_.prose]:text-ink">
                <Mdx source={project.intro} />
              </div>
            )}

            {sections.map((s, i) => (
              <CaseSection key={s.id} id={s.id} number={i + 1} title={s.title}>
                {s.mdx && <Mdx source={s.mdx} />}
                {s.extra}
              </CaseSection>
            ))}

            {screenshots.length > 0 && (
              <section aria-labelledby="screens-title" className="border-t border-rule pt-6">
                <h2 id="screens-title" className="t-h3 text-ink">
                  Screens
                </h2>
                <div className="mt-6 space-y-10">
                  {screenshots.map((img, i) => (
                    <figure key={img.src}>
                      <div className="overflow-hidden border border-rule">
                        <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 1024px) 66vw, 100vw" className="h-auto w-full" />
                      </div>
                      <figcaption className="t-label mt-3">
                        <span className="text-ink-2">Fig. {pad(i + 2)}</span> — {img.caption ?? img.alt}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-6 border-t border-rule pt-8">
              <p className="t-label">Stack</p>
              <TagList items={project.tools} className="mt-4" />
            </div>
          </div>
        </div>
      </Container>

      {/* ---------------------------------------------------------- Related / next */}
      {(related.length > 0 || next) && (
        <section aria-labelledby="more-title" className="border-t border-rule">
          <Container className="py-16 sm:py-20">
            <div className="mb-10 flex items-baseline justify-between gap-6">
              <h2 id="more-title" className="t-label">
                {related.length > 0 ? "Related work" : "Next project"}
              </h2>
              <ArrowLink href="/projects">All work</ArrowLink>
            </div>
            <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {(related.length > 0 ? related : next ? [next] : []).map((p) => (
                <li key={p.slug} className="flex">
                  <ProjectCard project={toSummary(p)} className="w-full" />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <ContactCta />
    </article>
  );
}
