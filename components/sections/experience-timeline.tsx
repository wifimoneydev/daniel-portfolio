import type { Experience } from "@/data/experience";
import { cn } from "@/lib/utils";

const period = (e: Experience) =>
  e.start ? `${e.start} – ${e.end ?? "Present"}` : (e.duration ?? "");

/**
 * Experience timeline.
 * `compact` = one line per role (home page); full = with highlights (About).
 */
export function ExperienceTimeline({ items, compact = false }: { items: Experience[]; compact?: boolean }) {
  if (!items.length) return null;
  return (
    <ol className="border-t border-rule">
      {items.map((e) => {
        const current = e.end === "Present";
        return (
          <li key={`${e.role}-${e.organization ?? ""}`} className={cn("reveal grid gap-2 border-b border-rule md:grid-cols-12 md:gap-8", compact ? "py-5" : "py-7 sm:py-8")}>
            <div className="md:col-span-3">
              <p className="t-mono flex items-center gap-2 text-ink-2">
                {current && <span className="size-1.5 rounded-full bg-accent" aria-hidden />}
                {period(e)}
              </p>
              {e.start && e.duration && <p className="t-label mt-1">{e.duration}</p>}
            </div>
            <div className="md:col-span-9">
              <h3 className="text-[1.0625rem] font-medium tracking-[-0.01em] text-ink">
                {e.role}
                {e.organization && <span className="text-ink-2"> · {e.organization}</span>}
              </h3>
              {e.location && <p className="mt-0.5 text-[0.875rem] text-ink-3">{e.location}</p>}
              {!compact && e.summary && <p className="mt-3 max-w-[68ch] leading-relaxed text-ink-2">{e.summary}</p>}
              {!compact && e.highlights.length > 0 && (
                <ul className="mt-4 max-w-[70ch] space-y-2">
                  {e.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-2">
                      <span aria-hidden className="mt-[0.75em] h-px w-2.5 shrink-0 bg-ink-3" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
