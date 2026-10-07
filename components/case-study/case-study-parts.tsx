import type { ReactNode } from "react";
import { cn, pad } from "@/lib/utils";

/** Results / evaluation figures. Only values present in project data are shown. */
export function MetricsGrid({
  metrics,
  className,
}: {
  metrics: { label: string; value: string; context?: string }[];
  className?: string;
}) {
  if (!metrics.length) return null;
  return (
    <dl className={cn("grid grid-cols-2 border-l border-t border-rule", metrics.length >= 3 && "md:grid-cols-3", className)}>
      {metrics.map((m) => (
        <div key={m.label} className="flex flex-col border-b border-r border-rule p-4 sm:p-5">
          <dt className="order-2 mt-3 text-[0.875rem] leading-snug text-ink-2">{m.label}</dt>
          <dd className="order-1 text-[clamp(1.75rem,1.3rem+1.6vw,2.6rem)] font-medium leading-none tracking-[-0.04em] text-ink tabular-nums">
            {m.value}
          </dd>
          {m.context && <dd className="order-3 mt-1 text-[0.75rem] leading-snug text-ink-3">{m.context}</dd>}
        </div>
      ))}
    </dl>
  );
}

/** Numbered decision list: title + rationale. */
export function DecisionList({ items }: { items: { title: string; detail: string }[] }) {
  if (!items.length) return null;
  return (
    <ol className="border-t border-rule">
      {items.map((d, i) => (
        <li key={d.title} className="grid gap-2 border-b border-rule py-5 sm:grid-cols-[3rem_1fr] sm:gap-4">
          <span className="font-mono text-[0.75rem] text-accent-ink">D{pad(i + 1)}</span>
          <div>
            <p className="font-medium tracking-[-0.01em] text-ink">{d.title}</p>
            <p className="mt-1.5 max-w-[68ch] leading-relaxed text-ink-2">{d.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Plain list with a small marker. */
export function NoteList({ items, marker = "—" }: { items: string[]; marker?: string }) {
  if (!items.length) return null;
  return (
    <ul className="max-w-[68ch] space-y-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3 leading-relaxed text-ink-2">
          <span aria-hidden className="shrink-0 font-mono text-[0.8125rem] leading-[1.7] text-ink-3">
            {marker}
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

/** A case-study section with its number and title in a left rail on large screens. */
export function CaseSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-rule pt-6 pb-14 first:border-t-0 first:pt-0 sm:pb-16">
      <p className="t-label">
        <span className="text-accent-ink">{pad(number)}</span>
      </p>
      <h2 id={`${id}-title`} className="t-h3 mt-2 text-ink">
        {title}
      </h2>
      <div className="mt-6 space-y-8">{children}</div>
    </section>
  );
}
