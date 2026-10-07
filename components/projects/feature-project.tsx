import Image from "next/image";
import Link from "next/link";
import { Github } from "@/components/ui/icons";
import { ArrowLink, TagList } from "@/components/ui/primitives";
import type { TechProject } from "@/lib/content/loader";
import { cn, pad } from "@/lib/utils";
import { SystemDiagram } from "./system-diagram";

/**
 * Large editorial presentation for a featured project.
 * Uses the real thumbnail when one exists, otherwise the system diagram.
 */
export function FeatureProject({
  project,
  reverse = false,
  headingLevel = "h3",
}: {
  project: TechProject;
  reverse?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article className="reveal grid gap-8 border-t border-rule pt-8 lg:grid-cols-12 lg:gap-12 lg:pt-10">
      <div className={cn("flex flex-col lg:col-span-5", reverse && "lg:order-2")}>
        <p className="t-label">
          <span className="text-accent-ink">Project {pad(project.index)}</span>
          <span aria-hidden> / </span>
          {project.title}
        </p>
        <Heading className="t-h2 mt-5 text-ink">
          <Link href={project.href} className="hover:text-accent-ink">
            {project.title}
          </Link>
        </Heading>
        {project.projectType && <p className="mt-2 text-ink-3">{project.projectType}</p>}
        <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-2">{project.summary}</p>

        {project.highlights.length > 0 && (
          <ul className="mt-6 space-y-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-[0.9375rem] text-ink">
                <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                {h}
              </li>
            ))}
          </ul>
        )}

        <TagList items={project.tools} max={7} className="mt-7" />

        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 lg:mt-auto lg:pt-8">
          <ArrowLink href={project.href}>Read the case study</ArrowLink>
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-[0.9375rem] text-ink-2 hover:text-ink"
            >
              <Github className="size-4" />
              <span className="link">Source</span>
              <span className="sr-only"> — {project.title} on GitHub (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>

      <div className={cn("lg:col-span-7", reverse && "lg:order-1")}>
        {project.thumbnail ? (
          <Link href={project.href} tabIndex={-1} aria-hidden className="group block overflow-hidden border border-rule bg-paper-2">
            <Image
              src={project.thumbnail.src}
              alt=""
              width={project.thumbnail.width}
              height={project.thumbnail.height}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]"
            />
          </Link>
        ) : (
          <SystemDiagram steps={project.system} layout="grid" figure={`Fig. ${pad(project.index)}`} title={`${project.title} — system overview`} />
        )}
      </div>
    </article>
  );
}
