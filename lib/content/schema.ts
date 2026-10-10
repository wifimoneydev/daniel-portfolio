import { z } from "zod";

/**
 * Project frontmatter schemas.
 * Every project file is validated against these at build/dev time —
 * a typo or missing required field fails with a clear message.
 */

export const CATEGORIES = [
  "AI",
  "Full Stack",
  "NLP",
  "Computer Vision",
  "Architecture",
  "Experimental",
  "Architecture + Technology",
] as const;

export const STATUSES = ["Completed", "In progress", "Prototype", "Concept", "Conceptual design", "Archived"] as const;

export const GALLERY_KINDS = [
  "render",
  "plan",
  "section",
  "elevation",
  "drawing",
  "diagram",
  "model",
  "photo",
  "screenshot",
] as const;

const imageSchema = z.object({
  src: z.string().startsWith("/", "Image paths must start with “/” (relative to /public), e.g. /images/projects/my-project/cover.png"),
  alt: z.string().min(3, "Every image needs meaningful alt text"),
  caption: z.string().optional(),
  /** Optional CSS object-position for cropped displays, e.g. "50% 100%". */
  position: z.string().optional(),
});

const galleryItemSchema = imageSchema.extend({
  kind: z.enum(GALLERY_KINDS).default("photo"),
});

const linkSchema = z.object({
  github: z.url().optional(),
  live: z.url().optional(),
  demo: z.url().optional(),
  docs: z.url().optional(),
  repos: z.array(z.object({ label: z.string(), url: z.url() })).optional(),
});

const baseSchema = z.object({
  title: z.string().min(1),
  /** Optional override; defaults to the folder name. */
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  summary: z.string().min(10, "Write a one or two sentence summary"),
  categories: z.array(z.enum(CATEGORIES)).min(1, "Pick at least one category"),
  projectType: z.string().optional(),
  status: z.enum(STATUSES).optional(),
  year: z.union([z.string(), z.number()]).transform(String).optional(),
  role: z.string().optional(),
  tools: z.array(z.string()).default([]),
  thumbnail: imageSchema.optional(),
  /** Image shown only on the Work library page (/projects). Not used anywhere else. */
  workThumbnail: imageSchema.optional(),
  gallery: z.array(galleryItemSchema).default([]),
  links: linkSchema.default({}),
  featured: z.boolean().default(false),
  order: z.number().default(100),
  related: z.array(z.string()).default([]),
  seo: z
    .object({ title: z.string().optional(), description: z.string().optional() })
    .default({}),
  draft: z.boolean().default(false),
});

export const techProjectSchema = baseSchema.extend({
  /** System overview drawn as a diagram when no screenshot exists. */
  system: z
    .array(z.object({ label: z.string(), detail: z.string().optional() }))
    .default([]),
  metrics: z
    .array(z.object({ label: z.string(), value: z.string(), context: z.string().optional() }))
    .default([]),
  /** Short "headline" facts for cards (2–3 recommended). Must be real. */
  highlights: z.array(z.string()).default([]),
  decisions: z.array(z.object({ title: z.string(), detail: z.string() })).default([]),
  challenges: z.array(z.string()).default([]),
  lessons: z.array(z.string()).default([]),
  limitations: z.array(z.string()).default([]),
  nextSteps: z.array(z.string()).default([]),
});

export const architectureProjectSchema = baseSchema
  .extend({
    location: z.string().optional(),
    /** When the design was completed, as precise as known, e.g. "April 2024". */
    completion: z.string().optional(),
    hero: imageSchema.optional(),
    concept: z.string().optional(),
    /** Downloads you explicitly choose to publish (e.g. a PDF board). */
    downloads: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  })
  .refine((p) => p.draft || p.hero, {
    message: "Published architecture projects need a `hero` image (or set draft: true)",
    path: ["hero"],
  });

export type TechFrontmatter = z.infer<typeof techProjectSchema>;
export type ArchitectureFrontmatter = z.infer<typeof architectureProjectSchema>;
export type Category = (typeof CATEGORIES)[number];
export type GalleryKind = (typeof GALLERY_KINDS)[number];
