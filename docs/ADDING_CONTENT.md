# Editing your content

All personal content lives in `data/` and `public/`. You never need to edit a component.

**Restart or rebuild?** With `npm run dev` running, save and refresh the browser. If a change to a file in `public/` doesn't appear, restart `npm run dev`. The live site updates after a new production build (your host runs this on deploy).

---

## Bio and positioning: `data/site.ts`

| What                         | Field                                   |
| ---------------------------- | --------------------------------------- |
| Role headline                | `role`, `background`                    |
| Home hero sentence           | `heroStatement`                         |
| Short bio (search engines)   | `shortBio`, `description`               |
| About-page story             | `bio` (one string per paragraph)        |
| Closing line on About        | `bioSignoff`                            |

```ts
bio: [
  "First paragraph…",
  "Second paragraph…",
],
```

## Availability: `data/site.ts`

```ts
availability: {
  available: true,                          // false hides every availability indicator
  label: "Available for opportunities",
  detail: "Nigeria · Open to remote work",
},
```

## Profile photo

1. Replace `public/images/profile/daniel-awofadeju.jpg` with your new photo, using the same file name.
   - A different name or format (e.g. `.png`) is fine too: update `portrait.src` in `data/site.ts`.
2. If the face isn't framed well, adjust `portrait.focus` in `data/site.ts`. It's a CSS position: `"50% 30%"` shows more of the top, `"50% 90%"` shows more of the bottom.
3. Restart `npm run dev`.

If the file is missing, the site shows a neat monogram placeholder instead.

## Résumé

1. Replace `public/resume/daniel-awofadeju-resume.pdf` with your new PDF, using the **same file name**.
2. That's it. Every résumé action uses this file:
   - **View résumé** (header, mobile menu, footer, About, Contact) opens the PDF in a new tab, using the browser's own PDF viewer.
   - **Download PDF** (About, Contact) saves it as `Daniel-Awofadeju-Resume.pdf`.

   Labels and the download file name are in `data/site.ts` → `resume`. If the PDF is removed, every résumé action disappears rather than breaking.

> Your résumé PDF is public once the site is live. Make sure it contains only details you're happy to share.

## Certifications: `data/certifications.ts`

1. **File:** put the PDF (or image) in `public/certificates/`, e.g. `public/certificates/my-course.pdf`.
2. **Details:** add an entry to the `certifications` array:

```ts
{
  id: "my-course",
  title: "Exact Course Title From The Certificate",
  issuer: "DeepLearning.AI",
  platform: "Coursera",                 // optional
  date: "Mar 2026",                     // as precise as the certificate is
  sortDate: "2026-03-14",               // for ordering
  category: "Machine Learning",         // Computer Science | Artificial Intelligence | Machine Learning | Software Development | Other
  credentialUrl: "https://coursera.org/verify/XXXX",   // optional "Verify" link
  file: "/certificates/my-course.pdf",                  // optional "Certificate" link
  featured: true,                       // listed first
},
```

3. **Featured:** `featured: true` puts it at the top of the list.
4. **External credential:** paste the verification link into `credentialUrl`.
5. **Hide or remove:** add `hidden: true` to hide it (the file stays), or delete the entry. A PDF in `public/certificates/` that isn't listed here never appears on the site, though anyone with its exact URL can still open it. Delete the file if it should not be public at all.

## Experience: `data/experience.ts`

Newest first. Leave out anything you don't know rather than guessing.

```ts
{
  role: "Software Engineer",
  organization: "Company Name",
  location: "Remote",
  start: "Jan 2027",
  end: "Present",
  highlights: ["What you did, in one line.", "Another line."],
  featured: true,          // show in the home-page preview (first 3 featured)
},
```

If you don't know exact dates, use `duration: "About 9 months"` instead of `start`/`end`.

## Education: `data/education.ts`

Add another object to the array for each qualification.

## Skills / capabilities: `data/skills.ts`

Groups belong to one of two disciplines via `discipline`:

- `"tech"`: **Technology & Software** (Applied AI, Software Engineering, Languages & Frameworks, ML Frameworks, Tools & Infrastructure, Also)
- `"architecture"`: **Architecture & Design** (Design Practice, Design Software)

Home and About show both disciplines. Tech shows only `"tech"` groups; Architecture shows only `"architecture"` groups.

An item is a plain string, or `{ name, note }` when it needs a one-line explanation (the note appears under the group):

```ts
items: [
  "Architectural design",
  { name: "Architectural visualisation", note: "Communicating architectural ideas through…" },
],
```

There are no ratings, by design. A group with no items is hidden.

### Architecture software

Only add software you have confirmed you use. Find the group with `id: "architecture-software"`:

```ts
{
  id: "architecture-software",
  title: "Design Software",
  discipline: "architecture",
  items: ["AutoCAD", "SketchUp"],   // your real tools
},
```

While `items` is empty, the group stays hidden.

Emerging interests (Three.js, interactive 3D and so on) belong in `data/lab.ts`, not here.

## Social links and contact: `data/social.ts`

```ts
export const contact = {
  email: "...",
  phone: "+2349169393378",          // used for tel: and WhatsApp links
  phoneDisplay: "+234 916 939 3378", // how it's shown
  whatsapp: true,                   // false removes WhatsApp buttons
  whatsappMessage: "Hi Daniel, …",  // pre-filled WhatsApp text
  secondaryPhone: "...",
  secondaryPhoneDisplay: "...",
};

export const social = {
  github: "https://github.com/wifimoneydev",
  linkedin: "https://www.linkedin.com/in/danielfadeju/",
  upwork: "https://www.upwork.com/freelancers/~01676ab8b299b40f20",
};
```

Set any value to `""` to hide it everywhere.

## Lab interests: `data/lab.ts`

Edit `interests`. `status` can be `Exploring`, `Building toward` or `Experimenting`. Published experiments appear automatically when a project uses the `Experimental` or `Architecture + Technology` category.

## Domain (before going live)

Create `.env.local` (or set an environment variable on your host):

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

This sets the canonical URLs, Open Graph links, `sitemap.xml` and `robots.txt`. Rebuild after changing it.
