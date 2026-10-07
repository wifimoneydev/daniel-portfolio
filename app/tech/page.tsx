import { site } from "@/data/site";
import { repos } from "@/data/repos";
import { social } from "@/data/social";
import { getSkillGroups } from "@/data/skills";
import { getTechProjects, toSummary } from "@/lib/content/loader";
import { pageMetadata } from "@/lib/seo";
import { ArrowLink, Section } from "@/components/ui/primitives";
import { BrandEyebrow, PageHeader } from "@/components/sections/page-header";
import { FeatureProject } from "@/components/projects/feature-project";
import { ProjectCard } from "@/components/projects/project-card";
import { RepoList } from "@/components/projects/repo-list";
import { Capabilities } from "@/components/sections/capabilities";
import { ContactCta } from "@/components/sections/contact-cta";
import { pad } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Tech — AI Engineer & Software Developer",
  description:
    "AI engineering and software development by Daniel Awofadeju: LLM applications, RAG, NLP, computer vision, AI evaluation, APIs and full-stack products.",
  path: "/tech",
});

const FOCUS = [
  { group: "Applied AI", items: ["AI-powered applications", "LLM applications", "RAG", "NLP", "Computer vision", "AI evaluation"] },
  { group: "Software", items: ["Full-stack software", "APIs & backend systems", "Automation"] },
  { group: "Product", items: ["Product engineering"] },
];

/** How I work — each principle is demonstrated in the published case studies. */
const PRINCIPLES = [
  {
    title: "Measure it, don’t assume it",
    body: "Tests and evaluation sets come with the feature, so failures are found deliberately rather than by users.",
    evidence: { label: "MeetingBot retrieval fix", href: "/projects/meetingbot#challenge" },
  },
  {
    title: "Keep facts out of the model’s hands",
    body: "Where correctness matters, deterministic code computes the answer and the language model only explains it.",
    evidence: { label: "Trash2Cash grounding", href: "/projects/trash2cash#engineering-decisions" },
  },
  {
    title: "State the limitations",
    body: "Every case study lists what the system can’t do yet. Knowing the edges is part of the engineering.",
    evidence: { label: "MeetingBot limitations", href: "/projects/meetingbot#limitations" },
  },
];

export default function TechPage() {
  const projects = getTechProjects();
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <>
      <PageHeader
        eyebrow={<BrandEyebrow section="Tech" />}
        title={site.role}
        lead={site.bio[1]}
      >
        <dl className="mt-12 grid gap-y-6 border-t border-rule pt-6 sm:grid-cols-3 sm:gap-x-8">
          {FOCUS.map((f) => (
            <div key={f.group}>
              <dt className="t-label">{f.group}</dt>
              <dd className="mt-3">
                <ul className="space-y-1.5 text-[0.9375rem] text-ink">
                  {f.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      {featured.length > 0 && (
        <Section number="01" label="Case studies" title="Flagship projects." className="pt-0 sm:pt-0 lg:pt-0">
          <div className="space-y-20 lg:space-y-28">
            {featured.map((p, i) => (
              <FeatureProject key={p.slug} project={p} reverse={i % 2 === 1} />
            ))}
          </div>
        </Section>
      )}

      <Section number="02" label="Approach" title="How I work.">
        <ol className="grid border-t border-rule md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className={`reveal flex flex-col py-8 md:px-8 md:first:pl-0 md:last:pr-0 ${i > 0 ? "border-t border-rule md:border-t-0 md:border-l" : ""}`}>
              <span className="font-mono text-[0.6875rem] text-accent-ink">{pad(i + 1)}</span>
              <h3 className="t-h3 mt-4 text-ink">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-2">{p.body}</p>
              <div className="mt-auto pt-6">
                <ArrowLink href={p.evidence.href} className="text-[0.875rem]">
                  See: {p.evidence.label}
                </ArrowLink>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {others.length > 0 && (
        <Section number="03" label="More projects" title="Other work.">
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <li key={p.slug} className="flex">
                <ProjectCard project={toSummary(p)} className="w-full" />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {repos.length > 0 && (
        <Section
          number={others.length > 0 ? "04" : "03"}
          label="Selected repositories"
          title="Smaller builds and experiments."
          action={social.github ? <ArrowLink href={social.github}>All repositories on GitHub</ArrowLink> : undefined}
        >
          <RepoList repos={repos} />
        </Section>
      )}

      <Section number={others.length > 0 ? "05" : "04"} label="Stack" title="Tools and technologies.">
        <Capabilities groups={getSkillGroups("tech")} />
      </Section>

      <ContactCta title="Need an AI product built properly?" />
    </>
  );
}
