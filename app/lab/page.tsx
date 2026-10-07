import { lab } from "@/data/lab";
import { getAllProjects, toSummary } from "@/lib/content/loader";
import { pageMetadata } from "@/lib/seo";
import { pad } from "@/lib/utils";
import { ArrowLink, Container, Section } from "@/components/ui/primitives";
import { BrandEyebrow, PageHeader } from "@/components/sections/page-header";
import { ProjectCard } from "@/components/projects/project-card";
import { ContactCta } from "@/components/sections/contact-cta";

export const metadata = pageMetadata({
  title: "Lab — Architecture × Technology",
  description:
    "Where architecture and software meet: Daniel Awofadeju’s current exploration of Three.js, interactive 3D, real-time architectural visualisation and AI-assisted architectural experiences.",
  path: "/lab",
});

export default function LabPage() {
  const experiments = getAllProjects().filter((p) =>
    p.categories.some((c) => c === "Architecture + Technology" || c === "Experimental"),
  );

  return (
    <>
      <PageHeader
        eyebrow={<BrandEyebrow section="Lab" />}
        title={
          <>
            Architecture <span className="text-ink-3">×</span> Technology
          </>
        }
        lead={lab.intro}
      >
        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-rule-strong px-3 py-1.5 text-[0.8125rem] text-ink-2">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden />
          Emerging area · Exploring
        </p>
      </PageHeader>

      <Section number="01" label="Current interests" title="What I’m exploring." className="pt-0 sm:pt-0 lg:pt-0">
        <ol className="border-t border-rule">
          {lab.interests.map((it, i) => (
            <li key={it.title} className="reveal grid gap-2 border-b border-rule py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6">
              <span className="font-mono text-[0.6875rem] text-accent-ink sm:col-span-1">{pad(i + 1)}</span>
              <h3 className="text-[1.125rem] font-medium tracking-[-0.015em] text-ink sm:col-span-4">{it.title}</h3>
              <p className="leading-relaxed text-ink-2 sm:col-span-5">{it.description}</p>
              <p className="t-label sm:col-span-2 sm:text-right">{it.status}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section number="02" label="Experiments" title="Log.">
        {experiments.length > 0 ? (
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {experiments.map((p) => (
              <li key={p.slug} className="flex">
                <ProjectCard project={toSummary(p)} className="w-full" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="drafting-grid border border-rule px-6 py-14 sm:py-16">
            <div className="mx-auto max-w-xl bg-paper/90 p-6 text-center sm:p-8">
              <p className="text-ink">No experiments published yet.</p>
              <p className="mt-2 text-ink-2">Experiments will be logged here as they are built — work in progress included, clearly labelled.</p>
            </div>
          </div>
        )}
      </Section>

      <Container className="pb-20 sm:pb-24">
        <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-6">
          <ArrowLink href="/architecture">Architecture</ArrowLink>
          <ArrowLink href="/tech">Tech</ArrowLink>
        </div>
      </Container>

      <ContactCta title="Interested in architecture × technology?" />
    </>
  );
}
