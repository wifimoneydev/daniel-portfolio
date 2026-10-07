"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProjectSummary } from "@/lib/content/loader";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./project-card";

const ALL = "All";

/**
 * Filterable work library. Filter state is mirrored to ?category= so a
 * filtered view can be shared, without making the page dynamic.
 */
export function ProjectLibrary({ projects, categories }: { projects: ProjectSummary[]; categories: string[] }) {
  const [active, setActive] = useState<string>(ALL);

  // Read the initial filter from the URL after hydration.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("category");
    if (fromUrl && categories.includes(fromUrl)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL
      setActive(fromUrl);
    }
  }, [categories]);

  function select(cat: string) {
    setActive(cat);
    const url = new URL(window.location.href);
    if (cat === ALL) url.searchParams.delete("category");
    else url.searchParams.set("category", cat);
    window.history.replaceState(null, "", url);
  }

  const visible = useMemo(
    () => (active === ALL ? projects : projects.filter((p) => p.categories.includes(active as ProjectSummary["categories"][number]))),
    [active, projects],
  );

  const showFilters = categories.length > 1;

  return (
    <div>
      {showFilters && (
        <div className="mb-10 flex flex-col gap-4 border-b border-rule pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label="Filter projects by category" className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            {[ALL, ...categories].map((cat) => {
              const pressed = active === cat;
              const count = cat === ALL ? projects.length : projects.filter((p) => p.categories.includes(cat as ProjectSummary["categories"][number])).length;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => select(cat)}
                  className={cn(
                    "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[0.875rem] transition-colors",
                    pressed ? "border-ink bg-ink text-paper" : "border-rule-strong text-ink-2 hover:border-ink hover:text-ink",
                  )}
                >
                  {cat}
                  <span className={cn("font-mono text-[0.6875rem]", pressed ? "text-paper/70" : "text-ink-3")}>{count}</span>
                </button>
              );
            })}
          </div>
          <p className="t-label shrink-0" aria-live="polite">
            {visible.length} {visible.length === 1 ? "project" : "projects"}
          </p>
        </div>
      )}

      <ul key={active} className="anim-fade grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:gap-x-12">
        {visible.map((p) => (
          <li key={p.slug} className="flex">
            <ProjectCard project={p} className="w-full" headingLevel="h2" />
          </li>
        ))}
      </ul>
    </div>
  );
}
