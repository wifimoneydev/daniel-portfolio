import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn, isExternal } from "@/lib/utils";

/* ---------------------------------------------------------------- Container */

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-12", className)} {...props} />;
}

/* ---------------------------------------------------------------- Section */

/**
 * Numbered section with a hairline header row: "01 — Selected Work".
 */
export function Section({
  id,
  number,
  label,
  title,
  action,
  children,
  className,
  headerClassName,
}: {
  id?: string;
  number?: string;
  label: string;
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section id={id} aria-labelledby={title ? headingId : undefined} aria-label={title ? undefined : label} className={cn("py-16 sm:py-20 lg:py-24", className)}>
      <Container>
        <div className={cn("mb-10 border-t border-rule pt-4 sm:mb-14", headerClassName)}>
          <div className="flex items-baseline justify-between gap-6">
            <p className="t-label">
              {number && <span className="text-accent-ink">{number}</span>}
              {number && <span aria-hidden> — </span>}
              {label}
            </p>
            {action && <div className="hidden shrink-0 sm:block">{action}</div>}
          </div>
          {title && (
            <h2 id={headingId} className="t-h2 mt-6 max-w-[22ch] text-ink">
              {title}
            </h2>
          )}
        </div>
        {children}
        {action && <div className="mt-10 sm:hidden">{action}</div>}
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Links & buttons */

type ButtonVariant = "primary" | "secondary" | "ghost";

const buttonBase =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-[3px] px-5 text-[0.9375rem] font-medium tracking-[-0.01em] transition-[background-color,color,border-color,transform] duration-200 active:translate-y-px";
const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-paper hover:bg-accent hover:text-white",
  secondary: "border border-rule-strong text-ink hover:border-ink",
  ghost: "px-0 text-ink hover:text-accent-ink",
};

export function ButtonLink({
  href,
  variant = "primary",
  icon = "arrow",
  className,
  children,
  download,
  newTab = false,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  icon?: "arrow" | "external" | "none" | ReactNode;
  className?: string;
  children: ReactNode;
  download?: boolean | string;
  /** Open in a new tab (e.g. viewing a PDF in the browser). External links always do. */
  newTab?: boolean;
} & Omit<ComponentProps<"a">, "href" | "children">) {
  const external = isExternal(href) || newTab;
  const iconEl =
    icon === "arrow" ? (
      <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    ) : icon === "external" ? (
      <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    ) : icon === "none" ? null : (
      icon
    );
  const cls = cn(buttonBase, buttonVariants[variant], className);
  const content = (
    <>
      <span>{children}</span>
      {iconEl}
    </>
  );
  if (external || download || href.startsWith("mailto:") || href.startsWith("tel:") || href.endsWith(".pdf")) {
    return (
      <a
        href={href}
        className={cls}
        download={download}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {content}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}

/** Inline text link with an arrow. External links open in a new tab. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const external = isExternal(href);
  const Icon = external ? ArrowUpRight : ArrowRight;
  const inner = (
    <>
      <span className="link">{children}</span>
      <Icon aria-hidden className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );
  const cls = cn("group inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-ink hover:text-accent-ink", className);
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/* ---------------------------------------------------------------- Tags */

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-[2px] border border-rule px-2 py-[3px] font-mono text-[0.6875rem] leading-none tracking-[0.02em] text-ink-2", className)}>
      {children}
    </span>
  );
}

export function TagList({ items, className, max }: { items: string[]; className?: string; max?: number }) {
  const shown = max ? items.slice(0, max) : items;
  const rest = max ? items.length - shown.length : 0;
  if (!items.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Technologies">
      {shown.map((t) => (
        <li key={t}>
          <Tag>{t}</Tag>
        </li>
      ))}
      {rest > 0 && (
        <li>
          <Tag className="border-transparent text-ink-3">+{rest}</Tag>
        </li>
      )}
    </ul>
  );
}

/* ---------------------------------------------------------------- Availability */

export function Availability({ label, detail, className }: { label: string; detail?: string; className?: string }) {
  return (
    <p className={cn("inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm", className)}>
      <span className="inline-flex items-center gap-2 font-medium text-ink">
        <span className="relative flex size-2" aria-hidden>
          <span className="status-ping absolute inline-flex size-full rounded-full bg-ok" />
          <span className="relative inline-flex size-2 rounded-full bg-ok" />
        </span>
        {label}
      </span>
      {detail && <span className="text-ink-3">{detail}</span>}
    </p>
  );
}

/* ---------------------------------------------------------------- Title block */

/**
 * A metadata grid styled after an architectural drawing's title block.
 * Rows with empty values are skipped.
 */
export function TitleBlock({
  items,
  className,
  columns = 2,
}: {
  items: Array<{ label: string; value?: ReactNode }>;
  className?: string;
  columns?: 2 | 3 | 4;
}) {
  const rows = items.filter((i) => i.value !== undefined && i.value !== null && i.value !== "");
  if (!rows.length) return null;
  const cols = { 2: "grid-cols-2", 3: "grid-cols-2 lg:grid-cols-3", 4: "grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <dl className={cn("grid border-l border-t border-rule", cols, className)}>
      {rows.map((r) => (
        <div key={r.label} className="border-b border-r border-rule px-4 py-3">
          <dt className="t-label">{r.label}</dt>
          <dd className="mt-1.5 min-w-0 break-words text-[0.9375rem] leading-snug text-ink">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
