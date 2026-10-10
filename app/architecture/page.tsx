import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/data/site";
import { education } from "@/data/education";
import { getSkillGroups } from "@/data/skills";
import { getArchitectureProjects } from "@/lib/content/loader";
import { pageMetadata } from "@/lib/seo";
import { pad } from "@/lib/utils";
import { Container, Section, TitleBlock } from "@/components/ui/primitives";
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

      {/* Gateway to the project index. Projects themselves live on /architecture/projects. */}
      <Container className="pb-8">
        <Link
          href="/architecture/projects"
          className="group relative block overflow-hidden border border-rule transition-colors hover:border-ink"
        >
          <div className="drafting-grid absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
          <div className="relative flex flex-col gap-10 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-10 lg:p-14">
            <div>
              <p className="t-label">
                Daniel <span className="text-accent-ink">/</span> Architecture <span className="text-accent-ink">/</span> Projects
              </p>
              <p className="t-h1 mt-6 text-ink">Explore My Projects</p>
              <p className="mt-4 max-w-[46ch] text-ink-2">
                {projects.length > 0
                  ? `${pad(projects.length)} ${projects.length === 1 ? "project" : "projects"} — plans, sections, elevations and the thinking behind each design.`
                  : "Architectural projects are being prepared for publication."}
              </p>
            </div>
            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-ink bg-paper text-ink transition-colors duration-200 group-hover:bg-ink group-hover:text-paper sm:size-16">
              <ArrowRight aria-hidden className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
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
