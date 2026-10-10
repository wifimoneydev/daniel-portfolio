import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import {
  architectureProjectSchema,
  techProjectSchema,
  type ArchitectureFrontmatter,
  type Category,
  type GalleryKind,
  type TechFrontmatter,
} from "./schema";
import { resolveImage, type ResolvedImage } from "./images";
import { splitSections, type BodySection } from "./sections";

/**
 * Content loader.
 *
 *   content/projects/<slug>/index.mdx      → tech projects    → /projects/<slug>
 *   content/architecture/<slug>/index.mdx  → architecture     → /architecture/<slug>
 *
 * Folders starting with "_" (like _template) are ignored.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");
const SHOW_DRAFTS = process.env.SHOW_DRAFTS === "true";

export type GalleryImage = ResolvedImage & { kind: GalleryKind };

type Shared = {
  slug: string;
  href: string;
  /** 1-based position within its discipline, used for "PROJECT 01" labels. */
  index: number;
  intro: string;
  sections: BodySection[];
  thumbnail?: ResolvedImage & { position?: string };
  workThumbnail?: ResolvedImage & { position?: string };
  gallery: GalleryImage[];
};

export type TechProject = Omit<TechFrontmatter, "thumbnail" | "workThumbnail" | "gallery"> &
  Shared & { discipline: "tech" };

export type ArchitectureProject = Omit<ArchitectureFrontmatter, "thumbnail" | "workThumbnail" | "gallery" | "hero"> &
  Shared & { discipline: "architecture"; hero?: ResolvedImage & { position?: string } };

export type Project = TechProject | ArchitectureProject;

function readCollection<S extends z.ZodType>(dir: string, schema: S) {
  const root = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(root)) return [];

  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
    .flatMap((d) => {
      const file = ["index.mdx", "index.md"].map((f) => path.join(root, d.name, f)).find(fs.existsSync);
      if (!file) return [];
      const raw = fs.readFileSync(file, "utf8");
      const { data, content } = matter(raw);
      const parsed = schema.safeParse(data);
      const rel = path.relative(process.cwd(), file);
      if (!parsed.success) {
        const issues = parsed.error.issues
          .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
          .join("\n");
        throw new Error(`[content] Invalid frontmatter in ${rel}\n${issues}`);
      }
      const fm = parsed.data as z.infer<S> & { slug?: string; draft: boolean };
      return [{ folder: d.name, fm, body: content, rel }];
    })
    .filter((e) => SHOW_DRAFTS || !e.fm.draft);
}

const byOrder = (a: { order: number; year?: string; title: string }, b: { order: number; year?: string; title: string }) =>
  a.order - b.order || (b.year ?? "").localeCompare(a.year ?? "") || a.title.localeCompare(b.title);

function loadTech(): TechProject[] {
  return readCollection("projects", techProjectSchema)
    .map(({ folder, fm, body, rel }) => {
      const slug = fm.slug ?? folder;
      const { intro, sections } = splitSections(body);
      return {
        ...fm,
        discipline: "tech" as const,
        slug,
        href: `/projects/${slug}`,
        index: 0,
        intro,
        sections,
        thumbnail: fm.thumbnail ? resolveImage(fm.thumbnail, `${rel} thumbnail`) : undefined,
        workThumbnail: fm.workThumbnail ? resolveImage(fm.workThumbnail, `${rel} workThumbnail`) : undefined,
        gallery: fm.gallery.map((g, i) => resolveImage(g, `${rel} gallery[${i}]`)),
      };
    })
    .sort(byOrder)
    .map((p, i) => ({ ...p, index: i + 1 }));
}

function loadArchitecture(): ArchitectureProject[] {
  return readCollection("architecture", architectureProjectSchema)
    .map(({ folder, fm, body, rel }) => {
      const slug = fm.slug ?? folder;
      const { intro, sections } = splitSections(body);
      return {
        ...fm,
        discipline: "architecture" as const,
        slug,
        href: `/architecture/${slug}`,
        index: 0,
        intro,
        sections,
        hero: fm.hero ? resolveImage(fm.hero, `${rel} hero`) : undefined,
        thumbnail: fm.thumbnail ? resolveImage(fm.thumbnail, `${rel} thumbnail`) : undefined,
        workThumbnail: fm.workThumbnail ? resolveImage(fm.workThumbnail, `${rel} workThumbnail`) : undefined,
        gallery: fm.gallery.map((g, i) => resolveImage(g, `${rel} gallery[${i}]`)),
      };
    })
    .sort(byOrder)
    .map((p, i) => ({ ...p, index: i + 1 }));
}

/* In production content is read once; in development it is re-read so edits show up immediately. */
let memo: { tech: TechProject[]; architecture: ArchitectureProject[] } | null = null;

function load() {
  if (memo && process.env.NODE_ENV === "production") return memo;
  const tech = loadTech();
  const architecture = loadArchitecture();
  const seen = new Set<string>();
  for (const p of architecture) {
    if (p.slug === "projects") throw new Error(`[content] "projects" is reserved (it is the /architecture/projects list page). Rename that project's folder.`);
  }
  for (const p of [...tech, ...architecture]) {
    if (seen.has(p.slug)) throw new Error(`[content] Duplicate project slug "${p.slug}". Slugs must be unique.`);
    seen.add(p.slug);
  }
  memo = { tech, architecture };
  return memo;
}

export const getTechProjects = () => load().tech;
export const getArchitectureProjects = () => load().architecture;
export const getAllProjects = (): Project[] => [...load().tech, ...load().architecture];

export const getTechProject = (slug: string) => load().tech.find((p) => p.slug === slug);
export const getArchitectureProject = (slug: string) => load().architecture.find((p) => p.slug === slug);

export const getFeaturedProjects = () => load().tech.filter((p) => p.featured);

/** Categories that are actually used by visible projects, in canonical order. */
export function getUsedCategories(projects: Project[] = getAllProjects()): Category[] {
  const used = new Set(projects.flatMap((p) => p.categories));
  return (["AI", "Full Stack", "NLP", "Computer Vision", "Architecture", "Experimental", "Architecture + Technology"] as const).filter(
    (c) => used.has(c),
  );
}

/**
 * Related projects: uses the explicit `related` list when present,
 * otherwise ranks by shared categories (×3), shared tools (×1) and same discipline (×1).
 */
export function getRelatedProjects(project: Project, limit = 3): Project[] {
  const all = getAllProjects().filter((p) => p.slug !== project.slug);
  if (project.related.length) {
    return project.related.map((s) => all.find((p) => p.slug === s)).filter((p): p is Project => !!p).slice(0, limit);
  }
  const tools = new Set(project.tools.map((t) => t.toLowerCase()));
  return all
    .map((p) => ({
      p,
      score:
        p.categories.filter((c) => project.categories.includes(c)).length * 3 +
        p.tools.filter((t) => tools.has(t.toLowerCase())).length +
        (p.discipline === project.discipline ? 1 : 0),
    }))
    .filter((x) => x.score > 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

/** Lightweight shape for client components (the filterable library). */
export type ProjectSummary = {
  slug: string;
  href: string;
  title: string;
  summary: string;
  discipline: Project["discipline"];
  categories: Category[];
  projectType?: string;
  year?: string;
  status?: string;
  tools: string[];
  index: number;
  thumbnail?: ResolvedImage & { position?: string };
  system: string[];
};

/**
 * `context: "work"` is used only by the Work library page: there, a project's
 * `workThumbnail` (if any) is shown. Everywhere else the regular thumbnail rules apply.
 */
export function toSummary(p: Project, opts: { context?: "work" } = {}): ProjectSummary {
  const regular = p.discipline === "architecture" ? (p.thumbnail ?? p.hero) : p.thumbnail;
  return {
    slug: p.slug,
    href: p.href,
    title: p.title,
    summary: p.summary,
    discipline: p.discipline,
    categories: p.categories,
    projectType: p.projectType,
    year: p.year,
    status: p.status,
    tools: p.tools,
    index: p.index,
    thumbnail: (opts.context === "work" && p.workThumbnail) || regular,
    system: p.discipline === "tech" ? p.system.map((s) => s.label) : [],
  };
}
