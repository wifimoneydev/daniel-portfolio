import { disciplines, getSkillGroups, skillName, type SkillGroup } from "@/data/skills";
import { pad } from "@/lib/utils";

/** Capabilities as a ruled specification table — no ratings, no bars. */
export function Capabilities({ groups, startIndex = 1 }: { groups: SkillGroup[]; startIndex?: number }) {
  if (!groups.length) return null;
  return (
    <dl className="border-t border-rule">
      {groups.map((g, i) => {
        const notes = g.items.filter((s): s is { name: string; note: string } => typeof s !== "string" && !!s.note);
        return (
          <div key={g.id} className="reveal grid gap-3 border-b border-rule py-5 sm:py-6 md:grid-cols-12 md:gap-8">
            <dt className="flex items-baseline gap-4 md:col-span-4">
              <span className="font-mono text-[0.6875rem] text-accent-ink">{pad(i + startIndex)}</span>
              <span className="font-medium tracking-[-0.01em] text-ink">{g.title}</span>
            </dt>
            <dd className="md:col-span-8">
              <ul className="flex flex-wrap gap-x-1 gap-y-1.5 text-[0.9375rem] text-ink-2">
                {g.items.map((s, j) => (
                  <li key={skillName(s)} className="inline-flex items-center">
                    {skillName(s)}
                    {j < g.items.length - 1 && (
                      <span aria-hidden className="ml-1 text-rule-strong">
                        /
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {notes.map((n) => (
                <p key={n.name} className="mt-3 max-w-[60ch] text-[0.8125rem] leading-relaxed text-ink-3">
                  <span className="text-ink-2">{n.name}:</span> {n.note}
                </p>
              ))}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

/**
 * Both disciplines, each under its own "DANIEL / …" marker.
 * Used where the full profile is shown (Home, About).
 */
export function DisciplineCapabilities() {
  const blocks = (["tech", "architecture"] as const)
    .map((d) => ({ id: d, ...disciplines[d], groups: getSkillGroups(d) }))
    .filter((b) => b.groups.length > 0);

  return (
    <div className="space-y-14 sm:space-y-16">
      {blocks.map((b) => (
        <div key={b.id}>
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="text-[1.0625rem] font-medium tracking-[-0.015em] text-ink">{b.title}</h3>
            <p className="t-label">
              Daniel <span className="text-accent-ink">/</span> {b.label}
            </p>
          </div>
          <Capabilities groups={b.groups} />
        </div>
      ))}
    </div>
  );
}
