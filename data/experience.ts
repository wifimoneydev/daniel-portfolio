/**
 * Professional experience, newest first.
 * - `start` / `end` are free text so you control the wording ("Feb 2024", "Present").
 * - Set `featured: true` to show an entry in the home-page preview.
 * - Leave optional fields out rather than guessing.
 */

export type Experience = {
  role: string;
  organization?: string;
  location?: string;
  start?: string;
  end?: string;
  /** Use when exact dates are not known, e.g. "About 9 months". */
  duration?: string;
  summary?: string;
  highlights: string[];
  tags?: string[];
  featured?: boolean;
};

export const experience: Experience[] = [
  {
    role: "IT Lead / Software Developer",
    organization: "Adwolam Hotels and Suites",
    location: "Lagos, Nigeria",
    start: "Feb 2024",
    end: "Present",
    highlights: [
      "Lead day-to-day IT and software operations, supporting the infrastructure, digital workflows and business systems the team relies on.",
      "Develop and maintain internal software tools that reduce repetitive manual tasks.",
      "Troubleshoot hardware, software, network and application issues to keep systems reliable.",
      "Manage digital records, system access, data organisation, backups and related documentation.",
      "Evaluate new technology, coordinate rollouts and identify opportunities for automation and AI tools.",
    ],
    tags: ["Software", "IT Operations", "Automation"],
    featured: true,
  },
  {
    role: "Website / Digital Marketing Manager",
    organization: "Amazin Apparels",
    location: "United Kingdom",
    start: "Oct 2023",
    end: "Feb 2025",
    highlights: [
      "Planned, built and managed the company website, keeping it reliable, easy to use and on-brand.",
      "Ran digital campaigns across email, social media, SEO and paid ads, tracking budgets and measuring results.",
      "Produced content — blogs, videos, infographics and emails — while tracking competitors and industry trends.",
      "Used analytics to understand website and campaign performance and applied the findings to improve them.",
    ],
    tags: ["Web", "Digital Marketing", "Analytics"],
    featured: true,
  },
  {
    role: "AI Training & Data Annotation",
    duration: "About 9 months",
    highlights: [
      "Text, image and video annotation for AI training datasets.",
      "AI training and evaluation tasks.",
    ],
    tags: ["AI Training", "Evaluation", "Annotation"],
    featured: true,
  },
];
