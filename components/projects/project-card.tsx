import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProjectSummary } from "@/lib/content/loader";
import { cn, pad } from "@/lib/utils";

/**
 * Standard project card used by the library, related projects and compact lists.
 * Works without any imagery: falls back to a typographic plate.
 * Plain (no hooks) so it can render in both server and client trees.
 */
export function ProjectCard({ project, className, headingLevel = "h3" }: { project: ProjectSummary; className?: string; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const label = project.discipline === "architecture" ? "Architecture" : "Project";
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative aspect-[16/10] overflow-hidden border border-rule bg-paper-2">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            style={project.thumbnail.position ? { objectPosition: project.thumbnail.position } : undefined}
          />
        ) : (
          <div className="drafting-grid flex size-full flex-col justify-between p-5">
            <span className="t-label">
              {label} {pad(project.index)}
            </span>
            <div>
              <p className="text-[1.6rem] font-medium tracking-[-0.03em] text-ink">{project.title}</p>
              {project.system.length > 0 && (
                <p className="mt-2 line-clamp-2 font-mono text-[0.6875rem] leading-relaxed text-ink-3">
                  {project.system.join("  →  ")}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <div className="t-label flex flex-wrap gap-x-3 gap-y-1">
          <span className="text-accent-ink">
            {label} {pad(project.index)}
          </span>
          {project.year && <span>{project.year}</span>}
          <span>{project.categories.join(" · ")}</span>
        </div>
        <Heading className="t-h3 mt-3 text-ink">
          <Link href={project.href} className="after:absolute after:inset-0 after:content-['']">
            {project.title}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-3 text-[0.9375rem] leading-relaxed text-ink-2">{project.summary}</p>
        <p aria-hidden className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-ink transition-colors group-hover:text-accent-ink">
          View project <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </p>
      </div>
    </article>
  );
}
