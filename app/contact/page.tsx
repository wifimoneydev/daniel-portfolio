import { Download } from "lucide-react";
import { site } from "@/data/site";
import { contact, links } from "@/data/social";
import { publicFileExists } from "@/lib/content/images";
import { pageMetadata } from "@/lib/seo";
import { Availability, ButtonLink, Container } from "@/components/ui/primitives";
import { Whatsapp } from "@/components/ui/icons";
import { ContactActions } from "@/components/sections/contact-actions";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Contact ${site.name} — email, WhatsApp, LinkedIn, GitHub or Upwork. ${site.availability.detail}.`,
  path: "/contact",
});

export default function ContactPage() {
  const hasResume = publicFileExists(site.resume.path);

  return (
    <section aria-labelledby="contact-title" className="pt-12 pb-24 sm:pt-16 sm:pb-32 lg:pt-24">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="anim-rise lg:col-span-5">
            <p className="t-label">Contact</p>
            <h1 id="contact-title" className="t-h1 mt-6 max-w-[12ch] text-ink">
              Let’s build something useful.
            </h1>
            <p className="t-lead mt-6 max-w-[44ch]">
              Roles, freelance projects, collaborations or architecture and design work — the quickest way to reach me is email or WhatsApp.
            </p>
            {site.availability.available && (
              <Availability className="mt-8" label={site.availability.label} detail={site.availability.detail} />
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              {contact.email && <ButtonLink href={links.email}>Send an email</ButtonLink>}
              {links.whatsapp && (
                <ButtonLink href={links.whatsapp} variant="secondary" icon={<Whatsapp className="size-4" />}>
                  Message on WhatsApp
                </ButtonLink>
              )}
            </div>
          </div>

          <div className="anim-fade lg:col-span-7">
            <ContactActions />

            {contact.secondaryPhone && (
              <p className="mt-5 text-[0.875rem] text-ink-3">
                Alternative number:{" "}
                <a href={links.secondaryPhone} className="link-underlined text-ink-2">
                  {contact.secondaryPhoneDisplay}
                </a>
              </p>
            )}

            {hasResume && (
              <div className="mt-12 flex flex-col gap-4 border border-rule p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <p className="font-medium text-ink">Résumé</p>
                  <p className="mt-0.5 text-[0.875rem] text-ink-3">One page · PDF</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <ButtonLink href={site.resume.path} newTab variant="secondary" icon="external">
                    {site.resume.viewLabel}
                  </ButtonLink>
                  <ButtonLink href={site.resume.path} download={site.resume.downloadName} variant="ghost" icon={<Download aria-hidden className="size-4" />} className="sm:px-2">
                    {site.resume.downloadLabel}
                  </ButtonLink>
                </div>
              </div>
            )}

            {/* Contact form slot: when site.contactForm.enabled is true, render <ContactForm /> here. */}
          </div>
        </div>
      </Container>
    </section>
  );
}
