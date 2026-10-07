/**
 * Formal education. Add another object to the array to add a qualification.
 */

export type Education = {
  degree: string;
  /** Short form used in compact places, e.g. "B.Sc." */
  abbreviation?: string;
  field: string;
  institution: string;
  location: string;
  /** Graduation year (or expected year). */
  year: string;
  note?: string;
};

export const education: Education[] = [
  {
    degree: "Bachelor of Science (B.Sc.)",
    abbreviation: "B.Sc.",
    field: "Architecture",
    institution: "Oduduwa University Ipetumodu",
    location: "Osun State, Nigeria",
    year: "2024",
  },
];
