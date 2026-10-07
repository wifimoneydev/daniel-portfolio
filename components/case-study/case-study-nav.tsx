"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn, pad } from "@/lib/utils";

type Item = { id: string; title: string };

/**
 * Case-study navigation.
 * Desktop: sticky list with the current section highlighted.
 * Mobile: a single collapsible row so it never eats the screen.
 */
export function CaseStudyNav({ items }: { items: Item[] }) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  const list = (onNavigate?: () => void) => (
    <ol className="space-y-0.5">
      {items.map((item, i) => {
        const active = current === item.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={onNavigate}
              aria-current={active ? "location" : undefined}
              className={cn(
                "group flex items-baseline gap-3 py-1.5 text-[0.875rem] transition-colors",
                active ? "text-ink" : "text-ink-3 hover:text-ink",
              )}
            >
              <span className={cn("font-mono text-[0.6875rem]", active ? "text-accent-ink" : "text-ink-3")}>{pad(i + 1)}</span>
              <span>{item.title}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      <nav aria-label="Case study sections" className="sticky top-24 hidden lg:block">
        <p className="t-label mb-4">Contents</p>
        {list()}
      </nav>

      <details className="group/toc border-y border-rule lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 text-[0.9375rem] text-ink [&::-webkit-details-marker]:hidden">
          <span className="t-label">Contents · {items.length} sections</span>
          <ChevronDown aria-hidden className="size-4 text-ink-3 transition-transform group-open/toc:rotate-180" />
        </summary>
        <nav aria-label="Case study sections" className="pb-4">
          {list()}
        </nav>
      </details>
    </>
  );
}
