/**
 * Contact details and profiles — the only place they are defined.
 * Leave a value as an empty string ("") to hide it everywhere on the site.
 */

export const contact = {
  email: "omotunmiseawofadeju200@gmail.com",
  /** Primary phone, international format, digits only after the "+". */
  phone: "+2349169393378",
  phoneDisplay: "+234 916 939 3378",
  /** Is the primary phone active on WhatsApp? */
  whatsapp: true,
  whatsappMessage: "Hi Daniel, I found your portfolio and would like to talk.",
  secondaryPhone: "+2347019044449",
  secondaryPhoneDisplay: "+234 701 904 4449",
};

export const social = {
  github: "https://github.com/wifimoneydev",
  linkedin: "https://www.linkedin.com/in/danielfadeju/",
  upwork: "https://www.upwork.com/freelancers/~01676ab8b299b40f20",
};

/* ---------- Derived links (no need to edit below) ---------- */

export const links = {
  email: contact.email ? `mailto:${contact.email}` : "",
  phone: contact.phone ? `tel:${contact.phone}` : "",
  secondaryPhone: contact.secondaryPhone ? `tel:${contact.secondaryPhone}` : "",
  whatsapp:
    contact.whatsapp && contact.phone
      ? `https://wa.me/${contact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(contact.whatsappMessage)}`
      : "",
  ...social,
};

export type ContactAction = {
  id: string;
  label: string;
  /** Action verb shown to visitors, e.g. "Send an email". */
  action: string;
  value: string;
  href: string;
  external: boolean;
};

/** Ordered list of contact actions used by the Contact page, footer and CTAs. */
export function getContactActions(): ContactAction[] {
  const all: ContactAction[] = [
    { id: "email", label: "Email", action: "Send an email", value: contact.email, href: links.email, external: false },
    { id: "whatsapp", label: "WhatsApp", action: "Message on WhatsApp", value: contact.phoneDisplay, href: links.whatsapp, external: true },
    { id: "phone", label: "Phone", action: "Call", value: contact.phoneDisplay, href: links.phone, external: false },
    { id: "linkedin", label: "LinkedIn", action: "View LinkedIn", value: "in/danielfadeju", href: links.linkedin, external: true },
    { id: "github", label: "GitHub", action: "View GitHub", value: "wifimoneydev", href: links.github, external: true },
    { id: "upwork", label: "Upwork", action: "Hire me on Upwork", value: "Upwork profile", href: links.upwork, external: true },
  ];
  return all.filter((a) => a.href);
}
