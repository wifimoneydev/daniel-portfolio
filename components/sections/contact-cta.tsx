import { site } from "@/data/site";
import { contact, links } from "@/data/social";
import { Availability, ButtonLink, Container } from "@/components/ui/primitives";
import { Whatsapp } from "@/components/ui/icons";

/** Closing call-to-action used at the bottom of most pages. */
export function ContactCta({ title = "Have something worth building?" }: { title?: string }) {
  return (
    <section aria-labelledby="cta-heading" className="border-t border-rule bg-paper-2">
      <Container className="py-20 sm:py-24 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            {site.availability.available && <Availability label={site.availability.label} detail={site.availability.detail} />}
            <h2 id="cta-heading" className="t-h1 mt-6 max-w-[16ch] text-ink">
              {title}
            </h2>
            {contact.email && (
              <a href={links.email} className="link-underlined mt-6 inline-block break-all text-[clamp(1.05rem,0.9rem+0.8vw,1.5rem)] tracking-[-0.02em] text-ink-2 hover:text-ink">
                {contact.email}
              </a>
            )}
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <ButtonLink href="/contact">Get in touch</ButtonLink>
            {links.whatsapp && (
              <ButtonLink href={links.whatsapp} variant="secondary" icon={<Whatsapp className="size-4" />}>
                WhatsApp
              </ButtonLink>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
