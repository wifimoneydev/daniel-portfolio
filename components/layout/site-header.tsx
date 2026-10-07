"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type MouseEvent } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { brandSuffix, isActive, navItems } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";
import { cn, pad } from "@/lib/utils";

type HeaderProps = {
  name: string;
  shortName: string;
  resumeHref?: string;
  availability?: { label: string; detail?: string };
  contactLinks: { label: string; href: string; external: boolean }[];
};

/**
 * Following a link to the page you're already on changes no route, so Next.js
 * keeps the scroll position. For primary navigation we instead close the menu
 * and return to the top. Modified clicks (new tab etc.) are left alone.
 */
function useReturnToTop(onBeforeScroll?: () => void) {
  const pathname = usePathname();
  return (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== href || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onBeforeScroll?.();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Wait a frame so the menu's scroll lock is released before scrolling.
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  };
}

function BrandMark({
  shortName,
  suffix,
  name,
  onNavigate,
}: {
  shortName: string;
  suffix?: string;
  name: string;
  onNavigate?: (e: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  return (
    <Link href="/" onClick={(e) => onNavigate?.(e, "/")} className="group inline-flex items-baseline gap-1.5 text-[0.95rem] font-semibold tracking-[-0.01em] text-ink" aria-label={`${name} — home`}>
      <span className="uppercase tracking-[0.04em]">{shortName}</span>
      {suffix && (
        <span className="anim-fade inline-flex items-baseline gap-1.5 font-mono text-[0.7rem] font-normal uppercase tracking-[0.08em] text-ink-3">
          <span aria-hidden className="text-accent">/</span>
          {suffix}
        </span>
      )}
    </Link>
  );
}

export function SiteHeader({ name, shortName, resumeHref, availability, contactLinks }: HeaderProps) {
  const pathname = usePathname();
  const suffix = brandSuffix(pathname);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnToTop = useReturnToTop(() => dialogRef.current?.close());

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur-md supports-[backdrop-filter]:bg-paper/80">
      <div className="mx-auto flex h-16 w-full max-w-[1360px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <BrandMark shortName={shortName} suffix={suffix} name={name} onNavigate={returnToTop} />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={(e) => returnToTop(e, item.href)}
                    className={cn(
                      "relative inline-flex h-10 items-center px-3 text-[0.875rem] transition-colors",
                      active ? "text-ink" : "text-ink-2 hover:text-ink",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-3 -bottom-[13px] h-px origin-left bg-accent transition-transform duration-300",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          {resumeHref && (
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group mr-1 hidden h-9 items-center gap-1.5 rounded-[3px] border border-rule-strong px-3 text-[0.8125rem] text-ink transition-colors hover:border-ink lg:inline-flex"
            >
              View résumé
              <ArrowUpRight aria-hidden className="size-3.5 text-ink-3 transition-colors group-hover:text-ink" />
              <span className="sr-only"> (PDF, opens in a new tab)</span>
            </a>
          )}
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-[3px] px-2 text-[0.875rem] text-ink hover:bg-paper-2 lg:hidden"
            aria-haspopup="dialog"
            onClick={() => dialogRef.current?.showModal()}
          >
            <Menu aria-hidden className="size-5" />
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile menu — native <dialog> gives focus trapping, Esc to close and an inert background. */}
      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        className="mobile-menu m-0 h-dvh max-h-none w-full max-w-none bg-paper p-0 text-ink backdrop:bg-transparent lg:hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-rule px-5 sm:px-8">
            <BrandMark shortName={shortName} suffix={suffix} name={name} onNavigate={returnToTop} />
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              className="inline-flex h-10 items-center gap-2 rounded-[3px] px-2 text-[0.875rem] hover:bg-paper-2"
            >
              <X aria-hidden className="size-5" />
              <span>Close</span>
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 sm:px-8">
            <ul>
              {navItems.map((item, i) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href} className="menu-item border-b border-rule" style={{ animationDelay: `${60 + i * 35}ms` }}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={(e) => {
                        returnToTop(e, item.href);
                        dialogRef.current?.close();
                      }}
                      className="flex items-baseline gap-4 py-4"
                    >
                      <span className={cn("t-label w-6", active && "text-accent-ink")}>{pad(i + 1)}</span>
                      <span className={cn("text-[1.75rem] font-medium tracking-[-0.03em]", active ? "text-ink" : "text-ink-2")}>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-rule px-5 py-5 sm:px-8">
            {availability && (
              <p className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                <span className="size-2 rounded-full bg-ok" aria-hidden />
                <span className="font-medium">{availability.label}</span>
                {availability.detail && <span className="text-ink-3">· {availability.detail}</span>}
              </p>
            )}
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {resumeHref && (
                <li>
                  <a href={resumeHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink">
                    View résumé
                    <ArrowUpRight aria-hidden className="size-3" />
                    <span className="sr-only"> (PDF, opens in a new tab)</span>
                  </a>
                </li>
              )}
              {contactLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="inline-flex items-center gap-1 text-ink-2 hover:text-ink"
                    {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {l.label}
                    {l.external && <ArrowUpRight aria-hidden className="size-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </dialog>
    </header>
  );
}
