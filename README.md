# Daniel Awofadeju — Portfolio

Personal portfolio: **Daniel / Tech** (AI engineering & software) and **Daniel / Architecture**, with an emerging **Lab** where the two meet.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · MDX content validated with Zod.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Command                                         | What it does                                  |
| ----------------------------------------------- | --------------------------------------------- |
| `npm run dev`                                   | Development server                            |
| `npm run build` / `npm start`                   | Production build / serve it                   |
| `npm run lint`                                  | ESLint                                        |
| `npm run typecheck`                             | TypeScript (`tsc --noEmit`)                   |
| `npm run check`                                 | Lint + typecheck + build                      |
| `npm run new:project -- tech my-project`        | Scaffold a tech project (draft)               |
| `npm run new:project -- architecture my-house`  | Scaffold an architecture project (draft)      |

## Where things live

```
app/                  routes (pages, sitemap, robots, OG images)
components/           UI only — no personal data
content/projects/     tech projects        → /projects/<slug>
content/architecture/ architecture projects → /architecture/<slug>
data/                 site, social, experience, education, skills, certifications, repos, lab
lib/content/          Zod schemas, loader, image sizing, section ordering
public/               profile photo, résumé, certificates, project images
scripts/              new-project scaffold
docs/                 ADDING_PROJECTS.md, ADDING_CONTENT.md
private/              personal documents — git-ignored, never published
```

- **Owner's guide (start here):** [docs/PORTFOLIO_GUIDE.md](docs/PORTFOLIO_GUIDE.md)
- How to add projects: [docs/ADDING_PROJECTS.md](docs/ADDING_PROJECTS.md)
- How to edit bio, résumé, photo, certificates, experience, skills and links: [docs/ADDING_CONTENT.md](docs/ADDING_CONTENT.md)

Set `NEXT_PUBLIC_SITE_URL` to the production domain before deploying (see `.env.example`).
