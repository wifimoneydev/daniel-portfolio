import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/data/site";
import { education } from "@/data/education";
import { getSkillGroups } from "@/data/skills";
import { getArchitectureProjects, type ArchitectureProject } from "@/lib/content/loader";
import { GALLERY_KINDS } from "@/lib/content/schema";
import { pageMetadata } from "@/lib/seo";
import { cn, pad } from "@/lib/utils";
import { ArrowLink, Container, Section, TitleBlock } from "@/components/ui/primitives";
import { BrandEyebrow, PageHeader } from "@/components/sections/page-header";
import { Capabilities } from "@/components/sections/capabilities";
import { ContactCta } from "@/components/sections/contact-cta";

export const metadata = pageMetadata({
  title: "Architecture",
  description:
    "Architecture and architectural design by Daniel Awofadeju — B.Sc. Architecture graduate. Drawings, plans, sections, renders and design process.",
  path: "/architecture",
});

const LENSES = [
  { title: "Structure", body: "How the parts hold together — in a building or in a system." },
  { title: "Function", body: "What it has to do, for whom, and under which constraints." },
  { title: "Design", body: "Clarity, proportion and hierarchy, so the result is easy to read." },
  { title: "Experience", body: "What it is actually like for the person who uses it." },
];

export default function ArchitecturePage() {
  const projects = getArchitectureProjects();
  const degree = education.find((e) => /architecture/i.test(e.field));
  const designSkills = getSkillGroups("architecture");

  return (
    <>
      <PageHeader
        eyebrow={<BrandEyebrow section="Architecture" />}
        title="Architecture"
        lead={site.bio[2]}
        aside={
          degree && (
            <TitleBlock
              columns={2}
              className="sm:grid-cols-1 lg:grid-cols-1"
              items={[
                { label: "Qualification", value: `${degree.degree}, ${degree.field}` },
                { label: "Institution", value: degree.institution },
                { label: "Graduated", value: degree.year },
              ]}
            />
          )
        }
      />

      <Container className="pb-8">
        {projects.length > 0 ? <ArchitectureIndex projects={projects} /> : <DrawingIndexEmpty />}
      </Container>

      <Section number="01" label="Approach" title="What architecture taught me.">
        <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {LENSES.map((l, i) => (
            <li key={l.title} className="reveal border-t border-rule py-7 pr-4">
              <span className="font-mono text-[0.6875rem] text-accent-ink">{pad(i + 1)}</span>
              <h3 className="t-h3 mt-4 text-ink">{l.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-2">{l.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {designSkills.length > 0 && (
        <Section number="02" label="Capabilities" title="Architecture & design.">
          <Capabilities groups={designSkills} />
        </Section>
      )}

      <Container className="pb-20 sm:pb-28">
        <Link
          href="/lab"
          className="group flex flex-col gap-3 border-y border-rule py-8 transition-colors hover:bg-paper-2 sm:flex-row sm:items-center sm:justify-between sm:px-4"
        >
          <span>
            <span className="t-label">
              Daniel <span className="text-accent-ink">/</span> Lab
            </span>
            <span className="t-h3 mt-3 block text-ink">Architecture × Technology</span>
            <span className="mt-1 block text-ink-2">Where the two disciplines begin to meet — interactive 3D and real-time visualisation.</span>
          </span>
          <ArrowRight aria-hidden className="size-5 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
        </Link>
      </Container>

      <ContactCta title="Architecture or design opportunity?" />
    </>
  );
}

/** Image-led project index: the first project runs full width, the rest in two columns. */
function ArchitectureIndex({ projects }: { projects: ArchitectureProject[] }) {
  return (
    <section aria-label="Architecture projects">
      <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2">
        {projects.map((p, i) => {
          const img = p.thumbnail ?? p.hero;
          const lead = i === 0;
          return (
            <li key={p.slug} className={lead ? "md:col-span-2" : undefined}>
              <article className="group relative">
                <div className={cn("relative overflow-hidden bg-paper-3", lead ? "aspect-[4/3] md:aspect-[21/9]" : "aspect-[4/3]")}>
                  {img && (
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      priority={lead}
                      sizes={lead ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
                    />
                  )}
                </div>
                <div className="mt-4 grid gap-1 sm:grid-cols-12 sm:items-baseline sm:gap-6">
                  <p className="t-label sm:col-span-2">
                    <span className="text-accent-ink">A-{pad(p.index, 3)}</span>
                  </p>
                  <h2 className="t-h3 text-ink sm:col-span-6">
                    <Link href={p.href} className="after:absolute after:inset-0 after:content-['']">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="t-label sm:col-span-4 sm:text-right">
                    {[p.projectType, p.location, p.year].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Intentional empty state: a drawing index awaiting its first sheets. */
function DrawingIndexEmpty() {
  const kinds = GALLERY_KINDS.filter((k) => k !== "screenshot" && k !== "photo");
  return (
    <section aria-labelledby="index-title" className="border border-rule">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-4 py-3 sm:px-6">
        <h2 id="index-title" className="t-label text-ink-2">
          Sheet A-000 — Drawing index
        </h2>
        <p className="t-label flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden />
          In preparation
        </p>
      </div>

      <div className="drafting-grid px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-2xl bg-paper/90 p-6 text-center sm:p-10">
          <p className="t-h3 text-ink">Selected architectural work is being prepared for publication.</p>
          <p className="mx-auto mt-4 max-w-[52ch] leading-relaxed text-ink-2">
            Each project will be documented as a full set — drawings, plans, sections and renders, with the concept and process behind them.
          </p>
          <div className="mt-8 flex justify-center">
            <ArrowLink href="/contact">Ask about architectural work</ArrowLink>
          </div>
        </div>
      </div>

      <div className="hidden border-t border-rule sm:block">
        <div className="grid grid-cols-12 gap-6 border-b border-rule px-6 py-2.5">
          {["No.", "Project", "Type", "Year"].map((h, i) => (
            <span key={h} className={cn("t-label", i === 0 ? "col-span-2" : i === 1 ? "col-span-6" : "col-span-2")}>
              {h}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-12 gap-6 px-6 py-3 text-ink-3">
          <span className="t-mono col-span-2">A-001</span>
          <span className="col-span-6 italic">Forthcoming</span>
          <span className="col-span-2">—</span>
          <span className="col-span-2">—</span>
        </div>
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t border-rule px-4 py-3 sm:px-6" aria-label="Drawing types each project will include">
        {kinds.map((k) => (
          <li key={k} className="t-label">
            {k}s
          </li>
        ))}
      </ul>
    </section>
  );
}
