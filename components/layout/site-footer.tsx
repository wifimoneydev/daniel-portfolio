import Link from "next/link";
import { site } from "@/data/site";
import { getContactActions } from "@/data/social";
import { navItems } from "./nav-items";
import { Container } from "@/components/ui/primitives";
import { publicFileExists } from "@/lib/content/images";

export function SiteFooter() {
  const actions = getContactActions().filter((a) => a.id !== "phone");
  const hasResume = publicFileExists(site.resume.path);

  return (
    <footer className="border-t border-rule">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-lg font-semibold tracking-[-0.02em] text-ink">{site.name}</p>
            <p className="mt-1 text-ink-2">
              {site.role}, {site.background}.
            </p>
            {site.availability.available && (
              <p className="mt-6 flex items-center gap-2 text-sm text-ink-2">
                <span className="size-1.5 rounded-full bg-ok" aria-hidden />
                {site.availability.label} · {site.availability.detail}
              </p>
            )}
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="t-label mb-4">Index</p>
            <ul className="grid grid-cols-2 gap-y-2 text-[0.9375rem] md:grid-cols-1">
              <li>
                <Link href="/" className="link text-ink-2 hover:text-ink">
                  Home
                </Link>
              </li>
              {navItems.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link text-ink-2 hover:text-ink">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="t-label mb-4">Contact</p>
            <ul className="space-y-2 text-[0.9375rem]">
              {actions.map((a) => (
                <li key={a.id}>
                  <a
                    href={a.href}
                    className="link break-all text-ink-2 hover:text-ink"
                    {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {a.id === "email" ? a.value : a.label}
                  </a>
                </li>
              ))}
              {hasResume && (
                <li>
                  <a href={site.resume.path} target="_blank" rel="noopener noreferrer" className="link text-ink-2 hover:text-ink">
                    {site.resume.viewLabel}
                    <span className="sr-only"> (PDF, opens in a new tab)</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-label">
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="t-label">{site.location} · Remote worldwide</p>
        </div>
      </Container>
    </footer>
  );
}
