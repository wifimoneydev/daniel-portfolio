# Daniel Portfolio — Owner's Guide

The master manual for this website. Read this first. Deeper step-by-step guides:

- [ADDING_PROJECTS.md](ADDING_PROJECTS.md): project files, screenshots, galleries, metrics
- [ADDING_CONTENT.md](ADDING_CONTENT.md): bio, résumé, photo, certificates, experience, skills, links

---

## What This Is

The personal portfolio of **Daniel Awofadeju**.

- **Primary identity:** AI Engineer & Software Developer (`DANIEL / TECH`)
- **Second discipline:** Architecture (`DANIEL / ARCHITECTURE`)
- **Emerging intersection:** Architecture × Technology (`DANIEL / LAB`)

The site is **content-driven**. Pages are generated from files in `content/` and `data/`. To add a project, certificate or job you edit content, not code. The design is meant to stay stable while the content grows.

Pages: `/` (Home), `/projects` (the "Work" library), `/projects/<slug>` (tech case studies), `/tech`, `/architecture`, `/architecture/<slug>`, `/lab`, `/about`, `/contact`.

## How I Built It

- **Next.js App Router** with reusable React components.
- **Structured data** in TypeScript files (`data/`) for personal facts.
- **Content files** (`content/**/index.mdx`) for projects. Each file becomes a page through **dynamic routes** (`app/projects/[slug]`, `app/architecture/[slug]`).
- **Validation:** every project file is checked with Zod. Mistakes stop the build with a clear message instead of breaking a page.
- **Responsive design:** mobile layouts are designed separately (for example the About page), not just stacked desktop.
- **AI-assisted development:** the site was built with an AI coding assistant (Claude Code) working from Daniel's instructions and real source files. It is maintained like a normal software project: read the code, change it, test it, review the diff, commit.

## Tech Stack

| Package                          | What it does                                                   |
| -------------------------------- | -------------------------------------------------------------- |
| `next` 16                        | Framework: routing, rendering, image optimisation, builds      |
| `react` / `react-dom` 19         | UI components                                                  |
| `typescript` 5                   | Type checking                                                  |
| `tailwindcss` 4                  | Styling (design tokens in `app/globals.css`)                   |
| `next-mdx-remote`                | Renders the Markdown/MDX case-study text                       |
| `gray-matter`                    | Reads the settings block (frontmatter) at the top of `.mdx` files |
| `zod`                            | Validates project frontmatter                                  |
| `image-size`                     | Reads image dimensions automatically (no layout shift)         |
| `geist`                          | Fonts (Geist Sans + Geist Mono), bundled locally               |
| `lucide-react`                   | Icons                                                          |
| `eslint` + `eslint-config-next`  | Lint                                                           |

What this project does **not** have:

- **Database:** none.
- **Backend API:** none. There are no API routes; the contact page uses direct links (email, WhatsApp, phone).
- **CMS / admin dashboard:** none.
- **Authentication:** none.

All content comes from files in this repository. Pages are pre-rendered as static HTML at build time.

## Important Folder Structure

```
app/          Pages and routes. Also sitemap.ts, robots.ts, Open Graph images, globals.css (colours/fonts).
components/   UI components. No personal facts in here.
content/      Project files: content/projects/<slug>/ (tech), content/architecture/<slug>/.
data/         Personal facts: site, social, education, experience, skills, certifications, repos, lab.
lib/          Content loader + Zod schema (lib/content/), MDX renderer, SEO helpers.
public/       Files served as-is: profile photo, résumé, certificates, project images.
scripts/      new-project.mjs (the project scaffold command).
docs/         This guide and the detailed guides.
private/      Personal documents. Git-ignored and never published. Do not move files from here into public/.
```

## Where My Information Lives

If I want to change X, open Y.

| X                                        | Y                                                                 |
| ---------------------------------------- | ----------------------------------------------------------------- |
| Bio (About story, home sentence, sign-off) | `data/site.ts` → `bio`, `heroStatement`, `shortBio`, `bioSignoff` |
| Role headline                            | `data/site.ts` → `role`, `background`                             |
| Location                                 | `data/site.ts` → `location`                                       |
| Availability                             | `data/site.ts` → `availability`                                   |
| Email, phones, WhatsApp                  | `data/social.ts` → `contact`                                      |
| GitHub, LinkedIn, Upwork                 | `data/social.ts` → `social`                                       |
| Education                                | `data/education.ts`                                               |
| Experience                               | `data/experience.ts`                                              |
| Capabilities                             | `data/skills.ts`                                                  |
| Certifications                           | `data/certifications.ts` + files in `public/certificates/`        |
| Selected repositories (Tech page)        | `data/repos.ts`                                                   |
| Lab interests                            | `data/lab.ts`                                                     |
| Profile photo                            | `public/images/profile/daniel-awofadeju.jpg` (+ `portrait` in `data/site.ts`) |
| Résumé                                   | `public/resume/daniel-awofadeju-resume.pdf` (+ `resume` in `data/site.ts`) |
| Tech projects                            | `content/projects/<slug>/index.mdx`                               |
| Architecture projects                    | `content/architecture/<slug>/index.mdx`                           |
| Project screenshots / thumbnails         | `public/images/projects/<slug>/`, `public/images/architecture/<slug>/` |
| Domain for SEO                           | `NEXT_PUBLIC_SITE_URL` environment variable (see Deployment)      |

## Running Locally

Requires Node.js (built with Node 24).

```bash
npm install            # install dependencies (first time, or after package.json changes)
npm run dev            # development server → http://localhost:3000
npm run lint           # ESLint
npm run typecheck      # TypeScript (tsc --noEmit)
npm run build          # production build
npm start              # serve the production build → http://localhost:3000
npm run check          # lint + typecheck + build in one go
```

If port 3000 is busy, Next picks the next free port (e.g. 3001) and prints it in the terminal.

In `npm run dev`, saving a content or data file is enough; refresh the browser. Production (`npm run build`) must be re-run to see changes.

## Testing on My Phone

1. The Mac and the phone should be on the **same Wi-Fi / local network**.
2. Start the dev server so it listens on the network:

   ```bash
   npm run dev -- --hostname 0.0.0.0
   ```

3. Find the Mac's IP address:

   ```bash
   ipconfig getifaddr en0
   ```

4. On the phone, open `http://<Mac IP>:<port>`.

`0.0.0.0` is a **listening address**: it means "accept connections on every network interface". It is **not** the address you type into the phone.

Example only (your IP and port will differ and can change):

```
Mac IP:      192.168.1.34
Next port:   3001
Phone opens: http://192.168.1.34:3001
```

### Why `allowedDevOrigins` exists (do not remove it)

`next.config.ts` contains:

```ts
allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
```

The **Next.js 16 development server** blocks its own internal requests (`/_next/...`) when the page is opened from any address other than `localhost`. When Daniel opened the site on his phone through the Mac's LAN IP, the HTML and CSS appeared normally, but **React never started**. Everything that needs JavaScript looked fine but did nothing when tapped:

- mobile menu
- theme toggle
- project filters on `/projects`
- architecture gallery viewer

`allowedDevOrigins` tells the dev server that local-network addresses are allowed. It only matters for `npm run dev` over the LAN. It is **not** needed in production and has no effect on production builds. If phone testing ever breaks the same way, check this setting first.

## Updating Basic Information

| Change      | File               | Field                                  |
| ----------- | ------------------ | -------------------------------------- |
| Bio         | `data/site.ts`     | `bio` (one string per paragraph), `heroStatement`, `bioSignoff` |
| Location    | `data/site.ts`     | `location` (public location only, never a street address) |
| Availability| `data/site.ts`     | `availability.available` (false hides it everywhere), `label`, `detail` |
| Email       | `data/social.ts`   | `contact.email`                        |
| Phone       | `data/social.ts`   | `contact.phone` (digits, used for tel:/WhatsApp) + `contact.phoneDisplay` |
| WhatsApp    | `data/social.ts`   | `contact.whatsapp` (true/false), `contact.whatsappMessage` |
| LinkedIn    | `data/social.ts`   | `social.linkedin`                      |
| GitHub      | `data/social.ts`   | `social.github`                        |
| Upwork      | `data/social.ts`   | `social.upwork`                        |
| Education   | `data/education.ts`| one object per qualification           |
| Experience  | `data/experience.ts` | one object per role, newest first. Use `duration` when exact dates are unknown. `featured: true` puts it in the home preview |

Setting any contact/social value to `""` hides it everywhere.

## Updating Capabilities

All in `data/skills.ts`. Each group has a `discipline`:

- **Technology capabilities:** groups with `discipline: "tech"` (Applied AI, Software Engineering, Languages & Frameworks, ML Frameworks, Tools & Infrastructure, Also).
- **Architecture capabilities:** groups with `discipline: "architecture"`:
  - `id: "architecture"` → **Design Practice** (architectural design, design development, spatial & visual communication, architectural visualisation, technical drawing)
  - `id: "architecture-software"` → **Design Software** (empty, so hidden)

Items are strings, or `{ name, note }` when they need a short explanation.

Where they appear: Home and About show both disciplines. Tech shows tech groups. Architecture shows architecture groups.

**Do not add Architecture software unless Daniel has confirmed that he uses it.**

Emerging interests (Three.js, interactive 3D, real-time visualisation, AI-assisted architectural experiences) live in `data/lab.ts` as interests, **not** as capabilities.

## Replacing My Profile Photo

- Path: `public/images/profile/daniel-awofadeju.jpg`
- Replace the file using the **same filename** → no code change needed. Restart `npm run dev` if the old image is cached.
- Different filename or format? Update `portrait.src` in `data/site.ts`.
- Crop: `portrait.focus` in `data/site.ts` (CSS position, currently `"50% 92%"`). Lower the second number to show more of the top of the photo.
- If the file is missing, a monogram placeholder is shown.

## Updating My Résumé

- Path: `public/resume/daniel-awofadeju-resume.pdf`
- Replace the file using the **same filename**. No code change needed.
- **View résumé** opens the PDF in a new tab with the browser's built-in PDF viewer. It appears in the desktop header, mobile menu, footer, About and Contact.
- **Download PDF** saves the file as `Daniel-Awofadeju-Resume.pdf`. It appears only on About and Contact.
- Labels and download name: `data/site.ts` → `resume`.
- If the PDF is missing, all résumé actions are hidden automatically.
- The PDF is public. Check it contains only details you want online.

## Adding a Certificate

1. Put the file in `public/certificates/`, e.g. `public/certificates/my-course.pdf`.
2. Add an entry in `data/certifications.ts`.
3. Required fields: `id`, `title`, `issuer`, `date`, `sortDate`, `category`. Optional: `platform`, `note`, `credentialUrl`, `file`, `featured`, `hidden`.
4. `featured: true` → listed first on About. Within each group, newest first (by `sortDate`).
5. `credentialUrl` → shows a **Verify** link to the issuer's page.
6. Hide: add `hidden: true`. Remove: delete the entry (and the file if it should not be public).

```ts
{
  id: "my-course",
  title: "Exact Title From The Certificate",
  issuer: "DeepLearning.AI",
  platform: "Coursera",
  date: "Mar 2026",
  sortDate: "2026-03-14",
  category: "Machine Learning", // Computer Science | Artificial Intelligence | Machine Learning | Software Development | Other
  credentialUrl: "https://coursera.org/verify/XXXX",
  file: "/certificates/my-course.pdf",
  featured: true,
},
```

Only certificates listed in this file appear on the site. A file in `public/certificates/` that is not listed is not linked anywhere, but anyone who knows its URL can still open it.

## Adding a Tech Project

```bash
npm run new:project -- tech my-project
```

This creates `content/projects/my-project/index.mdx` (with `draft: true`) and `public/images/projects/my-project/`. It refuses invalid slugs and never overwrites an existing project.

Main fields (full list in `lib/content/schema.ts`):

```yaml
title: My Project
summary: One or two sentences.
categories: [AI, Full Stack]   # AI | Full Stack | NLP | Computer Vision | Architecture | Experimental | Architecture + Technology
projectType: Web application
year: 2026
status: In progress            # optional: Completed | In progress | Prototype | Concept | Archived
role: Solo developer           # optional
tools: [Python, Flask, Next.js]
links:
  github: https://github.com/wifimoneydev/my-project
  live: https://...            # optional deployed app → "Launch live app ↗" (primary button)
featured: false                # true = large presentation on Home and Tech
order: 100                     # lower = earlier; also sets "Project 01" numbering
draft: true                    # false = published
thumbnail:                     # optional; used on all pages that show the project
  src: /images/projects/my-project/cover.png
  alt: What the screenshot shows
workThumbnail:                 # optional; used ONLY on /projects
  src: /images/projects/my-project/cover.png
  alt: What the screenshot shows
  position: 50% 100%
gallery: []                    # extra screenshots ("Screens" section)
highlights: []                 # 2–3 true headline facts
system: []                     # pipeline steps → diagram when there is no thumbnail
metrics: []                    # { label, value, context? } — real numbers only
decisions: []                  # { title, detail }
challenges: []
limitations: []
lessons: []
nextSteps: []
```

The text below the frontmatter uses `## Problem`, `## What I built`, `## Technical approach`, `## Challenge`, `## Evaluation` (and optionally `## Results`, `## Limitations`, `## Lessons`, `## Next steps`). The page always shows them in a fixed order and hides empty ones. Details: [ADDING_PROJECTS.md](ADDING_PROJECTS.md).

## Adding an Architecture Project

```bash
npm run new:project -- architecture my-house
```

Creates `content/architecture/my-house/index.mdx` (draft) and `public/images/architecture/my-house/`.

```yaml
title: Courtyard House
summary: One or two sentences.
categories: [Architecture]     # add "Architecture + Technology" for interactive/3D work (also shows in the Lab)
projectType: Residential
year: 2023
location: City, Country
role: Designer
tools: []                      # software used on this project (confirmed only)
concept: One-sentence concept, shown prominently.
hero:                          # REQUIRED to publish
  src: /images/architecture/my-house/hero.jpg
  alt: Describe the image
  caption: Optional
thumbnail: { src: ..., alt: ... }   # optional; defaults to hero
gallery:
  - src: /images/architecture/my-house/ground-floor.jpg
    alt: Ground floor plan
    caption: Ground floor plan
    kind: plan                 # render | plan | section | elevation | drawing | diagram | model | photo
downloads: []                  # optional deliberate downloads: { label, href }
draft: true
```

The text below the frontmatter: the description first, then `## Concept`, `## Process`, and optionally `## Case study`. The gallery is grouped by `kind` with figure numbers; visitors can tap an image to enlarge it.

Never put CAD, Revit or 3D source files in `public/`.

## Updating an Existing Project

1. Find the project: `content/projects/<slug>/index.mdx` or `content/architecture/<slug>/index.mdx`.
2. Edit the frontmatter or text.
3. Add or replace images in `public/images/projects/<slug>/` (or `architecture/<slug>/`).
4. Run locally: `npm run dev`.
5. Inspect on desktop.
6. Inspect on a real phone (see Testing on My Phone).
7. Run validation: `npm run check`.
8. Review the changes: `git diff`.
9. Commit.

## Project Images and Thumbnails

- Locations: `public/images/projects/<slug>/` and `public/images/architecture/<slug>/`.
- Paths in content start with `/images/...` (not `public/`).
- Width/height are read automatically. File names are case-sensitive.
- `alt` is required on every image (minimum 3 characters).
- `thumbnail`: shown wherever the project appears (Home, Tech, case-study top, cards).
- `workThumbnail`: shown **only** on the Work library (`/projects`).
- `hero`: architecture projects only; the large top image.
- `gallery`: extra images. Tech pages show them under "Screens"; architecture pages group them by `kind`.
- `position`: optional crop anchor used by project cards.

**Current design decision:** MeetingBot and Trash2Cash have supplied screenshots as `workThumbnail`, so they show on `/projects` only. Home, Tech and the case-study pages intentionally keep the system diagrams. Image usage is contextual: do not assume every project image must appear on every page.

Current files:

- `public/images/projects/meetingbot/meetingbotthumbnail.png`
- `public/images/projects/trash2cash/t2cthumbnail.png`

## Draft vs Published

- `draft: true` in a project's frontmatter hides it **everywhere**: pages, Work library, Home, Tech, sitemap and related projects. This applies in development and production.
- To preview drafts locally: `SHOW_DRAFTS=true npm run dev`.
- `draft: false` (or leaving the field out) publishes it.
- Folders whose name starts with `_` (e.g. `content/projects/_template`) are always ignored.
- New projects from `npm run new:project` start as drafts.

Current drafts: `t2cvision`, `bert-word-mask-predictor`, `shift-organizer`, `t2c-chatbot`, `fudtok`, `comment-translator`, `toneswitcher`.

## Before I Commit

```bash
npm run dev            # run the site locally
```

- [ ] Check desktop
- [ ] Check a real phone
- [ ] Check light mode
- [ ] Check dark mode (moon/sun button in the header)
- [ ] Check links you touched
- [ ] Check images you touched
- [ ] Check résumé / certificate links if changed

```bash
npm run lint
npm run typecheck
npm run build
git diff
```

Then commit.

## Safe Git Workflow

If the folder is not a git repository yet, run this once: `git init`.

```bash
git status                   # what changed
git diff                     # read the actual changes
git add <file> <file>        # stage specific files (or: git add -A to stage everything)
git commit -m "Describe the change"
```

Always read `git diff` before committing. `private/`, `node_modules/`, `.next/` and `.env*` files are git-ignored and should never be committed.

## Deployment

Deployment has not been configured yet. No hosting provider is set up in this repository.

When deploying, set the environment variable:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

It is used for canonical URLs, Open Graph links, `sitemap.xml` and `robots.txt`. Without it, those fall back to `http://localhost:3000`. Rebuild after changing it. See `.env.example`.

## How This Portfolio Should Grow

Do not redesign the site every time the career changes. Instead:

- add projects
- improve existing case studies (real screenshots, real metrics)
- update experience
- add Architecture projects
- add confirmed Architecture software/tools
- add certificates
- replace the résumé
- update availability
- add real Architecture × Technology work as it happens (category `Architecture + Technology` → it appears in the Lab automatically)

The content evolves; the design system stays stable unless there is a real reason to redesign.

## Rules for Future AI Assistants

1. Read this guide first.
2. Inspect the current repository before changing anything.
3. Do not invent facts about Daniel.
4. Do not invent project metrics.
5. Do not invent Architecture projects or software.
6. Preserve the Tech + Architecture identity.
7. Keep the site mobile-first and excellent on desktop.
8. Keep content separate from components (`data/`, `content/` vs `components/`).
9. Reuse existing systems before creating new ones.
10. Do not add dependencies unnecessarily.
11. Do not redesign unrelated sections for a small change.
12. Do not commit or deploy unless explicitly asked.
13. Run `npm run lint`, `npm run typecheck` and `npm run build` after meaningful code changes.
14. Report factual conflicts instead of guessing.
15. Preserve existing working behaviour unless the requested change requires otherwise.

Also: do not remove `allowedDevOrigins` from `next.config.ts` (see Testing on My Phone).

## Quick Cheat Sheet

| Task                    | Where / command                                              |
| ----------------------- | ------------------------------------------------------------ |
| Change bio              | `data/site.ts` → `bio`                                       |
| Change contact          | `data/social.ts`                                             |
| Change availability     | `data/site.ts` → `availability`                              |
| Replace photo           | `public/images/profile/daniel-awofadeju.jpg`                 |
| Replace résumé          | `public/resume/daniel-awofadeju-resume.pdf`                  |
| Add certificate         | `public/certificates/` + `data/certifications.ts`            |
| Add Tech project        | `npm run new:project -- tech my-project`                     |
| Add Architecture project| `npm run new:project -- architecture my-house`               |
| Add /projects thumbnail | image in `public/images/projects/<slug>/` + `workThumbnail` in the project's `index.mdx` |
| Update capabilities     | `data/skills.ts`                                             |
| Run locally             | `npm run dev` → http://localhost:3000                        |
| Test on phone           | `npm run dev -- --hostname 0.0.0.0`, `ipconfig getifaddr en0`, open `http://<IP>:<port>` |
| Validate                | `npm run check`                                              |
| Build                   | `npm run build`                                              |
