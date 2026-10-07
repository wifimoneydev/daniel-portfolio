# Adding projects

Every project is **one folder with one file** (`index.mdx`) plus its images. The site generates the card, the page, the metadata, the Open Graph image, the category filters, the sitemap entry and related projects from that file. No component changes are needed.

| Kind         | Content file                               | Images folder                          | Page URL                   |
| ------------ | ------------------------------------------ | -------------------------------------- | -------------------------- |
| Tech         | `content/projects/<slug>/index.mdx`        | `public/images/projects/<slug>/`       | `/projects/<slug>`         |
| Architecture | `content/architecture/<slug>/index.mdx`    | `public/images/architecture/<slug>/`   | `/architecture/<slug>`     |

**Restart or rebuild?**
- With `npm run dev` running, saving the file is enough. Refresh the browser.
- The live site needs a new production build (`npm run build`), which your host runs on deploy.

---

## 1. Add a Tech project

```bash
npm run new:project -- tech my-project
```

This creates `content/projects/my-project/index.mdx` (as a **draft**) and `public/images/projects/my-project/`. Then:

1. Open `index.mdx` and fill in the top section (the "frontmatter" between the `---` lines).
2. Write the case study under the headings below it.
3. Set `draft: false` to publish.

Slugs must use lowercase letters, numbers and hyphens (`my-project`). The command refuses to overwrite an existing project.

### Minimal example

```yaml
---
title: Invoice Parser
summary: Extracts line items from PDF invoices into structured JSON.
categories: [AI, NLP]
projectType: Web application
year: 2026
tools: [Python, FastAPI, Next.js]
links:
  github: https://github.com/wifimoneydev/invoice-parser
draft: false
---

A short opening paragraph about the project.

## Problem
...
```

### Case-study sections

Write any of these as `## Heading` in the body. The page always shows them **in this order**, whatever order you write them in. Empty sections are hidden.

`Problem` → `What I built` → `Technical approach` → `Challenge` → `Engineering decisions` → `Evaluation` → `Results` → `Limitations` → `Lessons` → `Next steps`

Any other `## Heading` you write is added after these. Use `###` for sub-headings inside a section.

Some sections can also come from structured lists in the frontmatter. These appear inside the matching section:

```yaml
decisions:          # → Engineering decisions
  - title: Use FAISS instead of a hosted vector DB
    detail: The dataset is small and local retrieval keeps it free to run.
challenges: []      # → Challenge
metrics: []         # → Results (see below)
limitations:        # → Limitations
  - No user accounts yet.
lessons: []         # → Lessons
nextSteps: []       # → Next steps
```

## 2. Add an Architecture project

```bash
npm run new:project -- architecture my-house
```

Fill in `content/architecture/my-house/index.mdx`. A published architecture project **must** have a `hero` image.

```yaml
---
title: Courtyard House
summary: A family house organised around a shaded courtyard.
categories: [Architecture]
projectType: Residential
year: 2023
location: Osun State, Nigeria
role: Designer
tools: [ ]                     # the software you used
concept: Rooms open onto a shared, shaded courtyard.
hero:
  src: /images/architecture/my-house/hero.jpg
  alt: Courtyard view at dusk
gallery:
  - src: /images/architecture/my-house/ground-floor.jpg
    alt: Ground floor plan
    caption: Ground floor plan
    kind: plan
  - src: /images/architecture/my-house/section-aa.jpg
    alt: Section A–A through the courtyard
    kind: section
draft: false
---

Project description (the brief, the site, your response).

## Concept
## Process
## Case study      # optional, longer write-up
```

Gallery `kind` can be `render`, `plan`, `section`, `elevation`, `drawing`, `diagram`, `model` or `photo`. The gallery groups images by kind and numbers them as figures. Visitors can click an image to open it full screen.

> Only images you list in `gallery` appear. **Never** put CAD/Revit/3D source files in `public/`. Everything in `public/` can be downloaded. To offer a deliberate download (such as a PDF board), list it under `downloads:`.

## 3. Screenshots and images

1. Put the files in the project's images folder, e.g. `public/images/projects/my-project/`. Use `.jpg`, `.png`, `.webp` or `.avif`. Around 2400px wide is plenty.
2. Reference them with a path starting at `/images/...`:

```yaml
thumbnail:                       # cover image for cards and the top of the page
  src: /images/projects/my-project/cover.png
  alt: Dashboard showing extracted invoice items
gallery:                         # extra screens, shown under "Screens"
  - src: /images/projects/my-project/upload.png
    alt: Upload screen
    caption: Uploading a PDF invoice
    kind: screenshot
```

- `alt` is required. Describe what the image shows.
- Width and height are detected automatically, so you never type them.
- File names are **case-sensitive**. If a path is wrong, the build stops and names the missing file.
- Tech projects without a thumbnail show the **system diagram** from `system:` instead, clearly labelled as a diagram:

```yaml
system:
  - label: Upload
    detail: PDF or image
  - label: OCR
  - label: LLM extraction
```

### Work-page thumbnail (`workThumbnail`)

`thumbnail` is used everywhere a project appears. `workThumbnail` is shown **only** on the Work library page (`/projects`), so the other pages keep the system diagram. MeetingBot and Trash2Cash use this:

```yaml
workThumbnail:
  src: /images/projects/meetingbot/meetingbotthumbnail.png
  alt: MeetingBot meeting workspace, Ask MeetingBot tab
  position: 50% 100%      # optional crop anchor; "50% 100%" keeps the bottom
```

The Work card is 16:10. `position` (any CSS object-position) chooses which part stays visible when the image is cropped. It is applied by project cards only (the Work library, related-project cards); other images are shown uncropped or centred.

## 4. GitHub, live demo and other links

```yaml
links:
  github: https://github.com/wifimoneydev/my-project
  live: https://my-project.vercel.app
  demo: https://youtu.be/...
```

Leave out any you don't have; the buttons appear only for links that exist. If a project has no links at all, write `links: {}`.

## 5. Metrics

Only real, measured numbers. They show in the **Results** section.

```yaml
metrics:
  - label: Passing tests
    value: "52"
  - label: Answer accuracy
    value: "91%"
    context: 40-question evaluation set   # optional small print
```

Put `value` in quotes. For two or three headline facts on cards and the "At a glance" box, use:

```yaml
highlights:
  - 52 passing tests
  - Runs fully offline
```

## 6. Featured, order, draft, publish

| Field             | Effect                                                                        |
| ----------------- | ----------------------------------------------------------------------------- |
| `featured: true`  | Large editorial presentation on Home and Tech (tech projects).                |
| `order: 1`        | Lower numbers come first. Also sets the "Project 01" number.                  |
| `draft: true`     | Hidden everywhere. Preview it with `SHOW_DRAFTS=true npm run dev`.             |
| `draft: false`    | Published.                                                                    |
| `status:`         | Optional: `Completed`, `In progress`, `Prototype`, `Concept`, `Archived`.     |
| `seo:`            | Optional `title` / `description` overrides for search engines.                |

## 7. Categories and filters

`categories` can contain: `AI`, `Full Stack`, `NLP`, `Computer Vision`, `Architecture`, `Experimental`, `Architecture + Technology`.

The Work page only shows filters for categories that published projects actually use. Projects tagged `Experimental` or `Architecture + Technology` also appear in the Lab.

## 8. Related projects

At the bottom of each project page, related work is picked automatically: shared categories count most, then shared tools. To choose them yourself:

```yaml
related: [trash2cash, t2cvision]
```

## 9. Small repositories (no case study)

For smaller repos, add an entry to `data/repos.ts` instead of a project folder. It appears under "Selected repositories" on the Tech page.

```ts
{
  name: "my-repo",
  url: "https://github.com/wifimoneydev/my-repo",
  description: "One sentence about what it does.",
  tags: ["NLP", "Flask"],
},
```

## Unpublished drafts already in the repo

`t2cvision`, `bert-word-mask-predictor`, `shift-organizer`, `t2c-chatbot`, `fudtok`, `comment-translator` and `toneswitcher` exist as drafts. Fill them in and set `draft: false` when ready.
