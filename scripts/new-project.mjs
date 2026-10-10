#!/usr/bin/env node
/**
 * Scaffold a new project.
 *
 *   npm run new:project -- tech my-project
 *   npm run new:project -- architecture my-project
 *
 * Creates the content file (as a draft) and the image folder. Never overwrites.
 */
import fs from "node:fs";
import path from "node:path";

const [, , rawKind, rawSlug] = process.argv;
const root = process.cwd();

const fail = (msg) => {
  console.error(`\n  ✗ ${msg}\n`);
  console.error("  Usage:  npm run new:project -- tech my-project");
  console.error("          npm run new:project -- architecture my-project\n");
  process.exit(1);
};

const kind = rawKind?.toLowerCase();
if (!kind || !["tech", "architecture", "arch"].includes(kind)) fail(`First argument must be "tech" or "architecture" (got "${rawKind ?? ""}").`);
const isArch = kind !== "tech";

if (!rawSlug) fail("Missing project slug.");
const slug = rawSlug.trim().toLowerCase();
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  fail(`"${rawSlug}" is not a valid slug. Use lowercase letters, numbers and single hyphens, e.g. "my-project".`);
}

if (isArch && slug === "projects") fail(`"projects" is reserved for the /architecture/projects list page. Choose another slug.`);

// Slugs must be unique across both collections (they share the /projects library).
for (const dir of ["projects", "architecture"]) {
  if (fs.existsSync(path.join(root, "content", dir, slug))) {
    fail(`A project called "${slug}" already exists in content/${dir}/${slug}. Nothing was changed.`);
  }
}

const contentDir = path.join(root, "content", isArch ? "architecture" : "projects", slug);
const imageDir = path.join(root, "public", "images", isArch ? "architecture" : "projects", slug);
const title = slug
  .split("-")
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(" ");
const year = new Date().getFullYear();
const img = `/images/${isArch ? "architecture" : "projects"}/${slug}`;

const tech = `---
title: ${title}
summary: "TODO: one or two sentences — what it is and who it's for."
categories: [AI]          # any of: AI, Full Stack, NLP, Computer Vision, Experimental, Architecture + Technology
projectType: Web application
year: ${year}
# status: In progress     # Completed | In progress | Prototype | Concept | Archived
# role: Solo developer
tools: []                 # e.g. [Python, Flask, Next.js]
links: {}                 # e.g. { github: https://github.com/wifimoneydev/${slug}, live: https://... }
featured: false           # true = large presentation on Home and Tech
order: 100                # lower numbers appear first
draft: true               # set to false to publish

# thumbnail:              # optional — without it, the system diagram below is shown
#   src: ${img}/cover.png
#   alt: Describe what the screenshot shows
# gallery:
#   - src: ${img}/screen-1.png
#     alt: Describe the screen
#     caption: Optional caption
#     kind: screenshot

highlights: []            # 2–3 short, true facts for cards, e.g. "52 passing tests"
system: []                # pipeline steps for the diagram, e.g.
#  - label: Upload
#    detail: PDF or text
metrics: []               # only real, measured numbers, e.g.
#  - label: Passing tests
#    value: "52"
decisions: []             # - title: Short decision
                          #   detail: Why you made it
challenges: []
limitations: []
lessons: []
nextSteps: []
---

{/* Opening paragraph: what the project is, in plain language. */}

## Problem

{/* What problem does this solve, and for whom? */}

## What I built

## Technical approach

## Challenge

## Evaluation

{/* How you tested or measured it. Empty sections are hidden automatically. */}
`;

const arch = `---
title: ${title}
summary: "TODO: one or two sentences describing the project."
categories: [Architecture]   # add "Architecture + Technology" for interactive/3D work
projectType: "TODO: e.g. Residential, Academic studio project"
year: ${year}
# location: City, Country
# role: Designer
tools: []                    # design software used on this project
featured: false
order: 100
draft: true                  # set to false to publish (a hero image is required)

hero:
  src: ${img}/hero.jpg
  alt: Describe the image
  # caption: Optional caption
# thumbnail:                 # optional — defaults to the hero image
#   src: ${img}/thumb.jpg
#   alt: Describe the image
# concept: One-sentence design concept shown prominently.

gallery: []
#  - src: ${img}/ground-floor-plan.jpg
#    alt: Ground floor plan
#    caption: Ground floor plan
#    kind: plan              # render | plan | section | elevation | drawing | diagram | model | photo
---

{/* Project description: the brief, the site and the response. */}

## Concept

## Process
`;

fs.mkdirSync(contentDir, { recursive: true });
fs.writeFileSync(path.join(contentDir, "index.mdx"), isArch ? arch : tech, { flag: "wx" });
fs.mkdirSync(imageDir, { recursive: true });
const keep = path.join(imageDir, ".gitkeep");
if (!fs.existsSync(keep)) fs.writeFileSync(keep, "");

const rel = (p) => path.relative(root, p);
console.log(`
  ✓ Created ${isArch ? "architecture" : "tech"} project "${slug}" (draft)

    Content  ${rel(path.join(contentDir, "index.mdx"))}
    Images   ${rel(imageDir)}/

  Next:
    1. Fill in the frontmatter and sections in index.mdx
    2. Put images in the images folder${isArch ? " (a hero image is required to publish)" : ""}
    3. Preview drafts:  SHOW_DRAFTS=true npm run dev
    4. Publish: set draft: false
    → ${isArch ? `/architecture/${slug}` : `/projects/${slug}`}
`);
