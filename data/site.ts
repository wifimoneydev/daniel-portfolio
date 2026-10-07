/**
 * Core personal + site configuration.
 * Everything a visitor reads about "who Daniel is" starts here.
 * Edit freely — no component changes are needed. See docs/ADDING_CONTENT.md.
 */

export const site = {
  name: "Daniel Awofadeju",
  shortName: "Daniel",
  /** Primary professional positioning. */
  role: "AI Engineer & Software Developer",
  /** Secondary discipline, shown alongside the role. */
  background: "with a background in Architecture",

  /** Public location only. Never put a street/home address here. */
  location: "Nigeria",

  availability: {
    /** Set to false to hide every availability indicator on the site. */
    available: true,
    label: "Available for opportunities",
    detail: "Nigeria · Open to remote work",
  },

  /** Production domain comes from NEXT_PUBLIC_SITE_URL (see .env.example). */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),

  /** One-paragraph bio used on the home page. */
  shortBio:
    "AI Engineer and Software Developer with a background in Architecture. I build practical AI-powered products and full-stack software, combining engineering, design thinking and a strong focus on making things actually work.",

  /**
   * Home hero statement. It is the short bio without its first sentence,
   * because the hero headline already says "AI Engineer & Software Developer
   * with a background in Architecture".
   */
  heroStatement:
    "I build practical AI-powered products and full-stack software, combining engineering, design thinking and a strong focus on making things actually work.",

  /** About page story. Each string is one paragraph. */
  bio: [
    "I’m Daniel Awofadeju, an AI Engineer and Software Developer with a background in Architecture. I enjoy taking ideas that are still rough, figuring out how they should work, and turning them into useful products.",
    "My work spans applied AI, full-stack software, LLM systems, NLP, computer vision and AI evaluation. I care about more than getting a model or prototype to work once. I like understanding where systems fail, improving them through testing and evaluation, and building software people can actually use.",
    "Architecture remains an important part of how I think. It trained me to approach problems through structure, function, design and the experience of the person using what I create. As I grow deeper into engineering, I’m increasingly interested in the intersection of software, AI, architecture and interactive 3D experiences.",
  ],
  /** Closing line of the About story, set apart typographically. */
  bioSignoff: "I build, test, learn, improve, and keep shipping.",

  /** Default SEO description and keywords. */
  description:
    "Daniel Awofadeju — AI Engineer & Software Developer with a background in Architecture. Practical AI-powered products, LLM and RAG applications, NLP, computer vision, AI evaluation and full-stack software.",
  keywords: [
    "Daniel Awofadeju",
    "AI Engineer",
    "Software Developer",
    "Full-Stack Developer",
    "AI Applications",
    "LLM Applications",
    "RAG",
    "NLP",
    "Computer Vision",
    "AI Evaluation",
    "Architecture",
    "Nigeria",
    "Remote",
  ],

  /** Profile photograph. If the file is missing, the layout falls back gracefully. */
  portrait: {
    src: "/images/profile/daniel-awofadeju.jpg",
    alt: "Portrait of Daniel Awofadeju",
    /** CSS object-position used when the photo is cropped. */
    focus: "50% 92%",
  },

  /**
   * Résumé PDF. "View résumé" opens it in a new tab (the browser's own PDF viewer);
   * "Download PDF" saves it as `downloadName`. All résumé actions hide if the file is missing.
   */
  resume: {
    path: "/resume/daniel-awofadeju-resume.pdf",
    viewLabel: "View résumé",
    downloadLabel: "Download PDF",
    downloadName: "Daniel-Awofadeju-Resume.pdf",
  },

  /** Contact form is not built yet. Flip to true once a form + backend exist. */
  contactForm: { enabled: false },
} as const;

export type Site = typeof site;
