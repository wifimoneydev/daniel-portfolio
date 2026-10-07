/**
 * Splits an MDX body into sections at each "## Heading".
 * Tech case studies are then re-ordered into a fixed narrative
 * (Problem → … → Next steps) so every case study reads the same way.
 */

export type BodySection = { id: string; title: string; body: string };

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function splitSections(body: string): { intro: string; sections: BodySection[] } {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const sections: BodySection[] = [];
  const intro: string[] = [];
  let current: { title: string; lines: string[] } | null = null;
  let inFence = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) inFence = !inFence;
    const match = !inFence ? /^##\s+(.+?)\s*#*\s*$/.exec(line) : null;
    if (match?.[1]) {
      if (current) sections.push(toSection(current));
      current = { title: match[1], lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else {
      intro.push(line);
    }
  }
  if (current) sections.push(toSection(current));
  return { intro: stripComments(intro.join("\n")).trim(), sections: sections.filter((s) => s.body) };
}

function toSection(c: { title: string; lines: string[] }): BodySection {
  return { id: slugify(c.title), title: c.title, body: stripComments(c.lines.join("\n")).trim() };
}

/** Removes {/* MDX comments *\/} and <!-- html comments --> so TODO notes never count as content. */
function stripComments(s: string) {
  return s.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/<!--[\s\S]*?-->/g, "");
}

/** Canonical case-study order. `aliases` are accepted heading spellings. */
export const TECH_SECTIONS = [
  { id: "problem", title: "Problem", aliases: ["the problem"] },
  { id: "what-i-built", title: "What I built", aliases: ["what i built", "solution"] },
  { id: "technical-approach", title: "Technical approach", aliases: ["approach", "architecture"] },
  { id: "challenge", title: "Challenge", aliases: ["challenges", "the challenge"] },
  { id: "engineering-decisions", title: "Engineering decisions", aliases: ["engineering decision", "decisions"] },
  { id: "evaluation", title: "Evaluation", aliases: ["testing", "evaluation and testing"] },
  { id: "results", title: "Results", aliases: ["outcome", "outcomes"] },
  { id: "limitations", title: "Limitations", aliases: ["current limitations", "known limitations"] },
  { id: "lessons", title: "Lessons", aliases: ["lessons learned", "what i learned"] },
  { id: "next-steps", title: "Next steps", aliases: ["future work", "whats next"] },
] as const;

export const ARCHITECTURE_SECTIONS = [
  { id: "concept", title: "Concept", aliases: ["design concept"] },
  { id: "process", title: "Process", aliases: ["design process"] },
  { id: "case-study", title: "Case study", aliases: [] },
] as const;

export type CanonicalId = (typeof TECH_SECTIONS)[number]["id"] | (typeof ARCHITECTURE_SECTIONS)[number]["id"];

export function matchCanonical<T extends readonly { id: string; title: string; aliases: readonly string[] }[]>(
  defs: T,
  sections: BodySection[],
) {
  const byId = new Map<string, BodySection>();
  const extras: BodySection[] = [];
  for (const s of sections) {
    const def = defs.find((d) => d.id === s.id || d.aliases.map(slugify).includes(s.id));
    if (def && !byId.has(def.id)) byId.set(def.id, { ...s, id: def.id });
    else extras.push(s);
  }
  return { byId, extras };
}
