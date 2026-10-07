export type NavItem = { href: string; label: string; brand?: string };

/** Primary navigation. `brand` is the "DANIEL / …" suffix shown when inside that section. */
export const navItems: NavItem[] = [
  { href: "/projects", label: "Work" },
  { href: "/tech", label: "Tech", brand: "Tech" },
  { href: "/architecture", label: "Architecture", brand: "Architecture" },
  { href: "/lab", label: "Lab", brand: "Lab" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Resolves the section suffix for the brand mark from the current path. */
export function brandSuffix(pathname: string) {
  if (pathname.startsWith("/architecture")) return "Architecture";
  if (pathname.startsWith("/lab")) return "Lab";
  // Tech landing page and individual tech case studies (/projects/<slug>)
  if (pathname.startsWith("/tech") || pathname.startsWith("/projects/")) return "Tech";
  return undefined;
}
