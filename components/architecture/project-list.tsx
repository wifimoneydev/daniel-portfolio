import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArchitectureProject } from "@/lib/content/loader";
import { GALLERY_KINDS } from "@/lib/content/schema";
import { cn, pad } from "@/lib/utils";
import { ArrowLink } from "@/components/ui/primitives";

/**
 * The architectural project index: one ruled row per project, numbered like a drawing register.
 * Every published project in content/architecture/ appears here automatically.
 */
export function ArchitectureProjectList({ projects }: { projects: ArchitectureProject[] }) {
  return (
    <ol className="border-t border-rule" aria-label="Architectural projects">
      {projects.map((p) => {
        const img = p.thumbnail ?? p.hero;
        const meta = [p.projectType, p.location, p.status].filter(Boolean).join(" · ");
        return (
          <li key={p.slug} className="border-b border-rule">
            <Link
              href={p.href}
              className="group grid grid-cols-[2.25rem_1fr_auto] items-center gap-x-4 py-6 transition-colors hover:bg-paper-2 sm:grid-cols-[3rem_10rem_1fr_auto] sm:gap-x-8 sm:px-4 sm:py-7"
            >
              <span className="self-start pt-1 font-mono text-[0.75rem] text-accent-ink sm:self-center sm:pt-0">{pad(p.index)}</span>
              <span className="relative hidden aspect-[4/3] overflow-hidden border border-rule bg-paper-3 sm:block">
                {img && (
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="10rem"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    style={img.position ? { objectPosition: img.position } : undefined}
                  />
                )}
              </span>
              <span className="min-w-0">
                <span className="t-h3 block text-ink transition-colors group-hover:text-accent-ink">
                  {p.title}
                  {p.year && <span className="font-normal text-ink-3"> ({p.year})</span>}
                </span>
                {meta && <span className="t-label mt-2 block leading-relaxed">{meta}</span>}
              </span>
              <ArrowRight aria-hidden className="size-5 text-ink-3 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink" />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/** Empty state: a drawing register awaiting its first sheet. */
export function ArchitectureProjectListEmpty() {
  const kinds = GALLERY_KINDS.filter((k) => k !== "screenshot" && k !== "photo");
  return (
    <section aria-labelledby="index-title" className="border border-rule">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-4 py-3 sm:px-6">
        <h2 id="index-title" className="t-label text-ink-2">
          Sheet A-000 — Drawing index
        </h2>
        <p className="t-label flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden />
          In preparation
        </p>
      </div>
      <div className="drafting-grid px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl bg-paper/90 p-6 text-center sm:p-10">
          <p className="t-h3 text-ink">Selected architectural work is being prepared for publication.</p>
          <div className="mt-8 flex justify-center">
            <ArrowLink href="/contact">Ask about architectural work</ArrowLink>
          </div>
        </div>
      </div>
      <ul className={cn("flex flex-wrap gap-x-5 gap-y-2 border-t border-rule px-4 py-3 sm:px-6")} aria-label="Drawing types each project will include">
        {kinds.map((k) => (
          <li key={k} className="t-label">
            {k}s
          </li>
        ))}
      </ul>
    </section>
  );
}
