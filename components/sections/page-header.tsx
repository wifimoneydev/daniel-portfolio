import type { ReactNode } from "react";
import { Container } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/** Top-of-page header used by all inner pages. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
  aside,
  className,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("pt-12 pb-14 sm:pt-16 sm:pb-20 lg:pt-24", className)}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className={cn("anim-rise", aside ? "lg:col-span-8" : "lg:col-span-10")}>
            <p className="t-label">{eyebrow}</p>
            <h1 className="t-h1 mt-6 max-w-[18ch] text-ink">{title}</h1>
            {lead && <div className="t-lead mt-6 max-w-[60ch]">{lead}</div>}
            {children}
          </div>
          {aside && <div className="anim-fade lg:col-span-4 lg:pt-2">{aside}</div>}
        </div>
      </Container>
    </header>
  );
}

/** "DANIEL / TECH" eyebrow. */
export function BrandEyebrow({ section }: { section: string }) {
  return (
    <>
      Daniel <span className="text-accent-ink">/</span> {section}
    </>
  );
}
