/**
 * Certifications. Only entries listed here appear on the site —
 * a PDF sitting in /public/certificates is NOT published unless it is listed.
 *
 * - `file`: path under /public (optional). Hidden automatically if missing.
 * - `credentialUrl`: the issuer's verification link (optional).
 * - `featured`: featured certificates are listed first (About page). Newest first within each group.
 * - `hidden: true` removes a certificate from the site without deleting it.
 *
 * All details below are taken directly from the certificate files.
 */

export type CertificationCategory =
  | "Computer Science"
  | "Artificial Intelligence"
  | "Machine Learning"
  | "Software Development"
  | "Other";

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  /** Platform the course was delivered through, if different from the issuer. */
  platform?: string;
  /** Display date, exactly as precise as the certificate is. */
  date: string;
  /** Used for sorting: YYYY-MM-DD (use -01-01 when only the year is known). */
  sortDate: string;
  category: CertificationCategory;
  note?: string;
  credentialUrl?: string;
  file?: string;
  featured?: boolean;
  hidden?: boolean;
};

export const certifications: Certification[] = [
  {
    id: "cs50ai",
    title: "CS50’s Introduction to Artificial Intelligence with Python",
    issuer: "Harvard University · CS50",
    date: "2025",
    sortDate: "2025-01-01",
    category: "Artificial Intelligence",
    note: "Twelve projects.",
    credentialUrl: "https://cs50.harvard.edu/certificates/31cf3b21-d067-4552-b180-19b107c470da",
    file: "/certificates/cs50ai.pdf",
    featured: true,
  },
  {
    id: "cs50x",
    title: "CS50x",
    issuer: "Harvard University · CS50",
    date: "2025",
    sortDate: "2025-01-01",
    category: "Computer Science",
    note: "Ten problem sets and one final project.",
    credentialUrl: "https://cs50.harvard.edu/certificates/de3f5e37-f986-4987-a69b-8ab77b41f337",
    file: "/certificates/cs50x.pdf",
    featured: true,
  },
  {
    id: "neural-networks-and-deep-learning",
    title: "Neural Networks and Deep Learning",
    issuer: "DeepLearning.AI",
    platform: "Coursera",
    date: "Jan 2026",
    sortDate: "2026-01-30",
    category: "Machine Learning",
    credentialUrl: "https://coursera.org/verify/MMZW6BBXSD9A",
    file: "/certificates/neural-networks-and-deep-learning.pdf",
    featured: true,
  },
  {
    id: "advanced-learning-algorithms",
    title: "Advanced Learning Algorithms",
    issuer: "DeepLearning.AI & Stanford University",
    platform: "Coursera",
    date: "Sep 2025",
    sortDate: "2025-09-20",
    category: "Machine Learning",
    credentialUrl: "https://coursera.org/verify/1DNWUO5K09X6",
    file: "/certificates/advanced-learning-algorithms.pdf",
    featured: true,
  },
  {
    id: "supervised-machine-learning",
    title: "Supervised Machine Learning: Regression and Classification",
    issuer: "DeepLearning.AI & Stanford University",
    platform: "Coursera",
    date: "Jun 2025",
    sortDate: "2025-06-10",
    category: "Machine Learning",
    credentialUrl: "https://coursera.org/verify/KM5UQKOSEIZW",
    file: "/certificates/supervised-machine-learning.pdf",
    featured: true,
  },
  {
    id: "cs50p",
    title: "CS50’s Introduction to Programming with Python",
    issuer: "Harvard University · CS50",
    date: "2025",
    sortDate: "2025-01-01",
    category: "Software Development",
    note: "Nine problem sets and one final project.",
    credentialUrl: "https://cs50.harvard.edu/certificates/e564a8ba-8e08-48df-9e4c-5bed9d22699c",
    file: "/certificates/cs50p.pdf",
  },
  {
    id: "python-essentials-for-mlops",
    title: "Python Essentials for MLOps",
    issuer: "Duke University",
    platform: "Coursera",
    date: "Dec 2025",
    sortDate: "2025-12-21",
    category: "Software Development",
    credentialUrl: "https://coursera.org/verify/37CS0Q2HVQU6",
    file: "/certificates/python-essentials-for-mlops.pdf",
  },
];

/** Visible certifications: featured first, then newest first. */
export function getCertifications(opts: { featuredOnly?: boolean } = {}) {
  return certifications
    .filter((c) => !c.hidden && (!opts.featuredOnly || c.featured))
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.sortDate.localeCompare(a.sortDate));
}
