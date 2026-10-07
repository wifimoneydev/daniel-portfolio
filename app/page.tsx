import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/data/site";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { social } from "@/data/social";
import { getFeaturedProjects } from "@/lib/content/loader";
import { Availability, ArrowLink, ButtonLink, Container, Section, TitleBlock } from "@/components/ui/primitives";
import { Portrait } from "@/components/ui/portrait";
import { FeatureProject } from "@/components/projects/feature-project";
import { DisciplineCapabilities } from "@/components/sections/capabilities";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { ContactCta } from "@/components/sections/contact-cta";

export default function HomePage() {
  const featured = getFeaturedProjects();
  const degree = education[0];
  const current = experience.find((e) => e.end === "Present");

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    description: site.shortBio,
    url: site.url,
    address: { "@type": "PostalAddress", addressCountry: "NG" },
    sameAs: Object.values(social).filter(Boolean),
    ...(degree && { alumniOf: { "@type": "CollegeOrUniversity", name: degree.institution } }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />

      {/* ---------------------------------------------------------- Hero */}
      <section aria-labelledby="hero-title" className="pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24">
        <Container>
          <div className="grid grid-cols-[5.5rem_1fr] gap-x-5 sm:grid-cols-[8rem_1fr] sm:gap-x-8 lg:grid-cols-12 lg:gap-x-12">
            <Portrait
              priority
              sizes="(min-width: 1024px) 28vw, 8rem"
              className="anim-fade col-start-1 row-start-1 self-start lg:col-span-4 lg:col-start-9 lg:row-span-5 lg:max-w-[24rem] lg:justify-self-end"
              caption={undefined}
            />

            <div className="anim-rise col-start-2 row-start-1 self-center lg:col-span-8 lg:col-start-1 lg:self-start">
              {site.availability.available ? (
                <Availability label={site.availability.label} detail={site.availability.detail} />
              ) : (
                <p className="t-label">{site.location}</p>
              )}
            </div>

            <div className="anim-rise col-span-2 mt-8 sm:mt-10 lg:col-span-8 lg:col-start-1 lg:row-start-2 lg:mt-12" style={{ animationDelay: "60ms" }}>
              <h1 id="hero-title" className="t-display text-ink">
                {site.name}
              </h1>
              <p className="mt-6 max-w-[30ch] text-[clamp(1.35rem,1.1rem+1.1vw,2rem)] leading-[1.2] tracking-[-0.025em] text-ink">
                {site.role}
                <span className="text-ink-3"> {site.background}.</span>
              </p>
            </div>

            <div className="anim-rise col-span-2 mt-6 lg:col-span-7 lg:col-start-1 lg:row-start-3" style={{ animationDelay: "120ms" }}>
              <p className="max-w-[56ch] text-[1.0625rem] leading-relaxed text-ink-2 sm:text-[1.125rem]">{site.heroStatement}</p>
            </div>

            <div className="anim-rise col-span-2 mt-9 flex flex-wrap items-center gap-3 lg:col-span-8 lg:col-start-1 lg:row-start-4" style={{ animationDelay: "180ms" }}>
              <ButtonLink href="/projects">View selected work</ButtonLink>
              <ButtonLink href="/about" variant="secondary" icon="none">
                About Daniel
              </ButtonLink>
              <ArrowLink href="/contact" className="ml-2 sm:ml-4">
                Get in touch
              </ArrowLink>
            </div>
          </div>

          {/* Spec strip — a title block summarising the essentials */}
          <TitleBlock
            columns={4}
            className="anim-fade mt-14 sm:mt-20"
            items={[
              { label: "Practice", value: "AI engineering · Software development" },
              { label: "Background", value: degree ? `${degree.abbreviation ?? degree.degree} ${degree.field}, ${degree.year}` : undefined },
              { label: "Currently", value: current ? `${current.role}${current.organization ? `, ${current.organization}` : ""}` : undefined },
              { label: "Based", value: `${site.location} · Open to remote work` },
            ]}
          />
        </Container>
      </section>

      {/* ---------------------------------------------------------- Selected work */}
      {featured.length > 0 && (
        <Section
          id="work"
          number="01"
          label="Selected work"
          title="Products built end to end — and measured."
          action={<ArrowLink href="/projects">All work</ArrowLink>}
          className="pt-4 sm:pt-6 lg:pt-8"
        >
          <div className="space-y-20 lg:space-y-28">
            {featured.map((p, i) => (
              <FeatureProject key={p.slug} project={p} reverse={i % 2 === 1} />
            ))}
          </div>
        </Section>
      )}

      {/* ---------------------------------------------------------- Disciplines */}
      <Section id="disciplines" number="02" label="Disciplines" title="One way of thinking, applied to two disciplines.">
        <div className="grid border-t border-rule md:grid-cols-2">
          <DisciplineCell
            href="/tech"
            section="Tech"
            title="AI engineering & software"
            body="Applied AI products — LLM and RAG systems, NLP, computer vision and AI evaluation — and the full-stack software, APIs and automation around them."
            cta="Explore Tech"
          />
          <DisciplineCell
            href="/architecture"
            section="Architecture"
            title="Architecture & design"
            body="A B.Sc. in Architecture: structure, function and the experience of the person using what is built. The same lens shapes how I design software."
            cta="Explore Architecture"
            className="border-t border-rule md:border-t-0 md:border-l md:pl-10"
          />
        </div>
        <Link
          href="/lab"
          className="group mt-0 flex flex-col gap-2 border-y border-rule py-6 transition-colors hover:bg-paper-2 sm:flex-row sm:items-center sm:justify-between sm:px-4"
        >
          <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="t-label">
              Daniel <span className="text-accent-ink">/</span> Lab
            </span>
            <span className="text-ink">Architecture × Technology</span>
            <span className="text-ink-3">Three.js, interactive 3D, real-time visualisation — an emerging area.</span>
          </span>
          <ArrowRight aria-hidden className="size-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
        </Link>
      </Section>

      {/* ---------------------------------------------------------- Capabilities */}
      <Section
        id="capabilities"
        number="03"
        label="Capabilities"
        title="What I work with."
        action={<ArrowLink href="/about#capabilities">Full profile</ArrowLink>}
      >
        <DisciplineCapabilities />
      </Section>

      {/* ---------------------------------------------------------- Experience */}
      <Section
        id="experience"
        number="04"
        label="Experience"
        title="Where I’ve been working."
        action={<ArrowLink href="/about#experience">Full background</ArrowLink>}
      >
        <ExperienceTimeline items={experience.filter((e) => e.featured).slice(0, 3)} compact />
      </Section>

      <ContactCta />
    </>
  );
}

function DisciplineCell({
  href,
  section,
  title,
  body,
  cta,
  className = "",
}: {
  href: string;
  section: string;
  title: string;
  body: string;
  cta: string;
  className?: string;
}) {
  return (
    <div className={`reveal flex flex-col py-8 md:pr-10 ${className}`}>
      <p className="t-label">
        Daniel <span className="text-accent-ink">/</span> {section}
      </p>
      <h3 className="t-h3 mt-5 text-ink">{title}</h3>
      <p className="mt-3 max-w-[48ch] leading-relaxed text-ink-2">{body}</p>
      <div className="mt-6">
        <ArrowLink href={href}>{cta}</ArrowLink>
      </div>
    </div>
  );
}
