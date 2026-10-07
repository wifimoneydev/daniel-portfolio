/**
 * Capabilities, organised by discipline and group. No ratings or percentages — by design.
 *
 * - `discipline` decides which side of the portfolio a group belongs to:
 *     "tech"         → Technology & Software
 *     "architecture" → Architecture & Design
 * - Add a skill: add an entry to a group's `items`.
 *   An item is either a plain string, or { name, note } when it needs a short explanation.
 * - A group with an empty `items` array is hidden automatically.
 * - Only list things that are true. Architecture software is added only once Daniel confirms it.
 */

export type SkillItem = string | { name: string; note?: string };

export type SkillGroup = {
  id: string;
  title: string;
  discipline: "tech" | "architecture";
  items: SkillItem[];
};

export const disciplines = {
  tech: { label: "Tech", title: "Technology & Software" },
  architecture: { label: "Architecture", title: "Architecture & Design" },
} as const;

export const skills: SkillGroup[] = [
  /* ---------------------------------------------------------- Technology & Software */
  {
    id: "applied-ai",
    title: "Applied AI",
    discipline: "tech",
    items: ["AI engineering", "LLM systems", "RAG", "NLP", "Computer vision", "AI evaluation"],
  },
  {
    id: "software",
    title: "Software Engineering",
    discipline: "tech",
    items: ["Full-stack development", "Backend & API development", "REST APIs", "SQL", "PostgreSQL"],
  },
  {
    id: "languages",
    title: "Languages & Frameworks",
    discipline: "tech",
    items: ["Python", "TypeScript", "JavaScript", "Flask", "FastAPI", "Node.js", "Next.js", "React", "Tailwind CSS"],
  },
  {
    id: "ml-frameworks",
    title: "ML Frameworks",
    discipline: "tech",
    items: ["PyTorch", "TensorFlow"],
  },
  {
    id: "tools",
    title: "Tools & Infrastructure",
    discipline: "tech",
    items: ["Git", "GitHub", "Docker"],
  },
  {
    id: "other",
    title: "Also",
    discipline: "tech",
    items: ["Data analysis", "Technical writing"],
  },

  /* ---------------------------------------------------------- Architecture & Design */
  {
    id: "architecture",
    title: "Design Practice",
    discipline: "architecture",
    items: [
      "Architectural design",
      "Design development",
      "Spatial & visual communication",
      {
        name: "Architectural visualisation",
        note: "Communicating architectural ideas through drawings, diagrams, rendered imagery and visual presentations.",
      },
      "Technical drawing",
    ],
  },
  {
    id: "architecture-software",
    title: "Design Software",
    discipline: "architecture",
    // TODO(Daniel): add architecture/design software you have confirmed, e.g. "AutoCAD".
    // This group stays hidden until it has at least one item.
    items: [],
  },
];

export const skillName = (s: SkillItem) => (typeof s === "string" ? s : s.name);

export const getSkillGroups = (discipline?: SkillGroup["discipline"]) =>
  skills.filter((g) => g.items.length > 0 && (!discipline || g.discipline === discipline));
