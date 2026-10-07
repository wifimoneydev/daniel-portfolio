import { ArrowRight } from "lucide-react";
import { cn, pad } from "@/lib/utils";

type Step = { label: string; detail?: string };

/**
 * A typographic system diagram drawn from project data.
 * Used where real screenshots don't exist yet — it is clearly a diagram,
 * never a fake product screenshot.
 */
export function SystemDiagram({
  steps,
  layout = "flow",
  figure,
  className,
  title = "System overview",
}: {
  steps: Step[];
  layout?: "flow" | "grid";
  figure?: string;
  title?: string;
  className?: string;
}) {
  if (!steps.length) return null;

  return (
    <figure className={cn("w-full", className)}>
      <div className="drafting-grid border border-rule p-4 sm:p-6">
        {layout === "grid" ? (
          <ol className="grid grid-cols-2 gap-2 sm:gap-3">
            {steps.map((s, i) => (
              <li key={s.label} className="flex min-h-[5.5rem] flex-col justify-between border border-rule bg-paper p-3 sm:p-4">
                <span className="font-mono text-[0.6875rem] text-accent-ink">{pad(i + 1)}</span>
                <span className="mt-3 text-[0.875rem] font-medium leading-tight tracking-[-0.01em] text-ink sm:text-[0.9375rem]">{s.label}</span>
                {s.detail && <span className="mt-1 hidden text-[0.75rem] leading-snug text-ink-3 sm:block">{s.detail}</span>}
              </li>
            ))}
          </ol>
        ) : (
          <ol className="grid grid-cols-2 gap-2 sm:gap-3 lg:flex lg:flex-row lg:items-stretch lg:gap-0">
            {steps.map((s, i) => (
              <li key={s.label} className="flex lg:flex-1 lg:flex-row lg:items-center">
                <div className="w-full flex-1 border border-rule bg-paper p-3 lg:h-full lg:p-4">
                  <span className="font-mono text-[0.6875rem] text-accent-ink">{pad(i + 1)}</span>
                  <p className="mt-2 text-[0.9375rem] font-medium leading-tight tracking-[-0.01em] text-ink">{s.label}</p>
                  {s.detail && <p className="mt-1 text-[0.8125rem] leading-snug text-ink-3">{s.detail}</p>}
                </div>
                {i < steps.length - 1 && (
                  <span aria-hidden className="hidden items-center justify-center px-1 text-ink-3 lg:flex">
                    <ArrowRight className="size-3.5" />
                  </span>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
      <figcaption className="t-label mt-3 flex flex-wrap justify-between gap-2">
        <span>
          {figure && <span className="text-ink-2">{figure} — </span>}
          {title}
        </span>
        <span>Diagram</span>
      </figcaption>
    </figure>
  );
}
