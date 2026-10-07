import { ArrowRight, ArrowUpRight, Mail, Phone } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { getContactActions, type ContactAction } from "@/data/social";
import { Github, Linkedin, Upwork, Whatsapp } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  email: Mail,
  whatsapp: Whatsapp,
  phone: Phone,
  linkedin: Linkedin,
  github: Github,
  upwork: Upwork,
};

/** Ruled list of contact actions: icon · action · value · arrow. */
export function ContactActions({ only, className }: { only?: ContactAction["id"][]; className?: string }) {
  const actions = getContactActions().filter((a) => !only || only.includes(a.id));
  return (
    <ul className={cn("border-t border-rule", className)}>
      {actions.map((a) => {
        const Icon = ICONS[a.id] ?? ArrowRight;
        const Arrow = a.external ? ArrowUpRight : ArrowRight;
        return (
          <li key={a.id} className="border-b border-rule">
            <a
              href={a.href}
              className="group grid grid-cols-[1.5rem_1fr_auto] items-center gap-x-4 gap-y-0.5 py-4 sm:grid-cols-[1.5rem_14rem_1fr_auto] sm:py-5"
              {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <Icon aria-hidden className="size-[18px] text-ink-3 transition-colors group-hover:text-accent" />
              <span className="font-medium text-ink">{a.action}</span>
              <span className="col-start-2 row-start-2 min-w-0 break-words text-[0.875rem] text-ink-3 sm:col-start-3 sm:row-start-1 sm:text-[0.9375rem] sm:text-ink-2">
                {a.value}
              </span>
              <Arrow
                aria-hidden
                className="col-start-3 row-span-2 row-start-1 size-4 text-ink-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-ink sm:col-start-4 sm:row-span-1"
              />
              {a.external && <span className="sr-only">(opens in a new tab)</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
