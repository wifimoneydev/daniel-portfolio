import { ArrowUpRight, FileText } from "lucide-react";
import type { Certification } from "@/data/certifications";
import type { Education } from "@/data/education";
import { publicFileExists } from "@/lib/content/images";

export function EducationList({ items }: { items: Education[] }) {
  if (!items.length) return null;
  return (
    <ul className="border-t border-rule">
      {items.map((e) => (
        <li key={`${e.degree}-${e.institution}`} className="grid gap-2 border-b border-rule py-6 md:grid-cols-12 md:gap-8">
          <p className="t-mono text-ink-2 md:col-span-3">{e.year}</p>
          <div className="md:col-span-9">
            <h3 className="text-[1.0625rem] font-medium tracking-[-0.01em] text-ink">
              {e.degree} in {e.field}
            </h3>
            <p className="mt-0.5 text-ink-2">{e.institution}</p>
            <p className="text-[0.875rem] text-ink-3">{e.location}</p>
            {e.note && <p className="mt-2 text-ink-2">{e.note}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Certifications as a compact register — supporting evidence, not the headline. */
export function CertificationList({ items }: { items: Certification[] }) {
  if (!items.length) return null;
  return (
    <ul className="border-t border-rule">
      {items.map((c) => {
        const hasFile = c.file ? publicFileExists(c.file) : false;
        return (
          <li key={c.id} className="grid gap-2 border-b border-rule py-5 md:grid-cols-12 md:items-baseline md:gap-8">
            <p className="t-mono text-ink-2 md:col-span-3">{c.date}</p>
            <div className="md:col-span-6">
              <h3 className="font-medium leading-snug tracking-[-0.01em] text-ink">{c.title}</h3>
              <p className="mt-0.5 text-[0.875rem] text-ink-3">
                {c.issuer}
                {c.platform && ` · ${c.platform}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[0.875rem] md:col-span-3 md:justify-end">
              {c.credentialUrl && (
                <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 text-ink-2 hover:text-ink">
                  <span className="link">Verify</span>
                  <ArrowUpRight aria-hidden className="size-3.5" />
                  <span className="sr-only"> {c.title} credential (opens in a new tab)</span>
                </a>
              )}
              {hasFile && c.file && (
                <a href={c.file} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 text-ink-2 hover:text-ink">
                  <FileText aria-hidden className="size-3.5" />
                  <span className="link">Certificate</span>
                  <span className="sr-only"> for {c.title} (PDF, opens in a new tab)</span>
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
