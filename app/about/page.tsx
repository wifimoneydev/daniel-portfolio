import { site } from "@/data/site";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { getCertifications } from "@/data/certifications";
import { publicFileExists } from "@/lib/content/images";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink, Container, Section } from "@/components/ui/primitives";
import { Portrait } from "@/components/ui/portrait";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { CertificationList, EducationList } from "@/components/sections/credentials";
import { DisciplineCapabilities } from "@/components/sections/capabilities";
import { ContactCta } from "@/components/sections/contact-cta";
import { Download } from "lucide-react";

export const metadata = pageMetadata({
  title: "About",
  description:
    "About Daniel Awofadeju — AI Engineer and Software Developer with a B.Sc. in Architecture. Experience, education, certifications and capabilities.",
  path: "/about",
  type: "profile",
});

export default function AboutPage() {
  const hasResume = publicFileExists(site.resume.path);
  const certs = getCertifications();
  const [first = "", ...rest] = site.bio;
  // Mobile shows the first sentence as a short intro above the portrait, and the rest of
  // the paragraph below it. Desktop keeps the full paragraph beside the portrait.
  const [, introSentence = first, firstRemainder = ""] = /^(.+?[.!?])\s+([\s\S]*)$/.exec(first) ?? [];
  const degree = education[0];

  return (
    <>
      {/* ---------------------------------------------------------- Story */}
      <section aria-labelledby="about-title" className="pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="anim-rise lg:col-span-7">
              <p className="t-label">About</p>
              <h1 id="about-title" className="t-h1 mt-6 max-w-[16ch] text-ink">
                From architecture to engineering — same instincts.
              </h1>

              {/* Mobile only: short intro → portrait, so identity and image share the first screen. */}
              <p className="mt-5 max-w-[34ch] text-[1.125rem] leading-[1.55] tracking-[-0.01em] text-ink sm:text-[1.25rem] lg:hidden">{introSentence}</p>
              <div className="mt-9 grid max-w-[34rem] grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] items-end gap-x-5 sm:gap-x-8 lg:hidden">
                <Portrait sizes="(min-width: 1024px) 30vw, (min-width: 640px) 60vw, 90vw" aspect="aspect-[4/5]" />
                <dl className="pb-1">
                  {[
                    { label: "Practice", value: "AI engineering · Software" },
                    { label: "Background", value: degree ? `${degree.abbreviation ?? degree.degree} ${degree.field}, ${degree.year}` : undefined },
                    { label: "Based", value: `${site.location} · Remote` },
                  ]
                    .filter((r) => r.value)
                    .map((r) => (
                      <div key={r.label} className="border-t border-rule py-2.5 last:border-b">
                        <dt className="t-label">{r.label}</dt>
                        <dd className="mt-1 text-[0.8125rem] leading-snug text-ink sm:text-[0.9375rem]">{r.value}</dd>
                      </div>
                    ))}
                </dl>
              </div>

              <div className="mt-10 max-w-[62ch] space-y-5 text-[1.0625rem] leading-[1.75] text-ink-2 sm:text-[1.125rem]">
                {first && <p className="hidden text-ink lg:block">{first}</p>}
                {firstRemainder && <p className="text-ink lg:hidden">{firstRemainder}</p>}
                {rest.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
                <p className="pt-2 text-[1.25rem] font-medium tracking-[-0.02em] text-ink">{site.bioSignoff}</p>
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                {hasResume && (
                  <ButtonLink href={site.resume.path} newTab icon="external">
                    {site.resume.viewLabel}
                  </ButtonLink>
                )}
                <ButtonLink href="/contact" variant="secondary">
                  Get in touch
                </ButtonLink>
              </div>
              {hasResume && (
                <a
                  href={site.resume.path}
                  download={site.resume.downloadName}
                  className="group mt-4 inline-flex items-center gap-1.5 text-[0.875rem] text-ink-2 hover:text-ink"
                >
                  <Download aria-hidden className="size-3.5" />
                  <span className="link">{site.resume.downloadLabel}</span>
                </a>
              )}
            </div>
            <div className="anim-fade hidden lg:col-span-4 lg:col-start-9 lg:block">
              <Portrait priority sizes="(min-width: 1024px) 30vw, (min-width: 640px) 60vw, 90vw" className="max-w-[26rem] lg:sticky lg:top-24" caption={`${site.name} · ${site.location}`} />
            </div>
          </div>
        </Container>
      </section>

      <Section id="experience" number="01" label="Experience" title="Professional experience.">
        <ExperienceTimeline items={experience} />
      </Section>

      <Section id="education" number="02" label="Education & certifications" title="Education.">
        <EducationList items={education} />
        {certs.length > 0 && (
          <div className="mt-16">
            <h3 className="t-h3 text-ink">Certifications</h3>
            <p className="mt-2 max-w-[60ch] text-ink-2">Computer science, machine learning and AI coursework that supports the work above.</p>
            <div className="mt-8">
              <CertificationList items={certs} />
            </div>
          </div>
        )}
      </Section>

      <Section id="capabilities" number="03" label="Capabilities" title="Capabilities.">
        <DisciplineCapabilities />
      </Section>

      <ContactCta />
    </>
  );
}
