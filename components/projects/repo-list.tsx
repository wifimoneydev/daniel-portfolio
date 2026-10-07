import { ArrowUpRight } from "lucide-react";
import type { Repo } from "@/data/repos";
import { prettyUrl } from "@/lib/utils";

/** Compact list of selected repositories — deliberately lighter than case studies. */
export function RepoList({ repos }: { repos: Repo[] }) {
  if (!repos.length) return null;
  return (
    <ul className="border-t border-rule">
      {repos.map((r) => (
        <li key={r.url} className="border-b border-rule">
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid gap-2 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6"
          >
            <span className="font-mono text-[0.875rem] text-ink sm:col-span-3">
              <span className="link">{r.name}</span>
            </span>
            <span className="text-[0.9375rem] leading-relaxed text-ink-2 sm:col-span-6">{r.description}</span>
            <span className="flex items-center justify-between gap-3 sm:col-span-3 sm:justify-end">
              <span className="t-label">{r.tags?.slice(0, 2).join(" · ") ?? r.language}</span>
              <ArrowUpRight aria-hidden className="size-4 shrink-0 text-ink-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </span>
            <span className="sr-only">{prettyUrl(r.url)} (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
